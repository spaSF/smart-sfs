package com.sfs.smartsfs.sec



import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.SpringSecurityUtils
import grails.transaction.Transactional

import org.hibernate.criterion.Restrictions

@Transactional(readOnly = true)
class RoleController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService
	def configHolderService

	def index() {
		def hideAdmin=new Boolean(configHolderService.getValueForKey('smartsfs.nadm'))?:false

		if(hideAdmin==true&&SpringSecurityUtils.ifNotGranted("ROLE_SUPER")){
			def restr = "authority<>'ROLE_SUPER'"
			respond response:responseSCService.gridResponse(Role.class,params,Restrictions.sqlRestriction(restr))
		}else{
			respond response:responseSCService.gridResponse(Role.class,params)
		}
	}

	@Transactional
	def save() {
		Role instance = Role.newInstance(params)
		//		instance.id = Long.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}
		Role.withTransaction {status->
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
		Role instance = Role.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"Role.label"),
					params.id
				])]
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
		instance.properties = inAtt
		instance.validate()

		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		Role.withTransaction {status->
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
		Role instance = Role.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[
					message(code:"Role.label"),
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


		Role.withTransaction {status->
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
