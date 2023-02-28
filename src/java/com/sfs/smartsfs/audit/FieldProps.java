package com.sfs.smartsfs.audit;
import groovy.util.ConfigObject;
import java.util.Map;
import java.util.HashMap;

class FieldProps {
	private static final String DATE_CONS = "nullable:false, display:false, editable:false, bindable:false";
	private static final String USER_CONS = "nullable:true, display:false, editable:false, bindable:false";

	private static final String CUST_CONS = "nullable:true, editable:false, bindable:false";
	
	
	public static final String CREATED_DATE_KEY = "createdDate";
	public static final String EDITED_DATE_KEY = "editedDate";
	public static final String CREATED_BY_KEY = "createdBy";
	public static final String EDITED_BY_KEY = "editedBy";

	public static final String CR_CUSTOM1_KEY = "crCustom1";
	public static final String ED_CUSTOM1_KEY = "edCustom1";
	public static final String CR_CUSTOM2_KEY = "crCustom2";
	public static final String ED_CUSTOM2_KEY = "edCustom2";

	String name;
	Class  type;
	//Object initValue;
	String constraints;
	String mapping;
	
	public static FieldProps init(String defaultName,String defaultType, String defaultCons,String defaultMapping, ConfigObject configObj) {
		//System.out.println("ConfigObject : " + co);
		if(configObj == null || configObj.isEmpty()) return null;
		Map co = (Map)configObj.flatten();
		
		
		String baseKey = "smartsfs.audittrail." + defaultName;
		if(getMap(configObj, baseKey) == null){
			return null;
		}
		FieldProps newField = new FieldProps();
		newField.name = (String)co.get(baseKey + ".field");
		if(newField.name == null){
			return null;//vynechame field ak nie je v configu
//			newField.name = defaultName;
		}
		String className = (String)co.get(baseKey + ".type");
		if(className == null || className==""){
			className = defaultType;
		}
		try {
			newField.type = Class.forName(className);
		}catch (ClassNotFoundException e) {
			throw new RuntimeException("Class " + className + " could not be found for audittrail setting " + defaultName);
		}
		if(!co.containsKey(baseKey+ ".constraints") ){
		 	newField.constraints = defaultCons;
		}else{
		 	newField.constraints = (String)co.get(baseKey+ ".constraints");
		}
		if(co.containsKey(baseKey+ ".mapping") ){
		    newField.mapping = (String)co.get(baseKey + ".mapping");
		}
		
		return newField;
    } 

	public static Map<String, FieldProps> buildFieldMap(ConfigObject config){
		Map<String, FieldProps> map = new HashMap<String, FieldProps>();
		map.put(CREATED_BY_KEY,FieldProps.init(CREATED_BY_KEY,"java.lang.Long",USER_CONS,null,config));
		map.put(EDITED_BY_KEY,FieldProps.init(EDITED_BY_KEY,"java.lang.Long",USER_CONS,null,config));

		map.put(EDITED_DATE_KEY,FieldProps.init(EDITED_DATE_KEY,"java.util.Date",DATE_CONS,null,config));
		map.put(CREATED_DATE_KEY,FieldProps.init(CREATED_DATE_KEY,"java.util.Date",DATE_CONS,null,config));
		
		map.put(CR_CUSTOM1_KEY,FieldProps.init(CR_CUSTOM1_KEY,"java.lang.String",CUST_CONS,null,config));
		map.put(CR_CUSTOM2_KEY,FieldProps.init(CR_CUSTOM2_KEY,"java.lang.String",CUST_CONS,null,config));
		map.put(ED_CUSTOM1_KEY,FieldProps.init(ED_CUSTOM1_KEY,"java.lang.String",CUST_CONS,null,config));
		map.put(ED_CUSTOM2_KEY,FieldProps.init(ED_CUSTOM2_KEY,"java.lang.String",CUST_CONS,null,config));

		return map;
	}
	
	static public Object getMap(Map configMap, String keypath) {
		String keys[] = keypath.split("\\.");
		Map map = configMap;
		for(String key : keys){
			Object val = map.get(key);
			if(val !=null){
				//System.out.println("got a key for are " +key);
				if(val instanceof Map){
					map = (Map)map.get(key);
				} else{
					return val;
				}
			}else{
				return null;
			}
		}
		return map;	
	}
}