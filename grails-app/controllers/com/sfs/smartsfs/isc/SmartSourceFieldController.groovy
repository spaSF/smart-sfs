package com.sfs.smartsfs.isc

import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SmartSourceFieldController {
	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]
	def responseSCService
	def index(){
		if(params.id){
			respond response:[status:0,data:SmartSourceField.get(params.id as Long),startRow:1,endRow:1,totalRows:1]
		}else {
			respond response:responseSCService.gridResponse(SmartSourceField.class,params)
		}
	}

	@Transactional
	def save() {
		log.debug "SAVE params:"+params
		SmartSourceField instance = SmartSourceField.newInstance(params)
		//		instance.id = Long.valueOf(params.id) //id nesetne!
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
		SmartSourceField instance = SmartSourceField.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[message(code:"SmartSourceField.label"), params.id])]
			return
		}

		log.debug params
		def inAtt = params
		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			respond response:[status:-4,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
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

		SmartSourceField.withTransaction {status->
			try {
				instance.save flush:true
			} catch (Exception e) {
				respond response:[status:-1,data:e.message]
				status.setRollbackOnly()
				return
			}
		}

		respond response:[status:0,data:instance]
	}

	@Transactional
	def delete() {
		SmartSourceField instance = SmartSourceField.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[message(code:"SmartSourceField.label"), params.id])]
			return
		}

		def inAtt = params
		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			respond response:[status:-4,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
			return
		}


		SmartSourceField.withTransaction {status->
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
