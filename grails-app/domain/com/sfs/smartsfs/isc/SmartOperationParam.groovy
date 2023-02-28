package com.sfs.smartsfs.isc

import com.sfs.smartsfs.audit.AuditStamp


/**
 * SCOperationParam - vstupne parametre operacie
 * @author mkr
 *
 */
@AuditStamp
class SmartOperationParam implements Comparable{
	String name
	String type //fieldType
	String title 
	Integer fieldPosition //pozicia v operation forme
	Boolean required
	Boolean canEdit //editovatelne
	Boolean visible
	String editorType //FormItem className
	Integer decimalPad //minimum number of digits shown after the decimal point.
	Integer decimalPrecision
	Integer length
	String validators
	String displayField //z option data source
	String valueField //z option data source
	String optionDataSource
	String prompt //help text hoover - lokalizacny text
	String mask //textItem mask
	String  characterCasing //prevod vstupu na upper/lower
	String valueMap //custom value map pre combo

	Boolean evaluateInitVal //urobit eval nad initialValue - ak je property detailu, alebo fcia
	String initialValue //inicializacia hodntoy, konstanta/property detail formu (ak isDetailValue==true)
	
	String formItemProps //doplnujuce

	static belongsTo=[scOperation:SmartOperation]
	
	
	static mapping = {
		table 'SC_OPER_PARAM'
		id generator:'native',params:[sequence:'SC_OPER_PARAM_SEQ']
		scOperation column:'XOPERATION',fetch:'join',index:"SC_OPER_PARAM_OPER_FK"
		validators length:2000
		valueMap length:2000
		formItemProps length:2000
	}

    static constraints = {
		name nullable:false
		fieldPosition nullable:false
		validators maxSize:2000
		valueMap maxSize:2000
		formItemProps maxSize:2000
    }
	@Override
	public int compareTo(Object o) {
		this.fieldPosition.compareTo(o.fieldPosition);
	}

}
