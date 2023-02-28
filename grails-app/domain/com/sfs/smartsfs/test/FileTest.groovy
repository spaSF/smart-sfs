package com.sfs.smartsfs.test

import groovy.lang.Closure

import org.grails.databinding.BindUsing

import com.sfs.smartsfs.app.ConfigProperty
import com.sfs.smartsfs.audit.AuditStamp
import com.sfs.smartsfs.isc.SmartFile

@AuditStamp
class FileTest {
	String descr
	Boolean storeLocaly = false

	SmartFile fileStore
	SmartFile fileStore2
/*
 * 	 For DetailHasOneItem example
 */
//	@BindUsing({
//		obj, source ->
//		final String strJson = source['prop']
//		if (strJson.isNumber()) {
//			return Long.parseLong(strJson)
//		} else {
//			ConfigProperty objCls = new ConfigProperty(JSON.parse(strJson))
//			objCls.validate()
//			if (!objCls.hasErrors()) {
//				objCls.save flush:true
//				return objCls.id
//			}
//		}
//	})
	ConfigProperty prop
		
	static mapping = {
		table 'SC_FILE_TEST'
		version true
		id generator:'native',params:[sequence:'SC_FILE_TEST_SEQ']
		fileStore column:"XFILE"
		fileStore2 column:"XFILE2"
	}
	
    static constraints = {
		descr nullable:false,blank:false
    }
}
