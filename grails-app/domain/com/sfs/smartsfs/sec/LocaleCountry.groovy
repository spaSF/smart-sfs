package com.sfs.smartsfs.sec

class LocaleCountry {

	String id
	String nazov
	LocaleLang lang
	
	static mapping={
		table "SC_LOCALE_COUNTRY"
		
		id generator:"assigned",length:2
		lang column:"XLANG",length:2
		nazov length:50
	}
	
    static constraints = {
		id nullable:false,blank:false,maxSize:2
		nazov nullable:false,maxSize:50
		lang nullable:false
    }
}
