package com.sfs.smartsfs.app

import com.sfs.smartsfs.audit.AuditStamp

@AuditStamp
class ConfigProperty {
	String key
	String description
	String value
	Boolean adminProperty = true

	static mapping = {
		table 'SC_CONFIG'
		version true
		id generator:'native',params:[sequence:'SC_CONFIG_SEQ']
		key column:'PROP_KEY',length:100
		value column:'VALUE',length:2000
	}
	static constraints = {
		key nullable:false, maxSize:100
		description nullable:true, maxSize:255
		value nullable:false,blank:false, maxSize:2000
		adminProperty nullable:false
	}

	def grailsApplication
	def afterUpdate () {
		updateConfigMap()
	}

	def afterInsert () {
		updateConfigMap()
	}

	def updateConfigMap() {
		Boolean useQuotes = !(value.isNumber() || value.isFloat() || value in ['true', 'false'])
		String objectString
		if(key ==~ /(.*[^a-zA-Z0-9\.]+.*)/){
			objectString = "'''${key}=${value}'''"
		}
		else{
			objectString = useQuotes ? "${key}='''${value}'''" : "${key}=${value}"
		}
		log.debug "update config for ${key} = ${value}"
		ConfigObject configObject = new ConfigSlurper().parse(objectString)
		grailsApplication.getConfig().merge(configObject)
	}
}
