package com.sfs.smartsfs.app



import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.SpringSecurityUtils
import grails.transaction.Transactional

import org.hibernate.criterion.Restrictions

@Transactional(readOnly = true)
class ConfigPropertyController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService

	def index() {
		//adminProperties moze citat iba ROLE_SUPER
		if(SpringSecurityUtils.ifNotGranted("ROLE_SUPER")){
			respond response:responseSCService.gridResponse(ConfigProperty.class,params,Restrictions.sqlRestriction("admin_property=0"))
		}else{
			respond response:responseSCService.gridResponse(ConfigProperty.class,params)
		}
	}

	@Transactional
	def save() {
		ConfigProperty instance = ConfigProperty.newInstance(params)
		//		instance.id = Long.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		try {
			instance.save flush:true
		} catch (Exception e) {
			respond response:[status:-1,data:e.message]
			return
		}

		respond response:[status:0,data:instance]
	}

	@Transactional
	def update() {
		ConfigProperty instance = ConfigProperty.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"ConfigProperty.label"),
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

		try {
			instance.save flush:true
		} catch (Exception e) {
			respond response:[status:-1,data:e.message]
			return
		}

		respond response:[status:0,data:instance]
	}

	@Transactional
	def delete() {
		ConfigProperty instance = ConfigProperty.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[
					message(code:"ConfigProperty.label"),
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


		try {
			instance.delete flush:true
		} catch (Exception e) {
			respond response:[status:-1,data:e.message]
			return
		}
		respond response:[status:0,data:instance]
	}

}
