package com.sfs.smartsfs.isc

import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SmartOperationController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService

	def index() {
		respond response:responseSCService.gridResponse(SmartOperation.class,params)
	}

	@Transactional
	def save() {
		SmartOperation instance = SmartOperation.newInstance(params)
		//		instance.id = Long.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}
		SmartOperation.withTransaction {status->
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
		SmartOperation instance = SmartOperation.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"SmartOperation.label"),
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

		SmartOperation.withTransaction {status->
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
		SmartOperation instance = SmartOperation.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[
					message(code:"SmartOperation.label"),
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


		SmartOperation.withTransaction {status->
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

	/**
	 * vyrob klon smart operacie
	 * @author mkr
	 * @param id operacie original
	 * @param smartDS pod akym DS ulozit kopiu operacie
	 */
	@Transactional
	def cloneOperation() {
		log.debug params
		if(params.id&&params.smartDS){
			SmartOperation orig = SmartOperation.lock(params.id)
			if (!orig) {
				respond response:[status:-4,data:orig,message:message(code:"default.not.found.message",args:[message(code:"SmartOperation.label"), params.id])]
				return
			}

			SmartOperation klon = orig.clone()
			klon.dSource=SmartSource.findWhere(ID:params.smartDS)

			klon.getOperationParams()*.validate()
			klon.validate()
			if (klon.hasErrors()) {
				respond response:[status:-4,data:klon,errors:responseSCService.handleValidationErrors(klon.errors)]
				return
			}

			try {
				klon.save flush:true
			} catch (Exception e) {
				e.printStackTrace()

				respond response:[status:-1,data:klon,errors:["":e.message]]
				return
			}

			respond response:[status:0,data:klon]

		}else{
			respond response:[status:-1,data:message(code:"smartOperation.call.paramserror.message",args:[message(code:"smartOperation.cloneOperation")])]
		}
	}
}
