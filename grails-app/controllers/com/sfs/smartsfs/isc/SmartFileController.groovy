package com.sfs.smartsfs.isc

import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SmartFileController {

	def downloadFile() {
		log.debug(params)
		try {
			if(params.id){
				def fileId = Long.valueOf(params.id)
				SmartFile instance= SmartFile.get(fileId)
				if (!instance) {
					render view:"/smarterror",model: [exception: message(code:"default.not.found.message",args:[message(code:"smartFile.label"), params.id])]
					return
				}
				render(file:instance.getFile(),fileName:instance.filename,contentType :instance.contentType)
			}
		} catch (Exception exception) {
			exception.printStackTrace()
			render view:"/smarterror",model: [exception: exception.toString().doRadecku()]
		}
	}
}
