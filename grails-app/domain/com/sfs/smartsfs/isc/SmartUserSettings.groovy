package com.sfs.smartsfs.isc

import com.sfs.smartsfs.sec.User

class SmartUserSettings {

	String appCase 
	String appObject
	String name
	User user
	Boolean useDefault
	String settingObject
	
	static mapping = {
		table 'SC_USER_SETTING'
		id generator:'native',params:[sequence:'SC_SETTING_SEQ']
		settingObject type:'materialized_clob' 
	}

    static constraints = {
		appCase nullable:false,blank:false
		appObject nullable:false,blank:false
		user nullable:false,blank:false
    }
	
}
