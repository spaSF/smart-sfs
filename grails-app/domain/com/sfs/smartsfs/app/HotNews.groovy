package com.sfs.smartsfs.app

import com.sfs.smartsfs.audit.AuditStamp
import com.sfs.smartsfs.enums.NewsPriority


@AuditStamp
class HotNews {

	Date startDate
	Date endDate
	String messageText
	String needrole
	NewsPriority priority
	
	String _messageText
	
	static transients = ['_messageText']
	
	static mapping ={
		table "SC_HOTNEWS"
		id generator:'native',params:[sequence:'SC_HOTNEWS_SEQ']
		startDate column:"STARTDATE"
		endDate column:"ENDDATE"
		messageText type: 'materialized_clob' 
	}
	
	static constraints = {
		startDate nullable: false
		messageText nullable: false	
	}

	def afterLoad() {
		this._messageText = this.messageText
	}

	def afterInsert(){
		this._messageText = this.messageText
	}
	
}
