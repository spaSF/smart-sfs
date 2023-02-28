package com.sfs.smartsfs.app

import com.sfs.smartsfs.audit.AuditStamp

@AuditStamp
class MenuItem {
	Integer position
	String title
	String uri
	String gridDS
	//	String detailDS
	String customCompFn
	MenuItem parent
	String needrole
	Boolean isOpen = true
   
   String icon //custom node icon
	
	
	static shortFields = ["title"]

//	static belongsTo=[parent:MenuItem]

	static mapping = {
		table 'SC_MENUITEM'
		id generator:'native',params:[sequence:'SC_MENUITEM_SEQ']
		parent column:"XITEM"
		customCompFn column:"ICON_CLS"
	}
	static constraints = {
	}
}
