package com.orrs.dto.common;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ApiResponseDTO<T> {

	private String message;
	private String status;
	private T data;
	private LocalDateTime timeStamp;
	
	public ApiResponseDTO(String message, String status, T data) {
		super();
		this.message = message;
		this.status = status;
		this.data = data;
		this.timeStamp = LocalDateTime.now();
	}
	
}
