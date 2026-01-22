package com.orrs.dto.response;

import com.orrs.enums.AccountStatus;
import com.orrs.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminViewDTO {
	
	private Long userId;
	private String fullName;
	private String email;
	private String mobile;
	private Role role;
	private AccountStatus status;
}
