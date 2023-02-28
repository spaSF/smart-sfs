package com.sfs.smartsfs.sec

import grails.plugin.springsecurity.userdetails.GrailsUser
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.GrantedAuthority

class ScUserDetails extends GrailsUser {

	final String name
	final String surname
	final String email
	final String lang
	final String country
	final Boolean firstOTPLogin
	final String qr

	ScUserDetails(String username, String password, boolean enabled,
	boolean accountNonExpired, boolean credentialsNonExpired,
	boolean accountNonLocked,
	Collection<GrantedAuthority> authorities,
	long id, String name,String surname,String email,String lang,String country,Boolean firstOTPLogin,String qr) {
		super(username, password, enabled, accountNonExpired,
		credentialsNonExpired, accountNonLocked, authorities, id)

		this.name= name
		this.surname = surname
		this.email = email
		this.lang = lang
		this.country = country
		this.firstOTPLogin=firstOTPLogin
		this.qr = qr
	}
}
