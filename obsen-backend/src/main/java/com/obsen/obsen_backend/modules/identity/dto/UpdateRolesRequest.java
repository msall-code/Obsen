package com.obsen.identity.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateRolesRequest {
    private List<String> roles;
}