package com.sfs.smartsfs.isc

import org.codehaus.groovy.grails.exceptions.GrailsRuntimeException

import com.sfs.smartsfs.audit.AuditStamp
import com.sfs.smartsfs.sec.RequestMap

@AuditStamp
class SmartSource {
	Long  id
	String ID
	String title

	String dataURL
	String addDataURL
	String fetchDataURL
	String removeDataURL
	String updateDataURL

	String dataFormat
	Boolean disableQueuing //disables request queuing for this RestDataSource.
	String jsonPrefix	//The default prefix is "<SCRIPT>//'\"]]>>isc_JSONResponseStart>>".??neviem co to je
	String jsonRecordXPath
	String jsonSuffix //The default suffix is "//isc_JSONResponseEnd".

	Boolean addGlobalId

	Boolean canMultiSort
	Boolean hasPdfReport = true

	//pridane properties
	Boolean canEdit
	Boolean canSave
	String requiresRole //access
	String editRequiresRole
	String saveRequiresRole
	String deleteRequiresRole

	//fcie kontroly spravania
	String isReadAble = "function(comp){return true;}"
	String isCreateAble = "function(comp){return true;}" 
	String isEditAble  = "function(comp){return true;}"
	String isRemoveAble  = "function(comp){return true;}"
	
	String initValues //pri vytvoreni recordu
	
	String customProfile //default profil pre grid
		
	String titleField
	String dataField //field that has the most pertinent numeric, date, or enum value, for use when a DataBoundComponent needs to show a short summary of a record.
	String descriptionField //long description of the record
	String iconField //Designates a field of type:"image" as the field to use when rendering a record as an image
	String infoField //second most pertinent piece of textual information in the record

	String inheritsFrom //naplnit inheritsFrom v JS podla ID
	String detailFormDS
	String detailFormUri
	String pluralTitle

	String gridProperties //custom grid properties
	String dsProperties
	String formProperties

	String contextRoot //context root pre multi modular app 
	
	SortedSet<SmartSourceField> fields

	static shortFields = ["ID"]
	static hasMany=[fields:SmartSourceField,operations:SmartOperation]
	static mappedBy =[fields:"dSource",operations:"dSource"]

	static mapping ={
		table 'SC_DATASOURCE'
		id column:'metaID',generator:'native',params:[sequence:'SC_DATASOURCE_SEQ']
		fields cascade: 'all,all-delete-orphan',lazy:false,sort:'fieldPosition'
		operations cascade: 'all,all-delete-orphan',lazy:false,sort:"position"
		gridProperties length:2000
	}

	static constraints = {
		gridProperties maxSize:2000
		dsProperties maxSize:2000
		formProperties maxSize:2000
		isReadAble maxSize:512
		isCreateAble maxSize:512
		isEditAble maxSize:512
		isRemoveAble maxSize:512
		
		initValues maxSize:512
	}
   
	SmartSource clone(){
		SmartSource klon = new SmartSource(this.properties)
		klon.id=null
		klon.fields= new TreeSet<SmartSourceField>()
		this.fields.each {SmartSourceField fld->
			SmartSourceField fldKlon = new SmartSourceField(fld.properties)
			fldKlon.dSource=klon
			fldKlon.id=null
			klon.fields<<fldKlon
		}
		klon.operations = new ArrayList<SmartOperation>()
		this.operations.each {op->
			SmartOperation opKlon = op.clone()
			opKlon.dSource = klon
			klon.operations<<opKlon
		}
		return klon
	}
	
	def afterInsert(){
		if(dataURL&&!RequestMap.findByUrl(dataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:dataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
		if(addDataURL&&!RequestMap.findByUrl(addDataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:addDataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
		if(fetchDataURL&&!RequestMap.findByUrl(fetchDataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:fetchDataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
		if(removeDataURL&&!RequestMap.findByUrl(removeDataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:removeDataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
		if(updateDataURL&&!RequestMap.findByUrl(updateDataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:updateDataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
	
	}

	def afterUpdate(){
		if(dataURL&&!RequestMap.findByUrl(dataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:dataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
		if(addDataURL&&!RequestMap.findByUrl(addDataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:addDataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
		if(fetchDataURL&&!RequestMap.findByUrl(fetchDataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:fetchDataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
		if(removeDataURL&&!RequestMap.findByUrl(removeDataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:removeDataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
		if(updateDataURL&&!RequestMap.findByUrl(updateDataURL.toLowerCase().replaceAll(".json",".*"))){
			new RequestMap(url:updateDataURL.toLowerCase().replaceAll(".json",".*"),configAttribute:"IS_AUTHENTICATED_FULLY").save()
		}
	}
}
