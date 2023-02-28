package com.sfs.smartsfs.sec



import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

import com.sfs.smartsfs.app.Localization

@Transactional(readOnly = true)
class LocaleLangController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService

	def index() {
		if(params.id){
			respond response:[status:0,data:LocaleLang.get(params.id as String),startRow:1,endRow:1,totalRows:1]
		}else{
			respond response:responseSCService.gridResponse(LocaleLang.class,params)
		}
	}

	@Transactional
	def save() {
		LocaleLang instance = LocaleLang.newInstance(params)
		instance.id = String.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}
		LocaleLang.withTransaction {status->
			try {
				instance.save flush:true
				//create localization messages for language by copy default
				Localization.findAllByLocale("*").each {lc->
					Localization klon = new Localization(lc.properties)
					klon.id=null
					klon.locale=instance.id
					klon.save flush:true
				}
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
		LocaleLang instance = LocaleLang.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"LocaleLang.label"),
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

		LocaleLang.withTransaction {status->
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
		LocaleLang instance = LocaleLang.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[
					message(code:"LocaleLang.label"),
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


		LocaleLang.withTransaction {status->
			try {
				instance.delete flush:true
				Localization.findAllByLocale(instance.id).each { it.delete flush:true }
			} catch (Exception e) {
				status.setRollbackOnly()
				respond response:[status:-1,data:e.message]
				return
			}
		}
		respond response:[status:0,data:instance]
	}

}
