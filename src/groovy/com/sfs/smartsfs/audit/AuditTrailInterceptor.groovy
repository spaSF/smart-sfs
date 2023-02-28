package com.sfs.smartsfs.audit


import org.apache.commons.lang.ArrayUtils
import org.apache.log4j.Logger
import org.hibernate.EmptyInterceptor
import org.hibernate.type.Type

class AuditTrailInterceptor extends EmptyInterceptor {
	private static final Logger log = Logger.getLogger(AuditTrailInterceptor)
	
	//injected
	AuditTrailHelper auditTrailHelper
	Map fieldPropsMap	

	boolean onFlushDirty(Object entity, Serializable id, Object[] currentState,Object[] previousState, String[] propertyNames,Type[] types) {
        //exit fast if its off
        if(disableAuditTrailStamp(entity)) return true
        
		def dval = auditTrailHelper.setDateField(entity,'editedDate', System.currentTimeMillis())
		if(dval)
			setValue(currentState, propertyNames, fieldPropsMap.get('editedDate').name, dval)

		def uval = auditTrailHelper.setUserField(entity,'editedBy')
		if(uval)
		    setValue(currentState, propertyNames, fieldPropsMap.get('editedBy').name, uval)
		
	    def c1val = auditTrailHelper.setCustomField(entity,'edCustom1')
	    if(c1val)
	    	setValue(currentState, propertyNames, fieldPropsMap.get('edCustom1')?.name, c1val)

	    def c2val = auditTrailHelper.setCustomField(entity,'edCustom2')
	    if(c2val)
	    	setValue(currentState, propertyNames, fieldPropsMap.get('edCustom2')?.name, c2val)

			
		return true
	}

	boolean onSave(Object entity, Serializable id, Object[] currentState,String[] propertyNames, Type[] types) {
	    //exit fast if its off
        if(disableAuditTrailStamp(entity)) return true
        
	    def time = System.currentTimeMillis()
	    [FieldProps.CREATED_DATE_KEY, FieldProps.EDITED_DATE_KEY].each{ key->
			def valToSet = auditTrailHelper.setDateField(entity,key, time)
			if(valToSet)
			    setValue(currentState, propertyNames, fieldPropsMap.get(key).name, valToSet)
		}
		[FieldProps.CREATED_BY_KEY, FieldProps.EDITED_BY_KEY].each{ key->
			def valToSet = auditTrailHelper.setUserField(entity,key)
			if(valToSet)
			    setValue(currentState, propertyNames, fieldPropsMap.get(key).name, valToSet)
		}

		[FieldProps.CR_CUSTOM1_KEY, FieldProps.CR_CUSTOM2_KEY].each{ key->
			def valToSet = auditTrailHelper.setCustomField(entity,key)
			if(valToSet)
				setValue(currentState, propertyNames, fieldPropsMap.get(key).name, valToSet)
		}

		
    	return true
  	}

	def setValue(Object[] currentState, String[] propertyNames, String propertyToSet, Object value) {
		int index = ArrayUtils.indexOf(propertyNames, propertyToSet)  //fieldList.indexOf(propertyToSet)
		if (index >= 0) {
			currentState[index] = value
		}
	}
	
	boolean disableAuditTrailStamp(entity){
	    (entity.hasProperty('disableAuditTrailStamp') && entity.disableAuditTrailStamp)?true:false
	}

}

