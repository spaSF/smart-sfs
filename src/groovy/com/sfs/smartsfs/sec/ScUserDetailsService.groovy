package com.sfs.smartsfs.sec

import grails.plugin.springsecurity.userdetails.GormUserDetailsService
import grails.plugin.springsecurity.userdetails.NoStackUsernameNotFoundException
import grails.transaction.Transactional

import org.apache.commons.logging.LogFactory
import org.springframework.context.i18n.LocaleContextHolder as LCH
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException

@Transactional
class ScUserDetailsService extends GormUserDetailsService {
	def springSecurityService //inject grails SpringSecurityService pre pristup k principal
	def scOTPService
	public static final String ROLE_PRE_AUTH = "ROLE_PRE_AUTH";
	private static final log = LogFactory.getLog(this)

	@Override
	protected Collection<GrantedAuthority> loadAuthorities(user, String username, boolean loadRoles) {
		if (!loadRoles) {
			return []
		}
		def role=user.getAllAuthorities().collect { new SimpleGrantedAuthority(it.authority) }
		return role
	}

	@Override
	public UserDetails loadUserByUsername(String username, boolean loadRoles)
	throws UsernameNotFoundException {
		log.debug LCH.getLocale()
		User.withTransaction { status ->
			if(scOTPService.otpEnabled()){
				def principal=springSecurityService.getPrincipal()
				if(principal?.authorities?.find {it.getAuthority()==ROLE_PRE_AUTH}){
					def user = User.findByUsername(principal.username)
					if(!user){
						log.warn "User not found: ${principal.username}"
						throw new NoStackUsernameNotFoundException()
					}
					//uz preliezol cez password=>treba vratit OTP ako password
					def userOtp = UserOtp.findByUsername(principal.username)
					String otpKey = userOtp?.getOtpKey()
					if(!otpKey){
						log.warn "User OTP key not found: ${principal.username}"
						throw new NoStackUsernameNotFoundException()
					}
					String otp=scOTPService.generateOTPcode(otpKey)
					String otpPassword=springSecurityService.encodePassword(otp)
					String qr=String.valueOf(userOtp.version)
					scOTPService.deleteQR(user.username,qr)
					Collection<GrantedAuthority> authorities = loadAuthorities(user, username, loadRoles)
					return new ScUserDetails(user.username, otpPassword, user.enabled, !user.accountExpired,
							!user.passwordExpired, !user.accountLocked, authorities, user.id,user.name,user.surname,user.email,user.lang?.getId(),user.country?.getId()
							,false,qr)

				}else{
					def user = User.findByUsername(username)
					if (!user) {
						log.warn "User not found: $username"
						throw new NoStackUsernameNotFoundException()
					}
					String qr
					def userOtp = UserOtp.findByUsername(username)
					boolean firstOtpLogin=(userOtp?.getOtpKey()?false:true)&&!user.passwordExpired
					if(firstOtpLogin){
						if(!userOtp){
							//create
							userOtp = new UserOtp()
							userOtp.username=user.username
						}
						userOtp.otpKey=scOTPService.generateOTPKey()
						userOtp.save(flush:true)
						log.debug userOtp.version
						qr=String.valueOf(userOtp.version)
						scOTPService.generateQR(user.username,userOtp.otpKey,qr)
					}
					Collection<GrantedAuthority> authorities = [new SimpleGrantedAuthority(ROLE_PRE_AUTH)] as List
					return new ScUserDetails(user.username, user.password, user.enabled, !user.accountExpired,
							!user.passwordExpired, !user.accountLocked, authorities, user.id,user.name,user.surname,user.email,user.lang?.getId(),user.country?.getId()
							,firstOtpLogin,qr)
				}
			}else{
				def user = User.findByUsername(username)
				if (!user) {
					log.warn "User not found: $username"
					throw new NoStackUsernameNotFoundException()
				}
				Collection<GrantedAuthority> authorities = loadAuthorities(user, username, loadRoles)
				return new ScUserDetails(user.username, user.password, user.enabled, !user.accountExpired,
						!user.passwordExpired, !user.accountLocked, authorities, user.id,user.name,user.surname,user.email,user.lang?.getId(),user.country?.getId()
						,false,"")
			}
		}
	}
}
