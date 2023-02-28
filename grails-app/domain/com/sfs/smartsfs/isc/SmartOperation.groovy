package com.sfs.smartsfs.isc

import com.sfs.smartsfs.audit.AuditStamp
import com.sfs.smartsfs.sec.RequestMap


/**
 * SCOperation - custom operacie datasource - vykonava DS controller
 * @author mkr
 *
 */
@AuditStamp
class SmartOperation {
	Integer position
	String code
	String title //nazov
	String prompt //help
	String uri //url controller/action.json
	String scDialogFunction //nazov smart client custom js fcie s implementaciou operacie
	String icon //ikona pre operacny button
	String requiresRole //pristup pre role oddelene ciarkou
	PlaceOnType placeOn //umiestnenie operacie na gride/detaile
	String returnStatusPath = 'status' //cesta k vyslednemu statusu operacie, default response.status
	String successTestValue = '0' //success value default status==0
	String returnMsgPath = 'data' //cesta k navratovej msg, default response.data
	Boolean needRefresh = false //potreba refreshu v callbacku, refreshne detail/grid
	String callbackOnSuccess //callback fcia pri uspesnom volani
	String callbackParam //parameter callbacku - cesta v response premennej
	Boolean useIdAsOnlyParam = false //pouzit primary key data source ako jediny parameter
	Boolean downloadResult = false
	Boolean uploadFile = false
	String canPerform //override _canPerform - fncia
	SortedSet<SmartOperationParam> operationParams
	
	static hasMany=[operationParams:SmartOperationParam]
	static mappedBy =[operationParams:"scOperation"]

	static belongsTo=[dSource:SmartSource]
	
	static mapping = {
		table 'SC_OPERATION'
		id generator:'native',params:[sequence:'SC_OPERATION_SEQ']
		dSource column:'XDATASOURCE',fetch:'join',index:"SC_OPERATION_DS_FK"
		placeOn length:1
		callbackOnSuccess length:2000
		scDialogFunction length:2000
		operationParams cascade: 'all,all-delete-orphan',lazy:false,sort:'fieldPosition'
	}

    static constraints = {
		code blank: false
		title nullable:false
//		uri nullable:false
		placeOn nullable:false
		needRefresh nullable:false
		callbackOnSuccess maxSize:2000
		scDialogFunction maxSize:2000
		useIdAsOnlyParam nullable:false
		canPerform maxSize:2000
    }
	
	SmartOperation clone(){
		SmartOperation klon = new SmartOperation(this.properties)
		klon.id=null
		klon.operationParams = new TreeSet<SmartOperationParam>()
		this.operationParams.each {par->
			SmartOperationParam parKlon = new SmartOperationParam(par.properties)
			parKlon.scOperation = klon
			parKlon.id=null
			klon.operationParams<<parKlon
		}
		return klon
	}
	
	def afterInsert(){
		if(uri&&!RequestMap.findByUrl(uri.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:uri.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
	}
	def afterUpdate(){
		if(uri&&!RequestMap.findByUrl(uri.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:uri.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
	}
}
