package com.sfs.smartsfs.isc



import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

import org.codehaus.groovy.grails.web.json.JSONObject
import org.hibernate.criterion.Restrictions
import org.springframework.dao.PessimisticLockingFailureException

import com.sfs.smartsfs.sec.User

@Transactional(readOnly = true)
class SmartUserSettingsController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService
	def springSecurityService
	
	def bkpindex() {
		respond response:responseSCService.gridResponse(SmartUserSettings.class,params)
	}

	def index() {
		def nameIsNull
		// daj default userSetting
		if (params.criteria) {
			def crit = params.criteria			
			crit.each {
				JSONObject userJson = JSON.parse(it)
				if (userJson.fieldName == "name" && userJson.operator == "isNull") nameIsNull = userJson.operator
				println(nameIsNull)
			}
			if (!params.name && springSecurityService.principal.username != 'admin' && nameIsNull == "isNull") {
				String adm = "user_id=" + User.findByUsername('admin').id
				def resp = responseSCService.gridResponse(SmartUserSettings.class,params,Restrictions.sqlRestriction(adm))
				if (resp) {
					respond response:resp
					return
				}
			}
		}
		def usr = "user_id="+springSecurityService.principal.id
		respond response:responseSCService.gridResponse(SmartUserSettings.class,params,Restrictions.sqlRestriction(usr))
	}
		
	@Transactional
	def save() {
		println params	
		
		def usr = User.get(params.user)
		def chkExists = SmartUserSettings.findByAppCaseAndAppObjectAndNameAndUser(params.appCase, params.appObject, params.name, usr)
		if (chkExists) {
			params.id = chkExists.id
			update()
			return
		}
		
		SmartUserSettings instance = SmartUserSettings.newInstance(params)
		instance.setUser(usr)
		//		instance.id = Long.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}
		SmartUserSettings.withTransaction {status->
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
		
		println params
		SmartUserSettings instance
		try {
			instance = SmartUserSettings.lock(params.id)
		} catch (PessimisticLockingFailureException e) {
			e.printStackTrace()
			respond response:[status:-1,data:message(code:"default.optimistic.locking.failure",args:[params.id])]
			return
		}
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"smartUserSettings.label"),
					params.id
				])]
			return
		}

		def usr = User.findByUsername('admin')
		instance.setUser(usr)
		
		def inAtt = params
		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			respond response:[status:-1,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
			return
		}
		instance.properties = inAtt
		instance.validate()

		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		SmartUserSettings.withTransaction {status->
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
	def delete() {
		SmartUserSettings instance = SmartUserSettings.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[
					message(code:"SmartUserSettings.label"),
					params.id
				])]
			return
		}

		def inAtt = params
		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			respond response:[status:-4,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
			return
		}


		SmartUserSettings.withTransaction {status->
			try {
				instance.delete flush:true
			} catch (Exception e) {
				status.setRollbackOnly()
				respond response:[status:-1,data:e.message]
				return
			}
		}
		respond response:[status:0,data:instance]
	}

}
