import com.sfs.smartsfs.app.Localization
import com.sfs.smartsfs.app.LocalizationMessageSource
import com.sfs.smartsfs.audit.AuditTrailHelper
import com.sfs.smartsfs.audit.AuditTrailInterceptor
import com.sfs.smartsfs.audit.FieldProps
import com.sfs.smartsfs.isc.SmartDateConversionHelper
import com.sfs.smartsfs.sec.ScUserDetailsService
import com.sfs.smartsfs.util.ApplicationContextHolder
import com.sfs.smartsfs.util.ScLocaleResolverService

class SmartSfsGrailsPlugin {
    // the plugin version
    def version = "2.5.2-SNAPSHOT"
	// the plugin version
	String groupId = 'com.sfs'
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.5 > 2.5.6"
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
        "grails-app/views/error.gsp",
		"grails-app/domain/com/sfs/smartsfs/test/**",
		"grails-app/controllers/com/sfs/smartsfs/test/**",
		"web-app/tmp/**",
		"web-app/upload/**",
		"lib/compiler.jar"
    ]

    // TODO Fill in these fields
    def title = "Smart Sfs Plugin" // Headline display name of the plugin
    def author = "MKrSPa"
    def authorEmail = "mkr@softforsolutions.com"
    def description = '''\
Generic aplikacia s pouzitim Smartclienta
'''
	List loadAfter = [
		'springSecurityCore',
		'controllers',
		'services',
		'hibernate4'
	]
//	'asset-pipeline'
	
//	List loadBefore = ['auditTrail']

	def dependsOn = [resources:"1.2 >*", springSecurityCore: "2.0.0",hibernate4: "4.3 > *",scaffolding:"2.1.2"] //,auditTrail:"2.1.2"

    // URL to the plugin's documentation
	def documentation = "http://alfa-redmine.internal.softforsolutions.com:8080/redmine/knowledgebase/categories/14"

    // Extra (optional) plugin metadata

    // License: one of 'APACHE', 'GPL2', 'GPL3'
//    def license = "APACHE"

    // Details of company behind the plugin (if there is one)
	def organization = [ name: "SoftForSolutions",url:"http://redmine.sfs.local:8080/redmine"]

    // Any additional developers beyond the author specified above.
	def developers = [
		[ name: "MKr", email: "mkr@softforsolutions.com" ],
		[ name: "SPa", email: "spa@softforsolutions.com" ]
	]

    // Location of the plugin's issue tracker.
//    def issueManagement = [ system: "JIRA", url: "http://jira.grails.org/browse/GPMYPLUGIN" ]

    // Online location of the plugin's browseable source code.
//    def scm = [ url: "http://svn.codehaus.org/grails-plugins/" ]

    def doWithWebDescriptor = { xml ->
        // TODO Implement additions to web.xml (optional), this event occurs before
    }

	def doWithSpring = {
		//audit
		def fprops = FieldProps.buildFieldMap(application.config)
		
		auditTrailHelper(AuditTrailHelper) {
			grailsApplication = ref("grailsApplication")
			fieldPropsMap = fprops
		}
	
		entityInterceptor(AuditTrailInterceptor) {
			auditTrailHelper = ref("auditTrailHelper")
			fieldPropsMap = fprops
		}
		
		messageSource(LocalizationMessageSource)
		userDetailsService(ScUserDetailsService){
			springSecurityService = ref('springSecurityService')
			scOTPService = ref('scOTPService')
		}
		localeResolver(ScLocaleResolverService) {
			springSecurityService = ref('springSecurityService')
			supportedLocales = application.config.smartsfs.supportedLocales ?: (application.config.smartsfs.supportedLocales ?: [])
			defaultLocale = application.config.smartsfs.defaultLocale ?: (application.config.grails.smartsfs.defaultLocale ?: null)
		}
		defaultGrailsBigDecimalConverter com.sfs.smartsfs.util.LocaleAwareBigDecimalConverter //override bigdec binding kvoli bodkam porad v req
		//smartclient posiela datetime v UTC - override 
		defaultDateConverter(SmartDateConversionHelper){
			configHolderService = ref('configHolderService')
		}
		
		
	}

	def doWithDynamicMethods = { ctx ->
		application.domainClasses.each { domainClass ->
			domainClass.metaClass.message = {Map parameters -> Localization.getMessage(parameters)}
			domainClass.metaClass.errorMessage = {Map parameters -> Localization.setError(delegate, parameters)}
		}

		application.serviceClasses.each { serviceClass ->
			serviceClass.metaClass.message = { Map parameters -> Localization.getMessage(parameters) }
		}
	}
    def doWithApplicationContext = { ctx ->
		ApplicationContextHolder.applicationContext = ctx
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }

    def onShutdown = { event ->
        // TODO Implement code that is executed when the application shuts down (optional)
    }
}
