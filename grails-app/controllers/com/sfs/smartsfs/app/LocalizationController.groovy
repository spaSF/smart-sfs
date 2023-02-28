package com.sfs.smartsfs.app

import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

import org.hibernate.SessionFactory
import org.springframework.context.i18n.LocaleContextHolder as LCH

import com.sfs.smartsfs.sec.LocaleLang


@Transactional(readOnly = true)
class LocalizationController {
	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def responseSCService
	def springSecurityService
	def grailsApplication
	SessionFactory sessionFactory

	def index() {
		respond response:responseSCService.gridResponse(Localization.class,params)
	}

//	def revisions(){
//		def data=Localization.findAllRevisionsById(Long.valueOf(1))
//		AuditReader reader  = AuditReaderFactory.get(sessionFactory.currentSession)
//		def data2=reader.createQuery().forRevisionsOfEntity(Localization.class, false, true).resultList
//		respond response:[status:0,data:data,startRow:0,endRow:100,totalRows:100]
//	}
	
	@Transactional
	def save() {
		Localization instance = Localization.newInstance(params)
		//		instance.id = Long.valueOf(params.id) //id nesetne!
		instance.validate()
		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		try {
			instance.save flush:true
			//copy localization for other languages
			LocaleLang.findAll {id != instance.locale}.each {lang->
				Localization klon = new Localization(instance.properties)
				klon.id=null
				klon.locale=lang.id
				klon.save flush:true
			}
			Localization.resetThis(instance.code)
		} catch (Exception e) {
			respond response:[status:-1,data:e.message]
			return
		}

		respond response:[status:0,data:instance]
	}

	@Transactional
	def update() {
		Localization instance = Localization.lock(params.id)
		if (!instance) {
			respond response:[status:-1,data:message(code:"default.not.found.message",args:[message(code:"localization.label"), params.id])]
			return
		}

		def inAtt = params
		if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
			//zmenilo sa!
			respond response:[status:-4,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
			return
		}
		inAtt.remove("dateCreated")
		inAtt.remove("lastUpdated")
		def oldCode = instance.code
		instance.properties = inAtt
		instance.validate()

		if (instance.hasErrors()) {
			respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
			return
		}

		try {
			instance.save flush:true
			Localization.resetThis(oldCode)
			if (instance.code != oldCode) Localization.resetThis(instance.code)
		} catch (Exception e) {
			respond response:[status:-1,data:e.message]
			return
		}

		respond response:[status:0,data:instance]
	}

	@Transactional
	def delete() {
		Localization instance = Localization.lock(params.id)
		if (!instance) {
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[message(code:"localization.label"), params.id])]
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
			Localization.resetThis(instance.code)
		} catch (Exception e) {
			respond response:[status:-1,data:e.message]
			return
		}
		respond response:[status:0,data:instance]
	}


	/**
	 * nacitaj lokalizacne texty z DB podla params.locale
	 * @author mkr
	 * @return SC response - data=mapa lokalizacnych textov
	 */
	@Transactional
	def loadLocale(){
		def lang = params.locale
		def country = params.country
		def auth =  springSecurityService.principal

		if(lang=="*") {
			lang=LCH.getLocale().getLanguage()
			country=LCH.getLocale().getCountry()
			if(auth&&auth.hasProperty("lang")&&auth?.lang?:lang!=lang){
				lang=auth.lang
				country = auth.country
			}
		}
		log.debug "aktualny locale: ${lang}"
		def localizations = Localization.createCriteria().list {
			or {
				eq "locale", "*"
				eq "locale", lang
				eq "locale", lang+country?.toUpperCase()
			}
			order("locale")
		}
		def localizationsMap = [:]
		localizations.each {
			// if there are duplicate codes found, as the results are ordered by locale, the more specific should overwrite the less specific
			localizationsMap[it.code.replace('smartsfs.sc.','')]=it.text
		}
		def config = ConfigProperty.list()
      ConfigObject appConfig = grailsApplication.getConfig()
      ConfigObject smartsfs = appConfig.getProperty("smartsfs")
       
		def configMap = smartsfs.toProperties("smartsfs")
		config.each {
			configMap[it.key]=it.value
		}
		respond response:[status:0,data:localizationsMap,locale:lang,auth:auth,config:configMap]
	}


	@Transactional
	def propagate(){
		if(params.id){
			Localization instance = Localization.lock(params.id)
			if (!instance) {
				respond response:[status:-4,data:message(code:"default.not.found.message",args:[message(code:"localization.label"), params.id])]
				return
			}

			def data=Localization.findAll {
				id!=Long.valueOf(params.id) && code==instance.code
			}.each {lc->
				lc.text=instance.text
				lc.save flush:true

			}
			respond response:[status:0,data:data]
		}else{
			respond response:[status:-4,data:message(code:"default.not.found.message",args:[message(code:"localization.label"), null])]
		}
	}

	def exportMessages(){
		log.debug params
		
		try{
			if(params.locale){
				String lang = params.locale
				String fileName = (grailsApplication.metadata['app.name']?:"smartsfs")+(lang=="*"?"":"_${lang}")+".properties"
				def webTmpDir = servletContext.getRealPath("/tmp")

				File tmpexport = new File(webTmpDir,'tmpfile.txt')

				def data = Localization.createCriteria().list {
					eq "locale", lang
					order("code")
				}
				tmpexport.withWriter{  BufferedWriter writer ->
					data.each {msg->
						writer.writeLine "${msg.code}=${msg.text?:''}"
					}
				}

				render(file:tmpexport,fileName:fileName,contentType :"text/plain")
			}
		}catch(Exception exception){
			render view:"/smarterror",model: [exception: exception.toString().doRadecku()]
		}
	}

	@Transactional
	def upload(){
		println params //file pride pod parametrom upload (UploadItem na formulari)
		//handle uploaded file
		try {
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
				
				def locale = Localization.getLocaleForFileName(uploadedFile.originalFilename)
				Localization.loadPropertyFile(localFile,locale)
				Localization.withSession { it.flush() }
				//delete temp file
				localFile.delete()
				
				render "{response:{status:0,data:''}}"
			}else{
				render "{response:{status:-4,data:${message(code:'localization.imports.missing')} }}"
			}

		} catch (Exception exception) {
			render view:"/smarterror",model: [exception: exception.toString().doRadecku()]
		}

	}
}
