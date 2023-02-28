package com.sfs.smartsfs.sec

class RoleGroup {

	String name
	String description

	static mapping = {
		table 'SC_ROLE_GROUP'
		id generator:'native',params:[sequence:'SC_ROLE_GROUP_SEQ']
		cache true
	}

	Set<Role> getAuthorities() {
		RoleGroupRole.findAllByRoleGroup(this).collect { it.role }
	}

	static constraints = {
		name blank: false, unique: true
	}
}
