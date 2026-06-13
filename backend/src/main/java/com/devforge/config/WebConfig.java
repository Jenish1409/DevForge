package com.devforge.config;

import com.devforge.interceptor.MockSecurityInterceptor;
import com.devforge.interceptor.MockTrafficInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final MockSecurityInterceptor mockSecurityInterceptor;
    private final MockTrafficInterceptor mockTrafficInterceptor;

    @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(mockSecurityInterceptor)
                .addPathPatterns("/mock/**")
                .order(1);

        registry.addInterceptor(mockTrafficInterceptor)
                .addPathPatterns("/mock/**")
                .order(2);
    }

    @Override
    public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
        // Secure internal dashboard APIs
        registry.addMapping("/api/v1/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);

        // Keep mock APIs open for developers to hit from their own frontends
        registry.addMapping("/mock/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*");
    }
}
