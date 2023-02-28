package com.sfs.smartsfs.test



import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

import com.sfs.smartsfs.isc.SmartFile

@Transactional(readOnly = true)
class FileTestController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService

	def index() {
		def rs = responseSCService.gridResponse(FileTest.class,params)
		log.debug (rs as JSON)
		
		respond response:responseSCService.gridResponse(FileTest.class,params)
	}

	@Transactional
	def save() {

		log.debug params
		FileTest instance = FileTest.newInstance()
		def isUpload = params._dataUpload?true:false
		def inAtt
		if(isUpload){
			inAtt= responseSCService.parseAsJson(params._dataUpload)
			def uploadedFile = request.getFile('fileStore')
			if(uploadedFile&&!uploadedFile.empty){
				println "Class: ${uploadedFile.class}"
				println "Name: ${uploadedFile.name}"
				println "OriginalFileName: ${uploadedFile.originalFilename}"
				println "Size: ${uploadedFile.size}"
				println "ContentType: ${uploadedFile.contentType}"
//				instance.fileStore = new SmartFile(uploadedFile,inAtt.storeLocaly?:false) //store local
				instance.fileStore = new SmartFile(uploadedFile.getBytes(),uploadedFile.originalFilename,uploadedFile.contentType,"/tmp",inAtt.storeLocaly?:false) //store local
				instance.fileStore.save()
			}
		}else{
			inAtt=params
		}
		inAtt.remove("fileStore")
		instance.properties = inAtt
		//		instance.id = Long.valueOf(params.id) //ak je id assigned
		instance.validate()
		if (instance.hasErrors()) {
			if(isUpload){
				render responseSCService.uploadResponse(-4,instance,responseSCService.handleValidationErrors(instance.errors))
			}else{
				respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			}
			return
		}
		FileTest.withTransaction {status->
			try {
				instance.save flush:true
			} catch (Exception e) {
				status.setRollbackOnly()
				if(isUpload){
					render responseSCService.uploadResponse(-1,e.message)
				}else{
					respond response:[status:-1,data:e.message]
				}
				return
			}
		}
		if(isUpload){
			render responseSCService.uploadResponse(0,instance)
		}else{
			respond {response:[status:0,data:instance]}
		}

	}

	@Transactional
	def update() {
		log.debug params
		
		def isUpload = params._dataUpload?true:false
		def inAtt
		def uploadedFile
		if(isUpload) {
			inAtt= responseSCService.parseAsJson(params._dataUpload)
			uploadedFile = request.getFile('fileStore')
			if(uploadedFile&&!uploadedFile.empty){
				println "Class: ${uploadedFile.class}"
				println "Name: ${uploadedFile.name}"
				println "OriginalFileName: ${uploadedFile.originalFilename}"
				println "Size: ${uploadedFile.size}"
				println "ContentType: ${uploadedFile.contentType}"
			}
		}else{
			inAtt = params
		}
		FileTest instance = FileTest.lock(inAtt.id)
		if (!instance) {
			if(isUpload)render responseSCService.uploadResponse(-1,message(code:"default.not.found.message",args:[
					message(code:"fileTest.label"),
					params.id
				]))
			else respond response:[status:-1,data:message(code:"default.not.found.message",args:[
						message(code:"fileTest.label"),
						params.id
					])]
			return
		}

		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			if(isUpload)render responseSCService.uploadResponse(-1,message(code:"default.optimistic.locking.failure",args:[instance.id]))
			else respond response:[status:-1,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
			return
		}
		if(isUpload&&uploadedFile){
			instance.fileStore = new SmartFile(uploadedFile,inAtt.storeLocaly?:false)
			instance.fileStore.save()
		}
		inAtt.remove("dateCreated")
		inAtt.remove("lastUpdated")
		inAtt.remove("fileStore")

		instance.properties = inAtt
		instance.validate()
		if (instance.hasErrors()) {
			if(isUpload)render responseSCService.uploadResponse(-4,instance,responseSCService.handleValidationErrors(instance.errors))
			else respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		FileTest.withTransaction {status->
			try {
				instance.save flush:true
			} catch (Exception e) {
				status.setRollbackOnly()
				if(isUpload) render responseSCService.uploadResponse(-1,e.message)
				else respond response:[status:-1,data:e.message]
				return
			}
		}
		if(isUpload)render responseSCService.uploadResponse(0,instance)
		else respond response:[status:0,data:instance]
	}

	@Transactional
	def delete() {
		FileTest instance = FileTest.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[
					message(code:"fileTest.label"),
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


		FileTest.withTransaction {status->
			try {
				instance.getFileStore()?.delete()
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
