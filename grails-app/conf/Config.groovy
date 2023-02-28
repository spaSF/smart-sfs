import org.apache.log4j.DailyRollingFileAppender
import org.apache.log4j.PatternLayout
import org.springframework.security.core.userdetails.UserDetails

// configuration for plugin testing - will not be included in the plugin zip
grails.project.groupId="com.sfs"
grails.mime.disable.accept.header.userAgents = [
	'Gecko',
	'WebKit',
	'Presto',
	'Trident'
]
grails.mime.types = [ // the first one is the default format
	all:           '*/*', // 'all' maps to '*' or the first available format in withFormat
	atom:          'application/atom+xml',
	css:           'text/css',
	csv:           'text/csv',
	form:          'application/x-www-form-urlencoded',
	html:          [
		'text/html',
		'application/xhtml+xml'
	],
	js:            'text/javascript',
	json:          [
		'application/json',
		'text/json'
	],
	multipartForm: 'multipart/form-data',
	rss:           'application/rss+xml',
	text:          'text/plain',
	hal:           [
		'application/hal+json',
		'application/hal+xml'
	],
	xml:           [
		'text/xml',
		'application/xml']
]
grails.resources.adhoc.patterns = [
	'/images/*',
	'/css/*',
	'/js/*',
//	'/isomorphic/*',//neda sa tlacit cez print preview
	'/plugins/*'
]
grails.resources.adhoc.includes = [
	'/images/**',
	'/css/**',
	'/js/**',
	'/isomorphic/**',
	'/plugins/**'
]
grails.resources.adhoc.excludes = ['/isomorphic/IDACall**','/isomorphic/HttpProxy**']
//since 1.2.13 resources are looked up using servletContext.getResource method by default. 
//To enable using the grailsResourceLocator bean, you must set this setting in Config.groovy
// enable only when you need it
//DOLEZITE, inak nenajde ani hovno
grails.resources.resourceLocatorEnabled = true

grails.controllers.defaultScope = 'singleton'
// GSP settings
grails {
	views {
		gsp {
			encoding = 'UTF-8'
			htmlcodec = 'xml' // use xml escaping instead of HTML4 escaping
			codecs {
				expression = 'html' // escapes values inside ${}
				scriptlet = 'html' // escapes output from scriptlets in GSPs
				taglib = 'none' // escapes output from taglibs
				staticparts = 'none' // escapes output from static template parts
			}
		}
		// escapes all not-encoded output at final stage of outputting
		// filteringCodecForContentType.'text/html' = 'html'
	}
}

grails.converters.encoding = "UTF-8"
// scaffolding templates configuration
grails.scaffolding.templates.domainSuffix = 'Instance'

// Set to false to use the new Grails 1.2 JSONBuilder in the render method
grails.json.legacy.builder = false
// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = true
// packages to include in Spring bean scanning
grails.spring.bean.packages = []
// whether to disable processing of multi part requests
grails.web.disable.multipart=false

// request parameters to mask when logging exceptions
grails.exceptionresolver.params.exclude = ['password','class']

// configure auto-caching of queries by default (if false you can cache individual queries with 'cache: true')
grails.hibernate.cache.queries = false

// configure passing transaction's read-only attribute to Hibernate session, queries and criterias
// set "singleSession = false" OSIV mode in hibernate configuration after enabling
grails.hibernate.pass.readonly = false
// configure passing read-only to OSIV session by default, requires "singleSession = false" OSIV mode
grails.hibernate.osiv.readonly = false

grails.databinding.dateFormats = [
	"yyyy-MM-dd'T'HH:mm:ss.S",
	"yyyy-MM-dd'T'HH:mm:ss'Z'",
	'yyyy-MM-dd HH:mm:ss.S',
	'yyyy-MM-dd HH:mm:ss',
	'dd.MM.yyyy HH:mm:ss',
	'dd.MM.yyyy',
	'yyyy-MM-dd'
]
//aby netrimoval
grails.databinding.convertEmptyStringsToNull=true
grails.databinding.trimStrings=false

grails.gorm.default.constraints = {'*'(nullable: true)}
grails.gorm.failOnError = true
smartsfs.supportedLocales = [
	new Locale('sk'),
	Locale.ENGLISH
]
smartsfs.defaultLocale = new Locale('sk');

