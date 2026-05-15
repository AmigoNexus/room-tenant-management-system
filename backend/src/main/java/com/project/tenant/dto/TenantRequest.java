package com.project.tenant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TenantRequest {
    private Long id; // For updates
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String occupation;
    private String idProof;
    private String profileImage;
    private Boolean active;
}
