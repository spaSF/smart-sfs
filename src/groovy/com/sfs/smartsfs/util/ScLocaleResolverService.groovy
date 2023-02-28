package com.sfs.smartsfs.util

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.util.WebUtils


/**
 *
 * Locale resolver that can limit choice user preferred language.
 * define bean of this resolver in resources.groovy:
 *
 *  localeResolver(SmartConfigLocaleResolver) {
 *      supportedLocales = application.config.grails.plugin.localeConfiguration.supportedLocales ?: []
 *      defaultLocale = application.config.grails.plugin.localeConfiguration.defaultLocale ?: null
 *  }
 *
 */
class ScLocaleResolverService implements LocaleResolver {
	def springSecurityService

	static final LOCALE_SESSION_ATTRIBUTE_NAME =  ScLocaleResolverService.class.name + '.LOCALE';
	List<Locale> supportedLocales
	Locale defaultLocale


	@Override
	void setLocale(HttpServletRequest request, HttpServletResponse response, Locale newLocale) {
		if (newLocale) {
			newLocale = findFirstSupportedLocale([newLocale])
		}
		WebUtils.setSessionAttribute(request, LOCALE_SESSION_ATTRIBUTE_NAME, newLocale);
	}

	@Override
	Locale resolveLocale(HttpServletRequest request) {
		Locale locale = (Locale) WebUtils.getSessionAttribute(request, LOCALE_SESSION_ATTRIBUTE_NAME)
		def auth = springSecurityService.principal
		if (!locale||(auth&&auth.hasProperty("lang")&&(auth?.lang)&& !(locale?.getLanguage().equals(new Locale(auth.lang).getLanguage())))) {
			if(auth){
				if(auth.hasProperty("lang")){
					if(auth.lang!=null){
						if(auth.country!=null){
							locale = new Locale(auth.lang,auth.country)
						}else{
							locale = new Locale(auth.lang)
						}
					}
					WebUtils.setSessionAttribute(request, LOCALE_SESSION_ATTRIBUTE_NAME, locale);
				}
			}
			if(!locale){
				locale = findFirstSupportedLocale(request.locales.toList()) ?: (defaultLocale ?: Locale.getDefault())
				WebUtils.setSessionAttribute(request, LOCALE_SESSION_ATTRIBUTE_NAME, locale);
			}
		}
		return locale;
	}

	Locale findFirstSupportedLocale(List<Locale> requestLocales) {
		return findFirstSupportedLocaleByLanguageAndCountry(requestLocales) ?: findFirstSupportedLocaleByLanguage(requestLocales)
	}

	Locale findFirstSupportedLocaleByLanguageAndCountry(List<Locale> requestLocales) {
		return requestLocales.find { it in supportedLocales }
	}

	Locale findFirstSupportedLocaleByLanguage(List<Locale> requestLocales) {
		for (Locale preferredLocale : requestLocales) {
			Locale supportedByLanguageLocale = supportedLocales?.find { it.language == preferredLocale.language }
			if (supportedByLanguageLocale) {
				return supportedByLanguageLocale
			}
		}
		return null
	}
}
