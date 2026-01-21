package com.orrs.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.orrs.dto.request.RegisterReqDTO;
import com.orrs.dto.request.UpdatePasswordReqDTO;
import com.orrs.dto.request.UpdateUserReqDTO;
import com.orrs.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

	private final UserService userService;

	
//	 POST /users/register
//	   - Register new user account
//	   - Input: { fullName, email, password, cnfPassword mobile }
//	   - Output: { message, status, data(userId), time_stamp }
//     - Doesn't require authentication
	@PostMapping("/register")
	public ResponseEntity<?> resisterUser(@RequestBody @Valid RegisterReqDTO regDto){
		//Error :- RequestBody must be imported from org.springframework.web.bind.annotation
		System.out.println(regDto);
		return ResponseEntity.ok(userService.registerNewUser(regDto));
	}
	
//	 GET /users/{userId}
//	   - Get user profile details
//	   - Output: {message, status, data( userId, fullName, email, mobile, gender, dob, address, preferredClass), time_stamp }
//	   - Requires authentication
//	   - User can only view their own profile (or admin can view any)
	@GetMapping("/{userId}")
	public ResponseEntity<?> getUserDetails(@PathVariable @NotNull @Min(1) Long userId){
		return ResponseEntity.ok(userService.getUserDetails(userId));
	}

//	PUT /users/update/{userId}
//	   - Update user profile
//	   - Input: {  userId, fullName, email, mobile, gender, dob, address, preferredClass }
//	   - Output: Updated user object mapped to UserDetailsRespDTO
//	   - Requires authentication
//	   - Cannot update password, role through this end_point

	@PutMapping("/update/{userId}")
	public ResponseEntity<?> updateUserDetails(@RequestBody @Valid UpdateUserReqDTO updatedUserDto, @PathVariable @NotNull Long userId){
		return ResponseEntity.ok(userService.updateUserDetails(updatedUserDto, userId));
	}
	
//	 PATCH /users/update/password/{userId}
//	   - Change user password
//	   - Input: { oldPassword, newPassword, newCnfPassword }
//	   - Output: { message, status, data(null), time_stamp }
//	   - Requires authentication
//	   - Validates old password before updating
	@PatchMapping("/update/password/{userId}")
	public ResponseEntity<?> updateUserPassword(@RequestBody @Valid  UpdatePasswordReqDTO passwordDto, @PathVariable @NotNull Long userId){
		return ResponseEntity.ok(userService.updateUserPassword(passwordDto, userId));
	}
	
//	 DELETE /users/{userId}
//	   - Soft delete user account
//	   - Sets user status to deleted
//	   - Requires authentication (user end_point)
	@DeleteMapping("/{userId}")
	public ResponseEntity<?> deleteAccount(@PathVariable @NotNull @Min(1) Long userId ){
		return ResponseEntity.ok(userService.deleteAccount(userId));
	}

	
}
