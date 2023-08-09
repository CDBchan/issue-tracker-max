package com.codesquad.issuetracker.api.oauth.config;

import com.codesquad.issuetracker.api.oauth.InMemoryProviderRepository;
import com.codesquad.issuetracker.api.oauth.OauthAdapter;
import com.codesquad.issuetracker.api.oauth.OauthProperties;
import com.codesquad.issuetracker.api.oauth.OauthProvider;
import java.util.Map;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(OauthProperties.class)
public class OauthConfig {

    private final OauthProperties properties;

    public OauthConfig(OauthProperties properties) {
        this.properties = properties;
    }

    // 추가된 부분
    @Bean
    public InMemoryProviderRepository inMemoryProviderRepository() {
        Map<String, OauthProvider> providers = OauthAdapter.getOauthProviders(properties);
        return new InMemoryProviderRepository(providers);
    }

}