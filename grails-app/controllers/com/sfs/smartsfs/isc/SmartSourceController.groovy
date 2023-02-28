package com.sfs.smartsfs.isc

import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityUtils
import grails.transaction.Transactional

import java.nio.charset.Charset
import java.nio.file.Files
import java.nio.file.Paths

import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.apache.commons.csv.CSVRecord
import org.apache.commons.csv.QuoteMode


@Transactional(readOnly = true)
class SmartSourceController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]
	def responseSCService
	def excelExportHelperService
	def configHolderService

	def loadDS(){
		log.debug "loadDS - params:${params}"
		if(params.ID){
			def IDs = params.list('ID')
			def ds = SmartSource.createCriteria().list {
				or {
					IDs.each { eq "ID",it }
				}
			}
			def status = ds?0:-1
			//skontroluj URL ci je kompletna
			def rootUri=g.createLink(uri:"")
			ds.each {d->
				//nacitaj iba na ktore ma prava
				if(d.requiresRole&&!SpringSecurityUtils.ifAnyGranted(d.requiresRole)){
					ds = ds - d
				}else{
					if(d.dataURL&&!d.dataURL?.startsWith(rootUri)){
						if(!d.contextRoot?.trim()){
							d.dataURL=rootUri.concat(d.dataURL)
						}else{
							d.dataURL=d.contextRoot.concat(d.dataURL)
						}
					}
					if(d.fetchDataURL&&!d.fetchDataURL?.startsWith(rootUri)){
						if(!d.contextRoot?.trim()){
							d.fetchDataURL=rootUri.concat(d.fetchDataURL)
						}else{
							d.fetchDataURL=d.contextRoot.concat(d.fetchDataURL)
						}
					}
					if(d.removeDataURL&&!d.removeDataURL?.startsWith(rootUri)){
						if(!d.contextRoot?.trim()){
							d.removeDataURL=rootUri.concat(d.removeDataURL)
						}else{
							d.removeDataURL=d.contextRoot.concat(d.removeDataURL)
						}
					}
					if(d.updateDataURL&&!d.updateDataURL?.startsWith(rootUri)){
						if(!d.contextRoot?.trim()){
							d.updateDataURL=rootUri.concat(d.updateDataURL)
						}else{
							d.updateDataURL=d.contextRoot.concat(d.updateDataURL)
						}
					}
					if(d.addDataURL&&!d.addDataURL?.startsWith(rootUri)){
						if(!d.contextRoot?.trim()){
							d.addDataURL=rootUri.concat(d.addDataURL)
						}else{
							d.addDataURL=d.contextRoot.concat(d.addDataURL)
						}
					}
				}
			}
			log.debug "pristupne DS:${ds}"
			JSON.use("deep") {respond response:[status:status,data:ds,startRow:0,endRow:ds.size(),totalRows:ds.size()]}
		}
	}



	def index(){
		if(params.id){
			respond response:[status:0,data:SmartSource.get(params.id as Long),startRow:1,endRow:1,totalRows:1]
		}else {
			respond response:responseSCService.gridResponse(SmartSource.class,params)
		}
	}

	/**
	 * nastav contextRoot na DS podla povodneho ctx
	 * ak povodne ctx je null urob podmienku na null!
	 * @return
	 */
	@Transactional
	def setContextRoot(){
		log.debug params

		def inAtt = params
		if(inAtt.toCtx||inAtt.fromCtx){
			SmartSource.findAllWhere(contextRoot:inAtt.fromCtx)?.each{SmartSource ds->
				ds.setContextRoot(inAtt.toCtx)
				ds.save()
			}
			respond response:[status:0,data:message(code:"smartsfs.operation.success.default.message",args:[message(code:"smartSource.setContextRoot")])]
		}else{
			respond response:[status:-1,data:message(code:"smartOperation.call.paramserror.message",args:[message(code:"smartSource.setContextRoot")])]
		}
	}

	/**
	 * vyrob klon smart source
	 * @author mkr
	 * @param id source original
	 * @param smartID pod akym ID ulozit novy source
	 */
	@Transactional
	def cloneSource() {
		log.debug params
		if(params.id&&params.smartID){
			SmartSource orig = SmartSource.lock(params.id)
			if (!orig) {
				respond response:[status:-4,data:orig,message:message(code:"default.not.found.message",args:[message(code:"SmartSource.label"), params.id])]
				return
			}

			SmartSource klon = orig.clone()
			klon.ID=params.smartID

			klon.getFields()*.validate()
			if(klon.getOperations()) klon.getOperations().each {op->
				if(op.getOperationParams()) op.getOperationParams()*.validate()
				op.validate()
			}
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
			respond response:[status:-1,data:message(code:"smartOperation.call.paramserror.message",args:[message(code:"smartSource.cloneSource")])]
		}
	}

	def xlsExport(){
		log.debug params
		try{
			render(file:excelExportHelperService.defaultReport(params)?.toByteArray(),fileName:"${params.datasource}_${(new Date()).format('yyyy-MM-dd_HH_mm_ss')}.xlsx",contentType :"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		} catch (Exception exception) {
			render view:"/smarterror",model: [exception: exception.toString().doRadecku()]
		}
		System.gc()
	}
	def csvExport(){
		log.debug params
		try{
			render(file:excelExportHelperService.defaultCSV(params),fileName:"${params.datasource}_${(new Date()).format('yyyy-MM-dd_HH_mm_ss')}.csv",contentType :"text/csv")
		} catch (Exception exception) {
			render view:"/smarterror",model: [exception: exception.toString().doRadecku()]
		}
		System.gc()
	}


	/**
	 * import CSV data from file to DB
	 * @param dataSource = do ktoreho DS
	 * @param merge = typ vlozenia = MERGE(update or insert)/INSERT(insert neexistujucich)
	 * @return
	 */
	def importCSV(){
		log.debug params

		try{
			def all = 0
			def done = 0
			def err = 0
			def inAtt= responseSCService.parseAsJson(params._dataUpload)
			def merge = inAtt["merge"]
			String fileCharset = inAtt["charset"]
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
					String tmpFileName = "tmpCsvImp"+Long.toString(new Date().toTimestamp().getTime())+".csv"
					Files.deleteIfExists(Paths.get(webRootDir, "/tmp", tmpFileName)); 
					File localFile=new File( userDir, tmpFileName) //zrob prazdny file
					uploadedFile.transferTo( localFile) //svac do lokalneho file
					Reader reader = localFile.newReader()
					CSVParser parser = CSVParser.parse(localFile, Charset.forName(fileCharset?:(configHolderService.getValueForKey("smartsfs.csvexport.charset")?:"windows-1250")), CSVFormat.EXCEL.withDelimiter(';' as char).withQuoteMode(QuoteMode.NON_NUMERIC).withHeader())

					clazz.withTransaction {status->
						try {
							for (CSVRecord record : parser) {
								def dsAtt=record.toMap()
								log.debug dsAtt
								all++
								def instance = dsAtt.id?clazz.lock(Long.valueOf(dsAtt.id)):null
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
										return true
									}
									done++
									instance.save(flush:true)
								}
							}
						} catch (Exception e) {
							render view:"/smarterror",model: [exception: e.toString().doRadecku()]
							status.setRollbackOnly()
							err = 100
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

	def edit(){
		log.debug params
		render (view:"edit",model:[instanceId:params.id])
	}
	@Transactional
	def save() {
		log.debug "SAVE params:"+params
		def inAtt = params
		inAtt.remove("fields")
		SmartSource instance = SmartSource.newInstance(inAtt)
		//		instance.id = Long.valueOf(params.id) //id nesetne!
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		try {
			instance.save flush:true
		} catch (Exception e) {
			respond response:[status:-1,data:instance,errors:["":e.message]]
			return
		}

		respond response:[status:0,data:instance]
	}

	@Transactional
	def update() {
		SmartSource instance = SmartSource.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:instance,message:message(code:"default.not.found.message",args:[message(code:"SmartSource.label"), params.id])]
			return
		}
		log.debug params
		def inAtt = params
		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			respond response:[status:-1,data:instance,message:message(code:"default.optimistic.locking.failure",args:[instance.id])]
			return
		}
		inAtt.remove("dateCreated")
		inAtt.remove("lastUpdated")
		inAtt.remove("fields")
		instance.properties = inAtt
		instance.validate()

		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		SmartSource.withTransaction {status->
			try {
				instance.save flush:true
			} catch (Exception e) {
				respond response:[status:-1,data:instance,message:e.message]
				status.setRollbackOnly()
				return
			}
		}

		respond response:[status:0,data:instance]
	}

	@Transactional
	def delete() {
		SmartSource instance = SmartSource.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[message(code:"SmartSource.label"), params.id])]
			return
		}

		def inAtt = params
		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			respond response:[status:-4,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
			return
		}


		SmartSource.withTransaction {status->
			try {
				SmartSourceField.findAllByDSource(instance).each {  instance.removeFromFields(it)  }
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
