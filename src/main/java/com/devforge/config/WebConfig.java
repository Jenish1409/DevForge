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

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(mockSecurityInterceptor)
                .addPathPatterns("/mock/**")
                .order(1);

        registry.addInterceptor(mockTrafficInterceptor)
                .addPathPatterns("/mock/**")
                .order(2);
    }
}
