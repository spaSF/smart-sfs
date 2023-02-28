package com.sfs.smartsfs.sec

import org.springframework.http.HttpMethod

class RequestMap {

	String url
	String configAttribute
	HttpMethod httpMethod

	static mapping = {
		table 'SC_REQUEST_MAP'
		id generator:'native',params:[sequence:'SC_REQUESTMAP_SEQ']
		cache true
	}

	static constraints = {
		url blank: false, unique: 'httpMethod'
		configAttribute blank: false
		httpMethod nullable: true
	}
}
