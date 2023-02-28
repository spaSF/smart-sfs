package com.sfs.smartsfs.sec

class Role {

	String authority
	String description

	static mapping = {
		table 'SC_ROLE'
		id generator:'native',params:[sequence:'SC_ROLE_SEQ']
		cache true
	}

	static constraints = {
		authority blank: false, unique: true
	}
}
