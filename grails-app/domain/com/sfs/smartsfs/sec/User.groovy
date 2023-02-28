package com.sfs.smartsfs.sec

class User {

	def springSecurityService

	String username
	String password
	String name
	String surname
	String email
	LocaleLang lang
	LocaleCountry country
	
	boolean enabled = true
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired

//	static transients = ['springSecurityService']

	static constraints = {
		username blank: false, unique: true
		password blank: false, bindable:false
		name nullable:true
		surname nullable:true
		email nullable:true,email:true
	}

	static mapping = {
		tablePerHierarchy true
		table 'SC_USER'
		id generator:'native',params:[sequence:'SC_USER_SEQ']
		password column: '`password`'
		lang column:'LANG',length:2
		country column:'COUNTRY',length:2
	}

	Set<RoleGroup> getAuthorities() {
		UserRoleGroup.findAllByUser(this).collect { it.roleGroup }
	}

	Set<Role> getUserAuthorities() {
		UserRole.findAllByUser(this).collect { it.role }
	}

	Set<Role> getAllAuthorities() {
		def allRoles=this.getUserAuthorities()
		allRoles=allRoles+(this.getAuthorities()*.getAuthorities()).flatten()
		return allRoles
	}

	
	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if (isDirty('password')) {
			encodePassword()
		}
	}

	protected void encodePassword() {
		password = springSecurityService?.passwordEncoder ? springSecurityService.encodePassword(password) : password
	}
}
