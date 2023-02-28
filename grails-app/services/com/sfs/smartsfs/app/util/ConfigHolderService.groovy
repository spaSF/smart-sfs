package com.sfs.smartsfs.app.util

import grails.transaction.Transactional

import org.codehaus.groovy.grails.commons.GrailsApplication

@Transactional
class ConfigHolderService {

	GrailsApplication grailsApplication
	
	Map<String, Object> getConfig(){
		grailsApplication.getFlatConfig()
	}
	
	def getObjectForKey(String key,defaultVal){
		return getConfig().get(key,defaultVal)
	}
	
    def getObjectForKey(String key) {
		log.debug getConfig().get(key)
		return getConfig().get(key)
    }
	def getValueForKey(String key){
		def configProps = grailsApplication.getConfig().toProperties()
		log.debug configProps.getProperty(key)
		return configProps.getProperty(key)
	}
	
	def getAppVersion(){
		return grailsApplication.getMetadata().getApplicationVersion() 
	}
	
	String getWebRootPath(){
		grailsApplication.mainContext.servletContext.getRealPath("/")
	}
}
