package com.sfs.smartsfs.sec

import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.SpringSecurityUtils
import grails.transaction.Transactional

import org.hibernate.criterion.Restrictions

@Transactional(readOnly = true)
class UserController {
	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]
	static responseFormats = ['json']
	def springSecurityService
	def responseSCService
	def configHolderService
	def scOTPService

	def loadUser(){

		def auth = springSecurityService.principal
		log.debug auth
		if(!params.username){
			respond response:[status:-7,data:auth]
		}else{
			if(params.username!=auth.username){
				respond response:[status:-5,data:auth]
			}else{
				respond response:[status:0,data:auth]
			}
		}
	}

	@Transactional
	def deleteQR(){
		User instance = User.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"user.label"), params.id])]
			return
		}

		String qrnum = params.get("qrnum")
		scOTPService.deleteQR(instance.username,qrnum)
		respond response:[status:0,data:instance]
	}

	@Transactional
	def showOtpQR(){
		User instance = User.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"user.label"), params.id])]
			return
		}
		UserOtp otp = UserOtp.findByUsername(instance.username)
		if(otp?.otpKey){
			String qrPostfix
			try {
				qrPostfix=scOTPService.generateQrPostfix()
				scOTPService.generateQR(instance.username,otp.otpKey,qrPostfix)
			} catch (Exception e) {
				e.printStackTrace()
				status.setRollbackOnly()
				respond response:[status:-1,data:e.message]
				return
			}
			respond response:[status:0,data:[qrnum:qrPostfix]]
		}else{
			respond response:[status:-1,data:message(code:"smartsfs.security.otp.otpKeyNotExists")]
			return
		}
	}
	/**
	 * reset user OTP key
	 * @return
	 */
	@Transactional
	def resetOtpKey(){
		User instance = User.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"user.label"), params.id])]
			return
		}

		if(springSecurityService.principal.username!=instance.username&&SpringSecurityUtils.ifNotGranted("ROLE_ADMIN")){
			respond response:[status:-1,data: message(code:"springSecurity.denied.message")]
			return
		}
		UserOtp otp = UserOtp.findByUsername(instance.username)
		if(otp){
			User.withTransaction {status->
				try {
					otp.otpKey=null
					otp.save flush:true
				} catch (Exception e) {
					e.printStackTrace()
					status.setRollbackOnly()
					respond response:[status:-1,data:e.message]
					return
				}
			}
		}
		respond response:[status:0,data:instance]
	}

	def hasRole(){
		if(params.requiresRole){
			if(springSecurityService.isLoggedIn()){
				if(SpringSecurityUtils.ifAnyGranted(params.requiresRole)){
					respond response:[status:0,data:""]
				}else{
					respond response:[status:-1,data:message(code:"springSecurity.denied.message")]
				}
			}else{
				respond response:[status:-1,data:message(code:"springSecurity.errors.notLoggedIn")]
			}
		}
		respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"role.label"), null])]
	}

	def getAllRoles(){
		//default ide asociacia cez Advanced criteria
		Set<Role> roles
		if(params.criteria){
			def criteria = responseSCService.parseAsJson( params.criteria)
			if(criteria.fieldName=="_masterId" ) roles= User.get(criteria.value)?.getAllAuthorities()
		}
		respond response:[status:0,data:roles,startRow:0,endRow:roles?.size()?:0,totalRows:roles?.size()?:0]

	}

	def getGroups(){
		Set<RoleGroup> groups
		if(params.criteria){
			//default ide asociacia cez Advanced criteria
			def criteria = responseSCService.parseAsJson( params.criteria)
			if(criteria.fieldName=="_masterId" ) groups= User.get(criteria.value)?.getAuthorities()
		}
		respond response:[status:0,data:groups,startRow:0,endRow:groups?.size()?:0,totalRows:groups?.size()?:0]

	}

	@Transactional
	def saveGroup(){
		User master = User.get(params._masterId)
		if (!master) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"user.label"), params.id])]
			return
		}
		def inAtt = params
		RoleGroup group = RoleGroup.get(inAtt.id)
		if (!group) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"roleGroup.label"), params.id])]
			return
		}
		if(!UserRoleGroup.exists(master.id,group.id) ){
			UserRoleGroup.withTransaction {status->
				try {
					UserRoleGroup.create(master,group,true)
					if (springSecurityService.loggedIn &&
					springSecurityService.principal.username == master.username) {
						springSecurityService.reauthenticate master.username
					}
				} catch (Exception e) {
					status.setRollbackOnly()
					respond response:[status:-1,data:e.message]
					return
				}
			}
		}
		respond response:[status:0,data:group]
	}

	@Transactional
	def deleteGroup(){
		User master = User.get(params._masterId)
		if (!master) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"user.label"), params.id])]
			return
		}
		def inAtt = params
		RoleGroup group = RoleGroup.get(inAtt.id)
		if (!group) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"roleGroup.label"), params.id])]
			return
		}
		if(UserRoleGroup.exists(master.id,group.id) ){
			UserRoleGroup.withTransaction {status->
				try {
					UserRoleGroup.remove(master,group,true)
					if (springSecurityService.loggedIn &&
					springSecurityService.principal.username == master.username) {
						springSecurityService.reauthenticate master.username
					}
				} catch (Exception e) {
					status.setRollbackOnly()
					respond response:[status:-1,data:e.message]
					return
				}
			}
		}
		respond response:[status:0,data:group]
	}



	def getRoles(){
		//default ide asociacia cez Advanced criteria
		Set<Role> roles = new ArrayList<Role>()
		if(params.criteria){
			def criteria = responseSCService.parseAsJson( params.criteria)
			if(criteria.fieldName=="_masterId" ) roles= User.get(criteria.value)?.getUserAuthorities()
		}
		respond response:[status:0,data:roles,startRow:0,endRow:roles?.size()?:0,totalRows:roles?.size()?:0]
	}

	@Transactional
	def saveRole(){
		User master = User.get(params._masterId)
		if (!master) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"user.label"), params.id])]
			return
		}
		def inAtt = params
		Role rola = Role.get(inAtt.id)
		if (!rola) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"role.label"), params.id])]
			return
		}
		if(!UserRole.exists(master.id,rola.id) ){
			UserRole.withTransaction {status->
				try {
					UserRole.create(master,rola,true)
					if (springSecurityService.loggedIn &&
					springSecurityService.principal.username == master.username) {
						springSecurityService.reauthenticate master.username
					}
				} catch (Exception e) {
					status.setRollbackOnly()
					respond response:[status:-1,data:e.message]
					return
				}
			}
		}
		respond response:[status:0,data:rola]
	}

	@Transactional
	def deleteRole(){
		User master = User.get(params._masterId)
		if (!master) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"user.label"), params.id])]
			return
		}
		def inAtt = params
		Role rola = Role.get(inAtt.id)
		if (!rola) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"role.label"), params.id])]
			return
		}
		if(UserRole.exists(master.id,rola.id) ){
			UserRole.withTransaction {status->
				try {
					UserRole.remove(master,rola,true)
					if (springSecurityService.loggedIn &&
					springSecurityService.principal.username == master.username) {
						springSecurityService.reauthenticate master.username
					}
				} catch (Exception e) {
					status.setRollbackOnly()
					respond response:[status:-1,data:e.message]
					return
				}
			}
		}
		respond response:[status:0,data:rola]
	}

	@Transactional
	def save() {
		def inAtt = params

		User instance = User.newInstance(inAtt)
		instance.password=inAtt.password
		//		instance.id = Long.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}
		User.withTransaction {status->
			try {
				instance.save flush:true
			} catch (Exception e) {
				status.setRollbackOnly()
				respond response:[status:-1,data:e.message]
				return
			}
		}
		respond response:[status:0,data:instance]
	}

	@Transactional
	def update() {
		User instance = User.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"user.label"), params.id])]
			return
		}

		def inAtt = params
		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			respond response:[status:-1,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
			return
		}
		inAtt.remove("dateCreated")
		inAtt.remove("lastUpdated")
		inAtt.remove("password")//iba cez zmenu hesla

		if(inAtt?.orgId) inAtt.orgId = String.valueOf(inAtt.orgId)
		if(inAtt?.orgUnitId) inAtt.orgUnitId = String.valueOf(inAtt.orgUnitId)
		instance.properties = inAtt
		instance.validate()

		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		User.withTransaction {status->
			try {
				instance.save flush:true
				if (springSecurityService.loggedIn &&
				springSecurityService.principal.username == instance.username) {
					springSecurityService.reauthenticate instance.username
				}
			} catch (Exception e) {
				e.printStackTrace()
				status.setRollbackOnly()
				respond response:[status:-1,data:e.message]
				return
			}
		}
		respond response:[status:0,data:instance]
	}


	@Transactional
	def updatePassword() {
		String username = params.username
		boolean expired=params["expired"]?.asBoolean()
		def auth
		if(expired){
			username = params["expiredUser"]
			auth = User.findByUsername(username)
		}else auth = springSecurityService.principal

		username = username?:auth.username

		def isResetByAdmin = auth.username!=username
		if(isResetByAdmin&&SpringSecurityUtils.ifNotGranted("ROLE_ADMIN")){
			respond response:[status:-1,data: message(code:"springSecurity.denied.message")]
			return
		}
		if (!username) {
			respond response:[status:-1,data: message(code:"springSecurity.expired.errors.fatal")]
			return
		}
		String password = params.password
		String newPassword = params.password_new
		String newPassword2 = params.password_new_2
		if ((!password&&(!isResetByAdmin||SpringSecurityUtils.ifNotGranted("ROLE_ADMIN"))) || !newPassword || !newPassword2 || newPassword != newPassword2) {
			respond response:[status:-1,data:message(code:"springSecurity.expired.errors.badPasswords")]
			return
		}

		User user = User.findByUsername(username)
		if(!user){
			respond response:[status:-1,data:message(code:"springSecurity.errors.login.fail")]
			return
		}
		if (!isResetByAdmin&&!springSecurityService.passwordEncoder.isPasswordValid(user.password, password, null /*salt*/)) {
			respond response:[status:-4,errors:['password':message(code:"springSecurity.expired.errors.badCurrent")]]
			return
		}

		if (!isResetByAdmin&&springSecurityService.passwordEncoder.isPasswordValid(user.password, newPassword, null /*salt*/)) {
			respond response:[status:-4,errors:['password_new':message(code:"springSecurity.expired.errors.notChanged")]]
			return
		}
		User.withTransaction {status->

			try {
				user.password = newPassword
				user.passwordExpired = false
				user.save flush:true // if you have password constraints check them here

			} catch (Exception e) {
				e.printStackTrace()
				status.setRollbackOnly()
				respond response:[status:-1,data:e.message]
				return
			}
		}
		respond response:[status:0,data:"OK"]
	}


	def index() {
		def hideAdmin=new Boolean(configHolderService.getValueForKey('smartsfs.nadm'))?:false

		if(hideAdmin==true&&SpringSecurityUtils.ifNotGranted("ROLE_SUPER")){
			def restr = "{alias}.id not in(select r.user_id from SC_ROLE a,SC_USER_ROLE r where a.authority='ROLE_SUPER' and r.role_id=a.id)"
			respond response:responseSCService.gridResponse(User.class,params,Restrictions.sqlRestriction(restr))
		}else{
			respond response:responseSCService.gridResponse(User.class,params)
		}
	}
}
