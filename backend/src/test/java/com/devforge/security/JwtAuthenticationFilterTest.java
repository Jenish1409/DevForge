package com.devforge.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Valid JWT token populates SecurityContext with authenticated user")
    void validToken_populatesSecurityContext() throws ServletException, IOException {
        String token = "valid.jwt.token";
        String username = "testuser";

        UserDetails userDetails = new User(username, "password", Collections.emptyList());

        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.extractUsername(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, userDetails)).thenReturn(true);

        filter.doFilterInternal(request, response, filterChain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication(),
                "SecurityContext should contain an authentication after a valid token");
        assertEquals(username, SecurityContextHolder.getContext().getAuthentication().getName(),
                "Authenticated principal should match the token's username");

        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Malformed JWT token is handled cleanly without 500 crash")
    void malformedToken_doesNotCrash() throws ServletException, IOException {
        request.addHeader("Authorization", "Bearer totally.invalid.garbage");

        when(jwtService.extractUsername("totally.invalid.garbage"))
                .thenThrow(new RuntimeException("Malformed JWT"));

        // Should NOT throw — the filter catches exceptions internally
        assertDoesNotThrow(() -> filter.doFilterInternal(request, response, filterChain));

        assertNull(SecurityContextHolder.getContext().getAuthentication(),
                "SecurityContext should remain empty after a malformed token");

        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Request without Authorization header passes through without authentication")
    void noAuthHeader_passesThrough() throws ServletException, IOException {
        // No Authorization header at all
        filter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication(),
                "SecurityContext should remain empty when no Authorization header is present");

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService, userDetailsService);
    }

    @Test
    @DisplayName("Request with non-Bearer Authorization header passes through")
    void nonBearerHeader_passesThrough() throws ServletException, IOException {
        request.addHeader("Authorization", "Basic dXNlcjpwYXNz");

        filter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication(),
                "SecurityContext should remain empty for non-Bearer auth schemes");

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService, userDetailsService);
    }

    @Test
    @DisplayName("Mock endpoint requests bypass filter cleanly (no Bearer header)")
    void mockEndpointRequest_bypassesFilter() throws ServletException, IOException {
        request.setRequestURI("/mock/some-project-id/users");
        // No Authorization header — mock endpoints are public

        filter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication(),
                "Mock endpoint requests should pass through without authentication");

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService, userDetailsService);
    }

    @Test
    @DisplayName("Expired token does not authenticate user")
    void expiredToken_doesNotAuthenticate() throws ServletException, IOException {
        String token = "expired.jwt.token";
        String username = "testuser";

        UserDetails userDetails = new User(username, "password", Collections.emptyList());

        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.extractUsername(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, userDetails)).thenReturn(false);

        filter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication(),
                "SecurityContext should remain empty for expired tokens");

        verify(filterChain).doFilter(request, response);
    }
}
