package com.codesquad.issuetracker.api.common.controller;

import com.codesquad.issuetracker.api.common.dto.NavigationResponse;
import com.codesquad.issuetracker.api.common.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class CommonController {

    private final CommonService commonService;

    @GetMapping("/api/{organizationTitle}/common/navigation")
    public ResponseEntity<NavigationResponse> getNavigationInfo(@PathVariable String organizationTitle) {
        NavigationResponse navigationResponse = commonService.getNavigationInfo(organizationTitle);
        return ResponseEntity.ok(navigationResponse);
    }
}
