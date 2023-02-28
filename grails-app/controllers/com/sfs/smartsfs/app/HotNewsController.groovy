package com.sfs.smartsfs.app



import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.SpringSecurityUtils
import grails.transaction.Transactional

@Transactional(readOnly = true)
class HotNewsController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService

	def index() {
		def resp=responseSCService.gridResponse(HotNews.class,params)
		resp.data.each {row->
			if(row.needrole && !SpringSecurityUtils.ifAnyGranted(row.needrole)){
				resp.data = resp.data - row
				log.debug "remove secured menuItem: ${row}"
				resp.endRow--
				resp.totalRows--
			}
		}
		respond response:resp
	}
	
	@Transactional
	def save() {
		HotNews instance = HotNews.newInstance(params)
		//		instance.id = Long.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}
		HotNews.withTransaction {status->
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
		HotNews instance = HotNews.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"hotNews.label"),
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
		
		// ak sa menil html text
		if (instance.getPersistentValue('messageText') != inAtt._messageText) {
			instance.messageText = inAtt._messageText
		}
		
		instance.validate()

		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		HotNews.withTransaction {status->
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
		HotNews instance = HotNews.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[
					message(code:"hotNews.label"),
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


		HotNews.withTransaction {status->
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