logfile.srvHome = System.getProperty("catalina.home")?System.getProperty("catalina.home"):".."

// Smart SFS plugin application resources:
environments {
	development {
		log4j = {
			error 'org.codehaus.groovy.grails.web.servlet',
					// controllers
					'org.codehaus.groovy.grails.web.pages',
					// GSP
					'org.codehaus.groovy.grails.web.sitemesh',
					// layouts
					'org.codehaus.groovy.grails.web.mapping.filter',
					// URL mapping
					'org.codehaus.groovy.grails.web.mapping',
					// URL mapping
					'org.codehaus.groovy.grails.commons',
					// core / classloading
					'org.codehaus.groovy.grails.plugins',
					// plugins
					'org.codehaus.groovy.grails.orm.hibernate',
					// hibernate integration
					'org.springframework',
					'org.hibernate',
					'net.sf.ehcache.hibernate'

			debug 'grails.app',
					'org.hibernate.SQL',
					'com.sfs.smartsfs.audit'
//					'com.sfs.smartsfs',
//					'org.codehaus.groovy.grails.plugins'
//					'org.springframework.transaction',
//					'org.springframework.security',

		}
//		grails.resources.modules = {
//			smartsfs{
//				resource url: '/isomorphic/system/modules-debug/ISC_Core.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules-debug/ISC_Foundation.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules-debug/ISC_Containers.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules-debug/ISC_Grids.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules-debug/ISC_Forms.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules-debug/ISC_DataBinding.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules-debug/ISC_Calendar.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules-debug/ISC_History.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules-debug/ISC_RichTextEditor.js', disposition: 'head'
//			}
//			scapplication {
//				resource url:'/js/scLogin.js'
//				resource url:'/js/scGlobal.js'
//				resource url:'/js/scRestDataSource.js'
//				resource url:'/js/scFormItems.js'
//				resource url:'/js/scTabset.js'
//				resource url:'/js/scUser.js'
//				resource url:'/js/scApplication.js'
//				resource url:'/js/scLocale.js'
//				resource url:'/js/scGrid.js'
//				resource url:'/js/scDetail.js'
//				resource url:'/js/scButtons.js'
//				resource url:'/js/smart-sfs.js'
//			}
//		}
	}
	test {
		log4j = {
			appenders {
				appender new DailyRollingFileAppender(
						name: 'dailyAppender',
						datePattern: "'.'yyyy-MM-dd",  // See the API for all patterns.
						fileName: "tmp/logs/smart-sfs.log",
						layout: pattern(conversionPattern:'%d [%t] %-5p %c{2} %x - %m%n')
						)
				layout: new PatternLayout("[%p] [%c{3}] %m%n")
			}
			error  dailyAppender:
				'org.codehaus.groovy.grails.web.servlet',
				// controllers
				'org.codehaus.groovy.grails.web.pages',
				// GSP
				'org.codehaus.groovy.grails.web.sitemesh',
				// layouts
				'org.codehaus.groovy.grails.web.mapping.filter',
				// URL mapping
				'org.codehaus.groovy.grails.web.mapping',
				// URL mapping
				'org.codehaus.groovy.grails.commons',
				// core / classloading
				'org.codehaus.groovy.grails.plugins',
				// plugins
				'org.codehaus.groovy.grails.orm.hibernate',
				// hibernate integration
				'org.springframework',
				'org.hibernate',
				'net.sf.ehcache.hibernate'
			debug   dailyAppender:
				'grails.app',
				'org.hibernate.SQL',
				'org.springframework.transaction',
				'org.springframework.security'
		}
//		grails.resources.modules = {
//			smartsfs{
//				resource url: '/isomorphic/system/modules/ISC_Core.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules/ISC_Foundation.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules/ISC_Containers.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules/ISC_Grids.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules/ISC_Forms.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules/ISC_DataBinding.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules/ISC_Calendar.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules/ISC_History.js', disposition: 'head'
//				resource url: '/isomorphic/system/modules/ISC_RichTextEditor.js', disposition: 'head'
//			}
//			scapplication {
//				resource url:'/js/min/scLogin.js'
//				resource url:'/js/min/scGlobal.js'
//				resource url:'/js/min/scRestDataSource.js'
//				resource url:'/js/min/scFormItems.js'
//				resource url:'/js/min/scTabset.js'
//				resource url:'/js/min/scUser.js'
//				resource url:'/js/min/scApplication.js'
//				resource url:'/js/min/scLocale.js'
//				resource url:'/js/min/scGrid.js'
//				resource url:'/js/min/scDetail.js'
//				resource url:'/js/min/scButtons.js'
//				resource url:'/js/smart-sfs.js'
//			}
//		}
	}
}

