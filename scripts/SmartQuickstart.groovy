includeTargets << grailsScript("_GrailsInit")
includeTargets << grailsScript('_GrailsBootstrap')


appDir = "$basedir/grails-app"


target(smartQuickstart: "Upravi sa config.groovy") {
	updateConfig()

	updateUrlMap()

	println '''
*******************************************************
* grails-app/conf/Config.groovy a UrlMapping          *
* bol zmodifikovany nastaveniami smart-sfs,           *
* pre istotu kukni ci je secko v cajku......          *
*******************************************************
'''
}

private void updateUrlMap(){
	def configFile = new File(appDir, 'conf/UrlMappings.groovy')
	if (!configFile.exists()) {
		return
	}

	configFile.withWriter { BufferedWriter writer ->
		writer.writeLine '// Created by the Smart SFS plugin>>>>>'
		writer.writeLine 'class UrlMappings {'
		writer.newLine()
		writer.writeLine '		static mappings = {'
		writer.writeLine '			"/$controller/$action?/$id?(.$format)?"{'
		writer.writeLine '				constraints {'
		writer.writeLine '					// apply constraints here'
		writer.writeLine '				}'
		writer.writeLine '			}'
		writer.newLine()
		writer.writeLine '			"500"(view:"/error")'
		writer.writeLine '			"/"(view:"/index")'
		writer.writeLine '			"/home"(controller:"SmartNavigator",action:"home")'
		writer.writeLine '			"/error"(controller:"SmartNavigator",action:"error")'
		writer.writeLine '		}'
		writer.writeLine '	}'
	}
}

