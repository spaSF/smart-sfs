package com.sfs.smartsfs.app

import grails.converters.JSON
import grails.util.Holders
import groovy.json.JsonSlurper

import com.isomorphic.util.DefaultValidators.contains
import com.sfs.smartsfs.isc.SmartFile

class SmartNavigatorController {

	def configHolderService
	def responseSCService

	def index() {
		render view:"/smartindex"
	}
	def home(){
		render view:"/home"
	}

	def error(){
		render view:"/smarterror"
	}

	def upload(){
		println params //file pride pod parametrom upload (UploadItem na formulari)
		//handle uploaded file
		def uploadedFile = request.getFile('upload')
		if(!uploadedFile.empty){
			println "Class: ${uploadedFile.class}"
			println "Name: ${uploadedFile.name}"
			println "OriginalFileName: ${uploadedFile.originalFilename}"
			println "Size: ${uploadedFile.size}"
			println "ContentType: ${uploadedFile.contentType}"
		}
		def webRootDir = servletContext.getRealPath("/")
		def userDir = new File(webRootDir, "/upload")
		userDir.mkdirs() //zrob adresar
		File localFile=new File( userDir, uploadedFile.originalFilename) //zrob prazdny file
		uploadedFile.transferTo( localFile) //svac do lokalneho file
		//download
		render(file:localFile,fileName:uploadedFile.originalFilename,contentType :uploadedFile.contentType)

	}

	def downloadLog(){
		try{
			log.debug params["logDate"]
			def path=configHolderService.getValueForKey("smartsfs.log.path")?:"tmp/logs"
			def pattern
			try {
				// napr.: dd
				pattern = configHolderService.getValueForKey("smartsfs.log.pattern")?:"yyyy-MM-dd"
			} catch (Exception e) {
				pattern = "yyyy-MM-dd"
			}
			pattern = pattern?pattern:"yyyy-MM-dd"
			// napr.: logfile.srvHome - to co je v configu
			if (path.indexOf("logfile.srvHome") > -1) {
				path = configHolderService.getValueForKey(path) + "/logs"?:"tmp/logs"
				//path = Eval.me("path = ${grailsApplication.config.logfile.srvHome}/logs").toString()
			}
			def logName=configHolderService.getValueForKey("smartsfs.log.fileName")?:"app.log"
			if(params.logDate){
				Date logDate = params.date("logDate",,"yyyy-MM-dd")
				logName="${logName}."+logDate.format(pattern)
			}
			
			def fullpath=path+"/"+logName
			log.debug 'Log Path = ' + fullpath
			SmartFile logFile=new SmartFile(filename:logName,fullpath:fullpath,contentType:"text/plain",storeLocal:true)
			render(file:logFile.getFile(),fileName:logFile.filename,contentType :logFile.contentType)
		} catch (Exception exception) {
			render view:"/smarterror",model: [exception: exception.toString().doRadecku()]
		}
	}

	/**
	 * export json data to file
	 * @param dataSource = z ktoreho DS
	 * @param Boolean exportSelected = exportovat oznacene riadky
	 * @param [] selectedIds = id oznacenych riadkov
	 * @param criteria = Smartclient Advanced Criteria
	 * @return json file
	 */
	def exportJSON(){
		try{
			String dsName = params.dataSource
			Class clazz = grailsApplication.domainClasses.find { it.clazz.simpleName == dsName }.clazz
			if(clazz){
				String fileName = (grailsApplication.metadata['app.name']?:"smartsfs")+"-${dsName}.json"
				Boolean exportSelected=Boolean.valueOf(params.exportSelected)
				def ids=responseSCService.getAsList(params.selectedIds.split(","))
				def data = responseSCService.gridResponse(clazz,params)["data"]
				def webTmpDir = servletContext.getRealPath("/tmp")

				File tmpexport = new File(webTmpDir,'tmpfile.txt')

				tmpexport.withWriter{  BufferedWriter writer ->
					data.each {msg->
						//bud je exportuj vsetko alebo identita objektu je v zozname identit oznacenych v gride
						if(!exportSelected || ids.contains(msg.ident().toString())){
							def js = msg as JSON
							writer.writeLine js.toString()
						}
					}
				}

				render(file:tmpexport,fileName:fileName,contentType :"text/plain")
			}else{
				render view:"/smarterror",model: [exception: "Not a Domain Class ${dsName}"]
			}

		}catch(Exception exception){
			render view:"/smarterror",model: [exception: exception.toString().doRadecku()]
		}
	}
	/**
	 * import JSON data from file to DB
	 * @param dataSource = do ktoreho DS
	 * @param merge = typ vlozenia = MERGE(update or insert)/INSERT(insert neexistujucich)
	 * @return
	 */
	def importJSON(){
		log.debug params

		try{
			def all = 0
			def done = 0
			def err = 0
			def inAtt= responseSCService.parseAsJson(params._dataUpload)
			def merge = inAtt["merge"]
			String dsName = inAtt.dataSource
			Class clazz = grailsApplication.domainClasses.find { it.clazz.simpleName == dsName }.clazz
			if(clazz){
				def uploadedFile = request.getFile('uploadFile')
				if(!uploadedFile.empty){
					println "Class: ${uploadedFile.class}"
					println "Name: ${uploadedFile.name}"
					println "OriginalFileName: ${uploadedFile.originalFilename}"
					println "Size: ${uploadedFile.size}"
					println "ContentType: ${uploadedFile.contentType}"
					def webRootDir = servletContext.getRealPath("/")
					def userDir = new File(webRootDir, "/tmp")
					userDir.mkdirs() //zrob adresar ak neni
					File localFile=new File( userDir, uploadedFile.originalFilename) //zrob prazdny file
					uploadedFile.transferTo( localFile) //svac do lokalneho file
					def slurper = new JsonSlurper()

					def data = localFile.readLines()

					clazz.withTransaction {status->
						try {
							data.each {dsLine->
								def dsAtt=slurper.parseText(dsLine)
								all++
								def instance = clazz.lock(dsAtt.id)
								if(!instance){
									instance = clazz.newInstance(dsAtt)
								}else if(merge=="MERGE"){
									instance.properties = dsAtt
									log.debug "instance ID[${instance.id}] changed: ${instance.getDirtyPropertyNames()}"

								}else instance=null

								if(instance){
									instance.validate()

									if (instance.hasErrors()) {
										err++
										def errm = responseSCService.handleValidationErrors(instance.errors)
										status.setRollbackOnly()
										render view:"/smarterror",model: [exception: "Line[${all}] ${errm.toString()}"]
										return
									}
									done++
									instance.save(flush:true)
								}
							}
						} catch (Exception e) {
							render view:"/smarterror",model: [exception: e.toString().doRadecku()]
							status.setRollbackOnly()
							return
						}
					}

				}
				if(err==0)
					render "{response:{status:0,data:{all:${all},done:${done}}}}"
			}else
				render view:"/smarterror",model: [exception: "Not a Domain Class ${dsName}"]
		}catch(Exception exception){
			render view:"/smarterror",model: [exception: exception.toString().doRadecku()]
		}
	}


}