//Smart SFS OTP config
smartsfs.security.useOTP="false"
smartsfs.security.otp.roundbysec='30'
smartsfs.security.otp.tzero='0'
smartsfs.security.otp.digits='6'
smartsfs.security.otp.crypto='HmacSHA1' //HmacSHA256,HmacSHA512
smartsfs.security.otp.qrkeyformat='BASE32' //format kluca pre QR kod
smartsfs.security.otp.qrAppName='smart-sfs-plugin' //format kluca pre QR kod


// Smart SFS springsecurity config:
grails.plugin.springsecurity.logout.postOnly = false
grails.plugin.springsecurity.successHandler.alwaysUseDefault = true
grails.plugin.springsecurity.logout.alwaysUseDefaultTargetUrl = true
grails.plugin.springsecurity.rejectIfNoRule = false
grails.plugin.springsecurity.fii.rejectPublicInvocations = false

grails.plugin.springsecurity.userLookup.userDomainClassName = 'com.sfs.smartsfs.sec.User'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'com.sfs.smartsfs.sec.UserRole'
grails.plugin.springsecurity.authority.className = 'com.sfs.smartsfs.sec.Role'
grails.plugin.springsecurity.authority.groupAuthorityNameField = 'authorities'
grails.plugin.springsecurity.useRoleGroups = true
grails.plugin.springsecurity.requestMap.className = 'com.sfs.smartsfs.sec.RequestMap'
grails.plugin.springsecurity.securityConfigType = 'Requestmap'

grails.plugin.springsecurity.controllerAnnotations.staticRules = [
	'/':                              ['permitAll'],
	'/index':                         ['permitAll'],
	'/index.gsp':                     ['permitAll'],
	'/assets/**':                     ['permitAll'],
	'/**/js/**':                      ['permitAll'],
	'/**/css/**':                     ['permitAll'],
	'/**/images/**':                  ['permitAll'],
	'/**/favicon.ico':                ['permitAll']]

//AUDIT CONFIG - audittrail doplni audit polia v entitach s anotaciou @gorm.AuditStamp
smartsfs{
	audittrail{
		// ** if field is not specified then it will default to 'createdBy'
		createdBy.field = 'createdBy'  // createdBy is default
		// ** fully qualified class name for the type
		createdBy.type   = 'java.lang.String' //Long is the default
		// ** the constraints settings
		createdBy.constraints = 'nullable:false,editable:false,bindable:false'
		
		createdDate.field = 'createdDate'
		createdDate.type  = 'java.util.Date'
		createdDate.constraints = 'nullable:false,editable:false,bindable:false'
		
		editedBy.field = 'updatedBy'
		editedBy.type = 'java.lang.String'
		editedBy.constraints = 'nullable:false,editable:false,bindable:false'
		
		editedDate.field = 'updatedDate'
		editedDate.type  = 'java.util.Date'
		editedDate.constraints = 'nullable:false,editable:false,bindable:false'
		//custom closure to return the current user who is logged in
		currentUserClosure = {ctx->
			//ctx is the applicationContext
			//default is basically
			def uname= ctx.springSecurityService.principal?.username
			return uname?:'unknown'
		}
		
		crCustom1.field = "createdById"
		crCustom1.type  = "java.lang.Long"
		edCustom1.field = "updatedById"
		edCustom1.type  = "java.lang.Long"
		custom1Closure = {ctx->
			if(ctx.springSecurityService.principal instanceof UserDetails){
				return ctx.springSecurityService.principal?.id
			}else{
				return null
			}
		}
	}
}



