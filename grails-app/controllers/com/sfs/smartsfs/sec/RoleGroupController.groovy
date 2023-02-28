package com.sfs.smartsfs.sec



import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class RoleGroupController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService

	def index() {
		respond response:responseSCService.gridResponse(RoleGroup.class,params)
	}

	def getRoles(){
		//default ide asociacia cez Advanced criteria
		Set<Role> roles = new ArrayList<Role>()
		if(params.criteria){
			def criteria = responseSCService.parseAsJson( params.criteria)
			if(criteria.fieldName=="_masterId" ) roles= RoleGroup.get(criteria.value)?.getAuthorities()
		}
		respond response:[status:0,data:roles,startRow:0,endRow:roles?.size()?:0,totalRows:roles?.size()?:0]
	}

	@Transactional
	def saveRole(){
		RoleGroup master = RoleGroup.get(params._masterId)
		if (!master) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"roleGroup.label"),
					params.id
				])]
			return
		}
		def inAtt = params
		Role rola = Role.get(inAtt.id)
		if (!rola) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"role.label"),
					params.id
				])]
			return
		}
		if(!RoleGroupRole.exists(master.id,rola.id) ){
			RoleGroupRole.withTransaction {status->
				try {
					RoleGroupRole.create(master,rola,true)
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
		RoleGroup master = RoleGroup.get(params._masterId)
		if (!master) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"roleGroup.label"),
					params.id
				])]
			return
		}
		def inAtt = params
		Role rola = Role.get(inAtt.id)
		if (!rola) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"role.label"),
					params.id
				])]
			return
		}
		if(RoleGroupRole.exists(master.id,rola.id) ){
			RoleGroupRole.withTransaction {status->
				try {
					RoleGroupRole.remove(master,rola,true)
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
		RoleGroup instance = RoleGroup.newInstance(params)
		//		instance.id = Long.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}
		RoleGroup.withTransaction {status->
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
		RoleGroup instance = RoleGroup.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[
					message(code:"roleGroup.label"),
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

		RoleGroup.withTransaction {status->
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
		RoleGroup instance = RoleGroup.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[
					message(code:"roleGroup.label"),
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


		RoleGroup.withTransaction {status->
			try {
				RoleGroupRole.removeAll(instance,true)
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
