import com.sfs.smartsfs.app.LocalizationMessageSource
import com.sfs.smartsfs.audit.AuditTrailHelper
import com.sfs.smartsfs.audit.AuditTrailInterceptor
import com.sfs.smartsfs.audit.FieldProps
import com.sfs.smartsfs.isc.SmartDateConversionHelper
import com.sfs.smartsfs.sec.ScUserDetailsService
import com.sfs.smartsfs.util.ScLocaleResolverService

// Place your Spring DSL code here
beans = {
	//audit
//	def fprops = FieldProps.buildFieldMap(application.config)
//
//	auditTrailHelper(AuditTrailHelper) {
//		grailsApplication = ref("grailsApplication")
//		fieldPropsMap = fprops
//	}
//
//	entityInterceptor(AuditTrailInterceptor) {
//		auditTrailHelper = ref("auditTrailHelper")
//		fieldPropsMap = fprops
//	}
//	
//	
//	messageSource(LocalizationMessageSource)
//	userDetailsService(ScUserDetailsService){
//		springSecurityService = ref('springSecurityService')
//		scOTPService = ref('scOTPService')
//	}
//	localeResolver(ScLocaleResolverService) {
//		springSecurityService = ref('springSecurityService')
//		supportedLocales = application.config.smartsfs.supportedLocales ?: (application.config.smartsfs.supportedLocales ?: [])
//		defaultLocale = application.config.smartsfs.defaultLocale ?: (application.config.grails.smartsfs.defaultLocale ?: null)
//	}
//	defaultGrailsBigDecimalConverter com.sfs.smartsfs.util.LocaleAwareBigDecimalConverter //override bigdec binding kvoli bodkam porad v req
//	//smartclient posiela datetime v UTC
//	defaultDateConverter(SmartDateConversionHelper){
//		configHolderService = ref('configHolderService')
//	}
	
	
}