private void updateConfig() {

	def configFile = new File(appDir, 'conf/Config.groovy')
	if (!configFile.exists()) {
		return
	}

	configFile.withWriterAppend {
		BufferedWriter writer ->
		writer.newLine()
		writer.newLine()
		writer.writeLine '// Added by the Smart SFS plugin>>>>>'
		writer.newLine()
		writer.writeLine "grails.gorm.default.constraints = {'*'(nullable: true)}"
      writer.writeLine "grails.gorm.failOnError = true"
		writer.writeLine "smartsfs.supportedLocales = [new Locale('sk'),Locale.ENGLISH]"
		writer.writeLine "smartsfs.defaultLocale = new Locale('sk');"
		writer.newLine()
		writer.newLine()
		writer.writeLine "grails.databinding.dateFormats = ["
		writer.writeLine "	\"yyyy-MM-dd'T'hh:mm:ss.S\", "
		writer.writeLine "	\"yyyy-MM-dd'T'hh:mm:ss'Z'\", "
		writer.writeLine "	'yyyy-MM-dd HH:mm:ss',"
		writer.writeLine "	'dd.MM.yyyy HH:mm:ss',"
		writer.writeLine "	'yyyy-MM-dd HH:mm:ss.S',"
		writer.writeLine "	'yyyy-MM-dd',"
		writer.writeLine "	'dd.MM.yyyy'"
		writer.writeLine "]"
		writer.newLine()
		writer.writeLine "//aby netrimoval"
		writer.writeLine "grails.databinding.convertEmptyStringsToNull=true"
		writer.writeLine "grails.databinding.trimStrings=false"
		writer.newLine()
		writer.newLine()
		writer.writeLine "// 		//logging config - pridat do kazdeho environment, appenders ak chces log file"
		writer.writeLine "// 		//cestu tmp/log (alebo inu) nastav do config prop smartsfs.log.path"
		writer.writeLine "// 		//nazov log suboru app.log(alebo inak) nastav do config prop smartsfs.log.fileName"
		writer.newLine()
		writer.writeLine "//		log4j = {				"
		writer.writeLine "//			appenders {"
		writer.writeLine "//				appender new DailyRollingFileAppender("
		writer.writeLine "//						name: 'dailyAppender',"
		writer.writeLine "//						datePattern: \"'.'yyyy-MM-dd\",  // See the API for all patterns."
		writer.writeLine "//						fileName: \"tmp/logs/app.log\","
		writer.writeLine "//						layout: pattern(conversionPattern:'%d [%t] %-5p %c{2} %x - %m%n')"
		writer.writeLine "//						)"
		writer.writeLine "//				layout: new PatternLayout(\"[%p] [%c{3}] %m%n\")"
		writer.writeLine "//			}"
		writer.writeLine "//			error  dailyAppender:["
		writer.writeLine "//				'org.codehaus.groovy.grails.web.servlet',"
		writer.writeLine "//				// controllers"
		writer.writeLine "//				'org.codehaus.groovy.grails.web.pages',"
		writer.writeLine "//				// GSP"
		writer.writeLine "//				'org.codehaus.groovy.grails.web.sitemesh',"
		writer.writeLine "//				// layouts"
		writer.writeLine "//				'org.codehaus.groovy.grails.web.mapping.filter',"
		writer.writeLine "//				// URL mapping"
		writer.writeLine "//				'org.codehaus.groovy.grails.web.mapping',"
		writer.writeLine "//				// URL mapping"
		writer.writeLine "//				'org.codehaus.groovy.grails.commons',"
		writer.writeLine "//				// core / classloading"
		writer.writeLine "//				'org.codehaus.groovy.grails.plugins',"
		writer.writeLine "//				// plugins"
		writer.writeLine "//				'org.codehaus.groovy.grails.orm.hibernate',"
		writer.writeLine "//				// hibernate integration"
		writer.writeLine "//				'org.springframework',"
		writer.writeLine "//				'org.hibernate',"
		writer.writeLine "//				'net.sf.ehcache.hibernate'"
		writer.writeLine "//			]"
		writer.writeLine "//			debug   dailyAppender:["
		writer.writeLine "//				'grails.app',"
		writer.writeLine "//				'org.hibernate.SQL',"
		writer.writeLine "//				'org.springframework.security'"
		writer.writeLine "//			]"
		writer.writeLine "//		}"
		writer.newLine()
		writer.newLine()
		writer.writeLine "grails.resources.adhoc.patterns = ["
		writer.writeLine "	'/images/*',"
		writer.writeLine "	'/css/*',"
		writer.writeLine "	'/js/*',"
		writer.writeLine "	// '/isomorphic/*',//neda sa tlacit cez print preview,"
		writer.writeLine "	'/plugins/*'"
		writer.writeLine "]"
		writer.writeLine "grails.resources.adhoc.includes = ["
		writer.writeLine "	'/images/**',"
		writer.writeLine "	'/css/**',"
		writer.writeLine "	'/js/**',"
		writer.writeLine "	'/isomorphic/**',"
		writer.writeLine "	'/plugins/**'"
		writer.writeLine "]"
		writer.writeLine "grails.resources.adhoc.excludes = ['/isomorphic/IDACall**','/isomorphic/HttpProxy**']"
		writer.writeLine "//To enable using the grailsResourceLocator bean, you must set this setting in Config.groovy"
		writer.writeLine "//DOLEZITE, inak mimo DEV env nenajde resources"
		writer.writeLine "grails.resources.resourceLocatorEnabled = true"
		writer.newLine()
		writer.newLine()
		writer.writeLine "environments {"
		writer.writeLine "	development {"
		writer.writeLine "		log4j = {				"
		writer.writeLine "			error  'org.codehaus.groovy.grails.web.servlet',"
		writer.writeLine "				 //controllers"
		writer.writeLine "				'org.codehaus.groovy.grails.web.pages',"
		writer.writeLine "				 //GSP"
		writer.writeLine "				'org.codehaus.groovy.grails.web.sitemesh',"
		writer.writeLine "				// layouts"
		writer.writeLine "				'org.codehaus.groovy.grails.web.mapping.filter',"
		writer.writeLine "				// URL mapping"
		writer.writeLine "				'org.codehaus.groovy.grails.web.mapping',"
		writer.writeLine "				// URL mapping"
		writer.writeLine "				'org.codehaus.groovy.grails.commons',"
		writer.writeLine "				// core / classloading"
		writer.writeLine "				'org.codehaus.groovy.grails.plugins',"
		writer.writeLine "				// plugins"
		writer.writeLine "				'org.codehaus.groovy.grails.orm.hibernate',"
		writer.writeLine "				// hibernate integration"
		writer.writeLine "				'org.springframework',"
		writer.writeLine "				'org.hibernate',"
		writer.writeLine "				'net.sf.ehcache.hibernate'"
		writer.writeLine "			debug   'grails.app',"
		writer.writeLine "				'org.hibernate.SQL',"
		writer.writeLine "				'org.springframework.transaction',"
		writer.writeLine "				'org.springframework.security'"
		writer.writeLine "		}"
//		writer.writeLine "	   grails.resources.modules = {"
//		writer.writeLine "		  smartsfs{"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_Core.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_Foundation.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_Containers.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_Grids.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_Forms.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_DataBinding.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_Calendar.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_History.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules-debug/ISC_RichTextEditor.js', disposition: 'head'"
//		writer.writeLine "		  }"
//		writer.writeLine "		  scapplication {"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scGlobal.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scRestDataSource.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scLogin.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scFormItems.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scTabset.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scUser.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scApplication.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scLocale.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scGrid.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scDetail.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/scButtons.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'/js/smart-sfs.js'"
//		writer.writeLine "		  }"
//		writer.writeLine "	   }"
		writer.writeLine "	}"
		writer.writeLine "	production {"
		writer.writeLine "		log4j = {				"
		writer.writeLine "			appenders {"
		writer.writeLine "				appender new DailyRollingFileAppender("
		writer.writeLine "						name: 'dailyAppender',"
		writer.writeLine "						datePattern: \"'.'yyyy-MM-dd\",  // See the API for all patterns."
		writer.writeLine "						fileName: \"tmp/logs/app.log\","
		writer.writeLine "						layout: pattern(conversionPattern:'%d [%t] %-5p %c{2} %x - %m%n')"
		writer.writeLine "						)"
		writer.writeLine "				layout: new PatternLayout(\"[%p] [%c{3}] %m%n\")"
		writer.writeLine "			}"
		writer.writeLine "			error dailyAppender:"
		writer.writeLine "				'org.codehaus.groovy.grails.web.servlet',"
		writer.writeLine "				 //controllers"
		writer.writeLine "				'org.codehaus.groovy.grails.web.pages',"
		writer.writeLine "				 //GSP"
		writer.writeLine "				'org.codehaus.groovy.grails.web.sitemesh',"
		writer.writeLine "				// layouts"
		writer.writeLine "				'org.codehaus.groovy.grails.web.mapping.filter',"
		writer.writeLine "				// URL mapping"
		writer.writeLine "				'org.codehaus.groovy.grails.web.mapping',"
		writer.writeLine "				// URL mapping"
		writer.writeLine "				'org.codehaus.groovy.grails.commons',"
		writer.writeLine "				// core / classloading"
		writer.writeLine "				'org.codehaus.groovy.grails.plugins',"
		writer.writeLine "				// plugins"
		writer.writeLine "				'org.codehaus.groovy.grails.orm.hibernate',"
		writer.writeLine "				// hibernate integration"
		writer.writeLine "				'org.springframework',"
		writer.writeLine "				'org.hibernate',"
		writer.writeLine "				'net.sf.ehcache.hibernate'"
		writer.writeLine "			debug   dailyAppender:"
		writer.writeLine "				'grails.app',"
		writer.writeLine "				'org.hibernate.SQL',"
		writer.writeLine "				'org.springframework.transaction',"
		writer.writeLine "				'org.springframework.security'"
		writer.writeLine "		}"
//		writer.writeLine "	   grails.resources.modules = {"
//		writer.writeLine "		  smartsfs{"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_Core.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_Foundation.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_Containers.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_Grids.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_Forms.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_DataBinding.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_Calendar.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_History.js', disposition: 'head'"
//		writer.writeLine "			 resource url: '/isomorphic/system/modules/ISC_RichTextEditor.js', disposition: 'head'"
//		writer.writeLine "		  }"
//		writer.writeLine "		  scapplication {"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scGlobal.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scRestDataSource.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scLogin.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scFormItems.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scTabset.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scUser.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scApplication.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scLocale.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scGrid.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scDetail.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'js/min/scButtons.js'"
//		writer.writeLine "			 resource plugin:'smart-sfs',url:'/js/smart-sfs.js'"
//		writer.writeLine "		  }"
//		writer.writeLine "	   }"
		writer.writeLine "	}"
		writer.writeLine " }"
		writer.newLine()
		writer.newLine()
		writer.writeLine '// Smart SFS springsecurity config:'
		writer.writeLine "grails.plugin.springsecurity.logout.postOnly = false"
		writer.writeLine "grails.plugin.springsecurity.successHandler.alwaysUseDefault = true"
		writer.writeLine "grails.plugin.springsecurity.logout.alwaysUseDefaultTargetUrl = true"
		writer.writeLine "grails.plugin.springsecurity.rejectIfNoRule = false"
		writer.writeLine "grails.plugin.springsecurity.fii.rejectPublicInvocations = false"
		writer.newLine()
		writer.writeLine "grails.plugin.springsecurity.userLookup.userDomainClassName = 'com.sfs.smartsfs.sec.User'"
		writer.writeLine "grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'com.sfs.smartsfs.sec.UserRole'"
		writer.writeLine "grails.plugin.springsecurity.authority.className = 'com.sfs.smartsfs.sec.Role'"
		writer.writeLine "grails.plugin.springsecurity.authority.groupAuthorityNameField = 'authorities'"
		writer.writeLine "grails.plugin.springsecurity.useRoleGroups = true"
		writer.writeLine "grails.plugin.springsecurity.requestMap.className = 'com.sfs.smartsfs.sec.RequestMap'"
		writer.writeLine "grails.plugin.springsecurity.securityConfigType = 'Requestmap'"
		writer.newLine()
		writer.writeLine "grails.exceptionresolver.params.exclude = ['password', 'class']"
		writer.newLine()
		writer.writeLine 'grails.plugin.springsecurity.controllerAnnotations.staticRules = ['
		writer.writeLine "\t'/':                              ['permitAll'],"
		writer.writeLine "\t'/index':                         ['permitAll'],"
		writer.writeLine "\t'/index.gsp':                     ['permitAll'],"
		writer.writeLine "\t'/assets/**':                     ['permitAll'],"
		writer.writeLine "\t'/**/js/**':                      ['permitAll'],"
		writer.writeLine "\t'/**/css/**':                     ['permitAll'],"
		writer.writeLine "\t'/**/images/**':                  ['permitAll'],"
		writer.writeLine "\t'/**/favicon.ico':                ['permitAll']"
		writer.writeLine ']'
		writer.newLine()
		writer.writeLine "//AUDIT CONFIG - audittrail doplni audit polia v entitach s anotaciou @gorm.AuditStamp"
		writer.writeLine "smartsfs{"
		writer.writeLine "	  audittrail{"
		writer.writeLine "		 // ** if field is not specified then it will default to 'createdBy'"
		writer.writeLine "		 createdBy.field = 'createdBy'  // createdBy is default"
		writer.writeLine "		 // ** fully qualified class name for the type"
		writer.writeLine "		 createdBy.type   = 'java.lang.String' //Long is the default"
		writer.writeLine "		 // ** the constraints settings"
		writer.writeLine "		 createdBy.constraints = 'nullable:false,editable:false,bindable:false'"

		writer.writeLine "		 createdDate.field = 'createdDate'"
		writer.writeLine "		 createdDate.type  = 'java.sql.Timestamp'"
		writer.writeLine "		 createdDate.constraints = 'nullable:false,editable:false,bindable:false'"

		writer.writeLine "		 editedBy.field = 'updatedBy'"
		writer.writeLine "		 editedBy.type = 'java.lang.String'"
		writer.writeLine "		 editedBy.constraints = 'nullable:false,editable:false,bindable:false'"

		writer.writeLine "		 editedDate.field = 'updatedDate'"
		writer.writeLine "		 editedDate.type  = 'java.sql.Timestamp'"
		writer.writeLine "		 editedDate.constraints = 'nullable:false,editable:false,bindable:false'"

		writer.writeLine "		 //custom closure to return the current user who is logged in"
		writer.writeLine "		 currentUserClosure = {ctx->"
		writer.writeLine "			//ctx is the applicationContext"
		writer.writeLine "			//default is basically"
		writer.writeLine "			def uname= ctx.springSecurityService.principal?.username"
		writer.writeLine "			return uname?:'anonymous'"
		writer.writeLine "		 }"
		writer.writeLine "   }"
		writer.writeLine "}"


	}
}

setDefaultTarget(smartQuickstart)
