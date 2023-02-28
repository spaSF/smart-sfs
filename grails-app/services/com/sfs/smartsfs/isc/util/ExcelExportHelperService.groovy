package com.sfs.smartsfs.isc.util

import grails.converters.JSON
import grails.transaction.Transactional
import groovy.json.JsonSlurper

import java.awt.Color
import java.nio.charset.Charset
import java.sql.Timestamp

import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.apache.commons.csv.QuoteMode
import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.CellStyle
import org.apache.poi.ss.usermodel.Font
import org.apache.poi.ss.util.CellRangeAddress
import org.apache.poi.xssf.streaming.SXSSFCell
import org.apache.poi.xssf.streaming.SXSSFRow
import org.apache.poi.xssf.streaming.SXSSFWorkbook
import org.apache.poi.xssf.usermodel.XSSFColor
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject
import org.codehaus.groovy.runtime.NullObject
import org.springframework.context.i18n.LocaleContextHolder

import com.sfs.smartsfs.excel.export.Formatters
import com.sfs.smartsfs.excel.export.SXlsxExporter
import com.sfs.smartsfs.excel.export.abilities.RowManipulationAbility
import com.sfs.smartsfs.excel.export.abilities.SCellManipulationAbility
import com.sfs.smartsfs.excel.export.getters.Getter
import com.sfs.smartsfs.excel.export.getters.PropertyGetter
import com.sfs.smartsfs.excel.export.multisheet.SAdditionalSheet
import com.sfs.smartsfs.isc.SmartSource
import com.sfs.smartsfs.isc.SmartSourceField
import com.sfs.smartsfs.isc.SmartUserSettings
import com.sfs.smartsfs.sec.User

@Transactional
class ExcelExportHelperService {

	def sessionFactory
	def messageSource
	def springSecurityService
	def configHolderService
	def responseSCService
	def grailsApplication

	static final String MSG_PREFIX = "smartsfs.sc.operators_"
	static final String MSG_POSTFIX = "Title"
	static final handledPropertyTypes = [String, Getter, Date, Boolean, Timestamp, NullObject, Long, Integer, BigDecimal, BigInteger, Byte, Double, Float, Short]

	Object getPropertyToBeInserted(Object property){
		property = property == null ? "" : property
		if(!RowManipulationAbility.verifyPropertyTypeCanBeHandled(property)){
			property = property.toString()
		}
		return property
	}
	List<Object> getPropertiesFromObject(Object object, List<Getter> selectedProperties) {
		selectedProperties.collect { it.getFormattedValue(object) }
	}

	boolean verifyPropertyTypeCanBeHandled(Object property) {
		if(!(handledPropertyTypes.find {it.isAssignableFrom(property.getClass())} )) {
			return false
		} else {
			return true
		}
	}

	Integer getMaxSheetRows(){
		return Integer.valueOf(configHolderService.getValueForKey("smartsfs.xlsexport.sheetrows")?:1048000)
	}
	def getAsList(Collection orig){
		return orig
	}
	def getAsList(String[] orig){
		return orig
	}
	def getAsList(orig){
		return [orig]
	}

	def parseAsJson(JSONObject orig){
		return orig
	}
	def parseAsJson(orig){
		return JSON.parse(orig)
	}

	String getFieldTitle(SmartSourceField field){
		String msg
		if(field){
			msg=extractIscLocalCode(field.getTitle())?:field.name
		}
		return msg
	}
	String getFieldTitle(String field,SmartSource datasource){
		return getFieldTitle(datasource.getFields()?.find {it.name==field})?:field
	}

	def getCritDisplayValue(String fieldName,value,SmartSource datasource){
		SmartSourceField fld =datasource.getFields()?.find {it.name==fieldName}
		String dispVal
		Object idVal
		if(fld){
			try {
				if(fld.optionDataSource&&fld.valueField=="id"&&(fld.displayField||fld.foreignDisplayField)){
					def dom= grailsApplication.domainClasses.find {
						it.clazz.simpleName == fld.optionDataSource
					}
					def idProp = dom.getPropertyByName(fld.valueField)
					switch (idProp.getType() ) {
						case String:
							idVal=value.toString()
							break
						case Integer:
							idVal=Integer.valueOf(value)
							break
						case Long:
							idVal=Long.valueOf(value)
							break
					}
					if(idVal){
						def obj = dom?.getClazz()?.findById(idVal)
						dispVal = obj[fld.foreignDisplayField?:fld.displayField]
					}
				}
			} catch (Exception e) {
				e.printStackTrace()
				dispVal = null
			}
		}
		return dispVal?:value
	}
	def fieldCrit(crit,actualC,datasource){
		String fieldTitle = getFieldTitle(crit.fieldName,datasource)
		String operatorTitle = messageSource.getMessage("${MSG_PREFIX}${crit.operator}${MSG_POSTFIX}",null,LocaleContextHolder.getLocale())
		String fldCrit = "${fieldTitle} ${operatorTitle}"

		switch (crit.operator){
			case "between":
			case "iBetweenInclusive":
			case "betweenInclusive":
				fldCrit=fldCrit+" [${crit.start}] - [${crit.end}]"
				break
			case "notNull":
			case "isNull":
				break
			default:
				fldCrit=fldCrit+" [${getCritDisplayValue(crit.fieldName,crit.value,datasource)}]"
				break
		}
		actualC.add(fldCrit)
	}

	def addCriteria(critObj,toRestriction,SmartSource datasource){
		//		println "pridaj ${critObj}"
		critObj.each { crit ->
			switchOper(crit,toRestriction,datasource)
		}
	}


	def switchOper(critObj,actualC,SmartSource datasource){
		JSONObject crit = parseAsJson(critObj)
		JSONObject restr = new JSONObject()

		if(crit.has("operator")){
			switch(crit.operator?:""){
				case "and":
					restr["operator"] = messageSource.getMessage("${MSG_PREFIX}and${MSG_POSTFIX}",null,LocaleContextHolder.getLocale())
					restr["criteria"] = new JSONArray()
					addCriteria(crit.criteria,restr.criteria,datasource)
					actualC.add(restr)
					break;
				case "or":
					restr["operator"] = messageSource.getMessage("${MSG_PREFIX}or${MSG_POSTFIX}",null,LocaleContextHolder.getLocale())
					restr["criteria"] = new JSONArray()
					addCriteria(crit.criteria,restr.criteria,datasource)
					actualC.add(restr)
					break;
				case "not":
					restr["operator"] = messageSource.getMessage("${MSG_PREFIX}not${MSG_POSTFIX}",null,LocaleContextHolder.getLocale())
					restr["criteria"] = new JSONArray()
					addCriteria(crit.criteria,restr.criteria,datasource)
					actualC.add(restr)
					break;
				default:
					fieldCrit(crit,actualC,datasource)
					break;
			}
		}
	}

	String prittyOutput(JSONArray crit,offset){
		String out=""
		crit.each {criteria->
			if(criteria instanceof String){
				out=out+"\n${offset}${criteria}"
			}else{
				if(criteria.has("operator"))
					out=out+"\n${offset}${criteria.operator}(" + prittyOutput(criteria.criteria,offset+offset) + "\n${offset+offset})"
			}
		}
		return out
	}

	List getUserSettingsFields(SmartUserSettings uSet){
		def fields=[]
		if(uSet){
			def jsUs=parseAsJson(uSet.settingObject)
			jsUs.each {obj->
				if(obj["fields"]){
					obj.fields?.each {fld->
						fields.add(fld["name"])
					}
				}
			}
		}
		return fields
	}

	def getEnumValuesMap(String enumMapProp){
		def enumMap
		if(enumMapProp.contains("{")){
			enumMap= new JsonSlurper().parseText(enumMapProp)
		}
		else{
			enumMap= [:]
			enumMapProp.split(",").each { enumMap[it]= it }
		}
		enumMap.each {
			it.value = extractIscLocalCode(it.value)
		}
		return enumMap
	}

	def getFieldToProps(SmartSourceField fld,Boolean impCompatible=false){
		String propName
		if(fld.valueXPath){
			if((fld.foreignDisplayField||fld.displayField)&&(fld.optionDataSource||fld.foreignKey)){
				propName=fld.foreignDisplayField?:fld.displayField
				if(!propName.contains('.')){
					if(fld.valueXPath.contains("/")){
						fld.valueXPath.split("/").with {
							propName=it[0].toString().concat(".").concat((fld.foreignDisplayField?:fld.displayField))
						}
					}else{
						if(fld.displayField&&fld.foreignDisplayField&&fld.displayField!= fld.foreignDisplayField){
							//display field from record - find it
							String propXpath=fld.dSource.getFields().find {it.name==fld.displayField}?.valueXPath
							propName=propXpath?(propXpath.replaceAll("/",".")):fld.valueXPath
						}
					}
				}
			}else{
				fld.valueXPath.split("/").with {
					propName=it[0].toString().concat(".").concat(it[1])
				}
			}
		}else{
			if(fld.displayField&&fld.foreignDisplayField&&fld.displayField!= fld.foreignDisplayField){
				//display field from record - find it
				SmartSourceField recordField=fld.dSource.getFields().find {it.name==fld.displayField}
				propName=recordField.valueXPath?(recordField.valueXPath.replaceAll("/",".")):recordField.name
			}else propName=fld.name
		}
		switch(fld.type){
			case "date":
				String dfmt=messageSource.getMessage("smartsfs.sc.date_normalDateFormat",null,LocaleContextHolder.getLocale())?:"dd.MM.yyyy"
				if(dfmt.contains("toEuropean"))dfmt="dd.MM.yyyy"
				return new DateGetter(propName,dfmt)
				break
			case "datetime":
				String dfmt=messageSource.getMessage("smartsfs.sc.date_normalDatetimeFormat",null,LocaleContextHolder.getLocale())?:"dd.MM.yyyy HH:mm:ss"
				return new DateGetter(propName,dfmt)
				break
			case "boolean":
				if(impCompatible)return propName
				else{
				String trueText=messageSource.getMessage("smartsfs.excel.boolean.true",null,LocaleContextHolder.getLocale())?:"Yes"
				String falseText=messageSource.getMessage("smartsfs.excel.boolean.false",null,LocaleContextHolder.getLocale())?:"No"
				return new BooleanGetter(propName,trueText,falseText)
				}
				break
			case "enum":
				return new EnumGetter(fld.name,getEnumValuesMap(fld.valueMap))
			default:
				return propName
		}
	}
	/**
	 * extract message code from isc i18n property
	 * @param iscMsg
	 * @return message code or null
	 */
	public String extractIscLocalCode(String iscMsg){
		String msg
		if(iscMsg&&iscMsg.contains("i18n")){
			String splitter = iscMsg.contains("\"")?"\"":"'"
			iscMsg.split(splitter).eachWithIndex {part,idx->
				if(idx==1) {
					try {
						msg=messageSource.getMessage(part,null,LocaleContextHolder.getLocale())
					} catch (Exception e) {
						msg=null
					}
				}
			}
		}else if(iscMsg) msg=iscMsg
		return msg
	}

	/**
	 * resolve header for datasource grid fields defined by user settings
	 * @param datasource
	 * @return header as list of column titles in locale
	 */
	public List resolveHeader(SmartSource datasource,usrFields){
		def headerList = []
		if(usrFields){
			usrFields?.each {fldName->
				SmartSourceField fld=datasource?.getFields()?.find{it.name==fldName}
				if(fld){
					headerList.add(getFieldTitle(fld))
				}
			}
		}else{
			headerList=resolveHeader(datasource)
		}
		return headerList

	}
	/**
	 * resolve header for ALL datasource grid fields
	 * @param datasource
	 * @return header as list of column titles in locale
	 */
	public List resolveHeader(SmartSource datasource,Boolean impCompatible = false){
		def headerList = []

		datasource?.getFields()?.each {SmartSourceField fld->
			if(impCompatible&&!(fld.optionDataSource&&!fld.valueField)){
				headerList.add(fld.name)
			}else if(!fld.hidden&&!fld.detail){
				headerList.add(getFieldTitle(fld))
			}
		}
		return headerList
	}
	/**
	 * resolve columns and types for datasource grid fields defined by user settings
	 * @param datasource
	 * @return list of columns or property getters
	 */
	public List resolveColumns(SmartSource datasource,List usrFields){
		def columnList = []
		if(usrFields){
			usrFields.each {fldName->

				SmartSourceField fld=	datasource?.getFields()?.find{it.name==fldName}
				if(fld){
					columnList.add(getFieldToProps(fld))
				}
			}
		}else{
			columnList=resolveColumns(datasource)
		}
		return columnList

	}
	/**
	 * resolve columns and types for ALL datasource grid fields
	 * @param datasource
	 * @return list of columns or property getters
	 */
	public List resolveColumns(SmartSource datasource,Boolean impCompatible = false){
		def columnList = []
		datasource?.getFields()?.each {SmartSourceField fld->
			if(!fld.hidden&&!fld.detail||impCompatible&&!(fld.optionDataSource&&!fld.valueField)){
				columnList.add(getFieldToProps(fld,impCompatible))
			}
		}
		return columnList

	}
	/**
	 * translate advanced criteria to locale
	 * @param criteria
	 * @param datasource
	 * @return pritty string output
	 */
	public String translateCriteria(criteria,SmartSource datasource) {
		JSONArray translated=new JSONArray()
		switchOper(criteria, translated,datasource)
		return prittyOutput(translated,"   ").trim()
	}

	public class BooleanGetter extends PropertyGetter<Boolean, String> { // From Boolean, to String
		private String trueText
		private String falseText
		BooleanGetter(String propertyName,trueText,falseText) {
			super(propertyName)
			this.trueText=trueText
			this.falseText=falseText
		}

		@Override
		protected String format(Boolean value) {
			return value?trueText:falseText
		}
	}

	public class DateGetter extends PropertyGetter<Date, String> { // From Date, to String
		private String dfmt
		DateGetter(String propertyName,String dfmt) {
			super(propertyName)
			this.dfmt=dfmt
		}

		@Override
		protected String format(Date value) {
			return value?.format(this.dfmt)
		}
	}

	public class EnumGetter implements Getter<String> {
		protected String propertyName
		private def enumMap

		EnumGetter(String propertyName,enumMapProp){
			this.propertyName=propertyName
			this.enumMap=enumMapProp
		}
		String getPropertyName() {
			return propertyName
		}

		protected String format(Object value){
			if(value){
				if(this.enumMap)
					return this.enumMap[value.name()]?:value.toString()
				else
					return value.toString()
			}else
				return null

		}

		String getFormattedValue(Object object) {
			if ( object instanceof Map ) {
				return format( object[ propertyName ] )
			} else {
				if (!object.hasProperty(propertyName)) {
					return null
				}
				return format(object."$propertyName")
			}
		}
	}

	/**
	 * 
	 * @param colorStr e.g. "#FFFFFF"
	 * @return 
	 */
	public static Color hex2Rgb(String colorStr) {
		return new Color(
				Integer.valueOf( colorStr.substring( 1, 3 ), 16 ),
				Integer.valueOf( colorStr.substring( 3, 5 ), 16 ),
				Integer.valueOf( colorStr.substring( 5, 7 ), 16 ) );
	}

	/**
	 *
	 * @param wb - current SXSSFWorkbook
	 * @param type - Styled Cell e.p. "titleStyle"
	 * @return
	 */
	public CellStyle getStyle (SXSSFWorkbook wb, String type) {
		def lParam = configHolderService.getValueForKey("smartsfs.xlsexport.${type}").split(',')
		CellStyle style = wb.createCellStyle()
		Font font = wb.createFont();
		switch (type) {
			case "headerCellStyle":
				if (lParam.size() < 4) lParam = "Arial, 10, #FFFFFF, #0094CC".split(',')
				font.setBoldweight(Font.BOLDWEIGHT_BOLD);
				break
			case "titleStyle":
				if (lParam.size() < 4) lParam = "Calibri, 18, #000000, #FFFFFF".split(',')
				font.setBoldweight(Font.BOLDWEIGHT_BOLD);
				break
			case "profileStyle":
				if (lParam.size() < 4) lParam = "Arial, 10, #000000, #C5E0B4".split(',')
				break
			default:
				return style;
				break;
		}
		font.setFontName(lParam[0].trim());
		font.setFontHeightInPoints((short) Integer.parseInt(lParam[1].trim())  );
		font.setColor(new XSSFColor(hex2Rgb(lParam[2].trim())));
		style.setFont(font);
		if (type=="headerCellStyle") style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setFillForegroundColor( new XSSFColor(hex2Rgb(lParam[3].trim())));
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		return style
	}

	/**
	 *
	 * @param daysBack number Days Ago
	 */
	public void deleteOldFiles(int daysBack) {
		String tmpl = "${responseSCService.grailsApplication.mainContext.servletContext.getRealPath('/tmp')}"
		File directory = new File(tmpl);
		if(directory.exists()){
			File[] listFiles = directory.listFiles();
			long purgeTime = System.currentTimeMillis() - (daysBack * 24 * 60 * 60 * 1000);
			for(File listFile : listFiles) {
				if(listFile.lastModified() < purgeTime) {
					if(!listFile.delete()) {
						System.err.println("Unable to delete file: " + listFile);
					}
				}
			}
		}
	}

	public void setTitle(SAdditionalSheet sheet, def title=null, def userInfo=null, def transCrit=null, def critSize=null)	{
		// title
		sheet.putCellValue(0,0,title)
		sheet.getCellAt(0,0).setCellStyle(getStyle(sheet.sheet.getWorkbook(),"titleStyle"))
		SXSSFRow headerRow = SCellManipulationAbility.getOrCreateRow(0, sheet.sheet)
		def fondHeight = sheet.getCellAt(0,0).getCellStyle().getFont().getFontHeight()?:380
		headerRow.setHeight((short)((fondHeight+20)))
		//sheet.addMergedRegion(new CellRangeAddress(0,0,0,headers.size()-1))
		// userinfo
		sheet.putCellValue(1,0,userInfo)
		//sheet.addMergedRegion(new CellRangeAddress(1,1,0,headers.size()-1))
		// profil
		if(transCrit){
			sheet.putCellValue(2,0,"Aktívny profil")
			sheet.sheet.addMergedRegion(new CellRangeAddress(2,2,0,2))
			sheet.getCellAt(2,0).setCellStyle(getStyle(sheet.sheet.getWorkbook(),"profileStyle"))
			sheet.sheet.addMergedRegion(new CellRangeAddress(3,3,0,2))
			sheet.putCellValue(3,0,transCrit)
			def critCell = sheet.getCellAt(3,0)
			critCell.getRow().setHeightInPoints(critSize*15)
			CellStyle style = sheet.sheet.getWorkbook().createCellStyle(); //Create new style
			style.setWrapText(true); //Set wordwrap
			critCell.setCellStyle(style)

		}
	}

	/**
	 * create defalut excel file to output byte stream
	 * pouzitie v controlleri: render(file:excelExportHelperService.defaultReport(params)?.toByteArray(),fileName:"hocico.xlsx",contentType :"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	 * @param params	controller params > mast have datasource, may have criteria,user settings,classname
	 * @sessFactory		ak je z ineho ako default DB datasource, musi prist session factory datasourcu
	 * @plusCrit		dodatocne criteria pre responseService
	 * @return byte array excel
	 */
	public ByteArrayOutputStream defaultReport(params,sessFactory=null){
		deleteOldFiles(1);
		sessFactory=sessFactory?:sessionFactory

		Integer windSize = Integer.valueOf(configHolderService.getValueForKey("smartsfs.xlsexport.streamWindow")?:1000)
		Integer pSize = Integer.valueOf(configHolderService.getValueForKey("smartsfs.csvexport.pagesize")?:10000)
		Integer maxRows = Integer.valueOf(configHolderService.getValueForKey("sc.xlsexport.size")?:0)
		def sizes = [pSize:pSize,maxRows:(maxRows==0?pSize:maxRows),maxSheet:getMaxSheetRows()]
		Integer page=sizes.min {it.value}.value

		SmartSource ds = SmartSource.findWhere(ID:params.get("datasource"))
		String classSimpleName = params.get("classname")?:(ds.inheritsFrom?:ds.ID)
		JSONObject exportPars = new JSONObject()
		exportPars["_startRow"]=0
		exportPars["_endRow"]=page
		exportPars["operator"]=params.filter?responseSCService.parseAsJson(params.filter)["operator"]:"and"
		exportPars["criteria"]=params.filter?responseSCService.parseAsJson(params.filter)["criteria"]:null
		String transCrit=null
		def critSize
		if(exportPars["criteria"]){
			transCrit=translateCriteria(exportPars,ds)
			critSize = transCrit?.readLines()?.size()
		}
		String title = extractIscLocalCode(ds.getPluralTitle())?:ds.ID

		def ufields=[]
		if(params.get("userSettings")){
			SmartUserSettings uSet=SmartUserSettings.get(params.userSettings as Long)
			ufields=getUserSettingsFields(uSet)
			title=title + " (${uSet.name})"
		}
		def headers = resolveHeader(ds,ufields)
		def withProperties = resolveColumns(ds,ufields)

		def usr = (User)springSecurityService.getCurrentUser()
		String userFullName=usr.surname?(usr.name+ " " + usr.surname):usr.username
		String userInfo = messageSource.getMessage("smartsfs.excel.info",[(new Date()).format('dd.MM.yyyy HH:mm:ss'), userFullName].toArray(),LocaleContextHolder.getLocale())
		ByteArrayOutputStream exp = new ByteArrayOutputStream()
		String tmpFileName = Long.toString(new Date().toTimestamp().getTime())+".xlsx"
		String tmpl = "${responseSCService.grailsApplication.mainContext.servletContext.getRealPath('/tmp')}/${tmpFileName}"

		def domainClazz = responseSCService.grailsApplication.domainClasses.find{it.clazz.simpleName==classSimpleName}.clazz
		//vyber z DB v novej Hibernate session, aby sa mohla vycistit po kazdej stranke
		domainClazz.withNewSession{session->

			def respData = responseSCService.gridResponse(domainClazz,exportPars,null,sessFactory)
			List data = respData?.data

			//excel
			int sheetIdx=0
			Boolean columnSized = false
			new SXlsxExporter(tmpl,windSize).with {
				CellStyle headerCellStyle = getStyle(workbook,"headerCellStyle")
				Integer rowOffset=0
				sheet('Report').with{
					fillRowWithValues(headers,5)
					SXSSFRow headerRow = SCellManipulationAbility.getOrCreateRow(5, sheet)
					Iterator<Cell> cellIter = headerRow.cellIterator()
					while(cellIter.hasNext()){
						SXSSFCell headerCell = (SXSSFCell) cellIter.next()
						if(headerCell.getStringCellValue()) {
							getCellAt(5,headerCell.getColumnIndex()).setCellStyle(headerCellStyle)
							sheet.autoSizeColumn(headerCell.getColumnIndex())
						}
					}
					columnSized=false
					while (respData.totalRows>=respData.endRow&&data?.size()>0){
						data.eachWithIndex {datarow,index->
							add(datarow,withProperties,6+index+rowOffset)
							if(index==0&&!columnSized){
								headers.eachWithIndex {h,idx->
									sheet.autoSizeColumn(idx)
								}
								setTitle(it, title, userInfo, transCrit, critSize)
								columnSized=true
							}
						}
						log.debug "saved ${respData.endRow}"
						//uvolnenie pamate vycistenim session
						data.clear()
						session.clear()
						//garbage collector call
						System.gc()

						if(Integer.valueOf(exportPars["_endRow"])==sizes.maxSheet||Integer.valueOf(exportPars["_endRow"])==maxRows)
							break
						exportPars["_startRow"]=Integer.valueOf(exportPars["_endRow"])
						rowOffset=Integer.valueOf(exportPars["_startRow"])
						//posun o stranu
						sizes.pSize=Integer.valueOf(exportPars["_endRow"])+page
						if(maxRows==0) sizes.maxRows=sizes.pSize
						//endRow je minumum z aktual+page,max pre export,max do sheetu
						exportPars["_endRow"]=sizes.min {it.value}.value
						respData=responseSCService.gridResponse(domainClazz,exportPars,null,sessFactory)
						data=respData?.data
					}
					if (!columnSized) setTitle(it, title, userInfo, transCrit, critSize)
				}

				while (respData.totalRows>respData.endRow && maxRows>respData.endRow) {
					sheetIdx++
					columnSized = false
					rowOffset = 0
					exportPars["_startRow"]=Integer.valueOf(exportPars["_endRow"])
					//posun o stranu
					sizes.pSize=Integer.valueOf(exportPars["_endRow"])+page
					sizes.maxSheet=sizes.maxSheet+getMaxSheetRows()
					if(maxRows==0) sizes.maxRows=sizes.pSize
					//endRow je minumum z aktual+page,max pre export,max do sheetu
					exportPars["_endRow"]=sizes.min {it.value}.value
					//				exportPars["_endRow"]=(maxRows==0||maxRows>(Integer.valueOf(exportPars["_startRow"])+getMaxSheetRows()))?(Integer.valueOf(exportPars["_startRow"])+getMaxSheetRows()):maxRows
					respData=responseSCService.gridResponse(domainClazz,exportPars,null,sessFactory)
					data=respData?.data
					def sheetName="Report_${sheetIdx}"
					sheet(sheetName).with{newSheet->

						fillRowWithValues(headers,5)
						SXSSFRow headerRow = SCellManipulationAbility.getOrCreateRow(5, newSheet.sheet)
						Iterator<Cell> cellIter = headerRow.cellIterator()
						while(cellIter.hasNext()){
							SXSSFCell headerCell = (SXSSFCell) cellIter.next()
							if(headerCell.getStringCellValue()) {
								getCellAt(5,headerCell.getColumnIndex()).setCellStyle(headerCellStyle)
								newSheet.sheet.autoSizeColumn(headerCell.getColumnIndex())
							}
						}
						columnSized=false
						while (respData.totalRows>=respData.endRow&&data?.size()>0){
							data.eachWithIndex {datarow,index->
								add(datarow,withProperties,6+index+rowOffset)
								if(index==0&&!columnSized){
									headers.eachWithIndex {h,idx->
										getSheet().autoSizeColumn(idx)
									}
									setTitle(newSheet, title, userInfo, null, null)
									columnSized=true
								}
							}
							log.debug "saved ${respData.endRow}"
							data.clear()
							session.clear()
							System.gc()
							if(Integer.valueOf(exportPars["_endRow"])-(sheetIdx*getMaxSheetRows())==sizes.maxSheet||Integer.valueOf(exportPars["_endRow"])==maxRows)
								break
							exportPars["_startRow"]=Integer.valueOf(exportPars["_endRow"])
							rowOffset=Integer.valueOf(exportPars["_startRow"])-(sheetIdx*getMaxSheetRows())
							//posun o stranu
							sizes.pSize=Integer.valueOf(exportPars["_endRow"])+page
							if(maxRows==0) sizes.maxRows=sizes.pSize
							//endRow je minumum z aktual+page,max pre export,max do sheetu
							exportPars["_endRow"]=sizes.min {it.value}.value
							respData=responseSCService.gridResponse(domainClazz,exportPars,null,sessFactory)
							data=respData?.data
						}
						if (!columnSized) setTitle(newSheet, title, userInfo, null, null)
					}
				}

				save(exp)
			}
		}

		return exp
	}


	/**
	 * create defalut CSV file 
	 * pouzitie v controlleri: render(file:excelExportHelperService.defaultCSV(params),fileName:"hocico.csv",contentType :"text/csv")
	 * @param params	controller params > mast have datasource, may have criteria,user settings,classname
	 * @param sessFactory		ak je z ineho ako default DB datasource, musi prist session factory datasourcu
	 * @param plusCrit		dodatocne criteria pre responseService
	 * @param importCompatible = export format kompatibilny s importom
	 * @return CSV file
	 */
	public File defaultCSV(params,sessFactory=null,plusCrit=null){
		sessFactory=sessFactory?:sessionFactory
		//		Integer maxRows = Integer.valueOf(configHolderService.getValueForKey("sc.xlsexport.size")?:0)
		SmartSource ds = SmartSource.findWhere(ID:params.get("datasource"))
		String classSimpleName = params.get("classname")?:(ds.inheritsFrom?:ds.ID)
		Integer pageSize = Integer.valueOf(configHolderService.getValueForKey("smartsfs.csvexport.pagesize")?:10000)
		JSONObject exportPars = new JSONObject()
		exportPars["_startRow"]=0
		exportPars["_endRow"]=pageSize
		exportPars["operator"]=params.filter?responseSCService.parseAsJson(params.filter)["operator"]:"and"
		exportPars["criteria"]=params.filter?responseSCService.parseAsJson(params.filter)["criteria"]:null
		Boolean importCompatible = Boolean.valueOf(params.get("importCompatible"))
		def ufields=[]
		if(params.get("userSettings")){
			SmartUserSettings uSet=SmartUserSettings.get(params.userSettings as Long)
			ufields=getUserSettingsFields(uSet)
		}
		List<Object> headers
		List<Object> withProperties
		if(importCompatible){
			headers= resolveHeader(ds,importCompatible)
			withProperties = resolveColumns(ds,importCompatible)
		}else{
			headers = resolveHeader(ds,ufields)
			withProperties = resolveColumns(ds,ufields)
		}
		
		String tmpFilePath = configHolderService.getWebRootPath()+(configHolderService.getValueForKey("smartsfs.temp.directory")?:"tmp")
		String tmpFileName = "tmpCsv"+Long.toString(new Date().toTimestamp().getTime())+".csv"
		File tmpCsv = new File(tmpFilePath,tmpFileName)
		FileOutputStream tmpCsvWriter = new FileOutputStream(tmpCsv,true)
		CSVFormat fmt=CSVFormat.EXCEL.withDelimiter(';' as char).withQuoteMode(QuoteMode.NON_NUMERIC)
		CSVPrinter csvPrinter = new CSVPrinter(new OutputStreamWriter(tmpCsvWriter, Charset.forName(configHolderService.getValueForKey("smartsfs.csvexport.charset")?:"windows-1250").newEncoder() ), fmt)
		csvPrinter.printRecord(headers)
		csvPrinter.flush()

		def domainClazz = responseSCService.grailsApplication.domainClasses.find{it.clazz.simpleName==classSimpleName}.clazz
		//vyber z DB v novej Hibernate session, aby sa mohla vycistit po kazdej stranke
		domainClazz.withNewSession{session->

			def respData = responseSCService.gridResponse(domainClazz,exportPars,plusCrit,sessFactory)
			def data = respData?.data

			while (respData.totalRows>=respData.endRow&&data?.size()>0){

				data.eachWithIndex {rowObject,index->
					List<Object> properties = getPropertiesFromObject(rowObject, Formatters.convertSafelyToGetters(withProperties))
					csvPrinter.printRecord(properties)
				}
				csvPrinter.flush()
				log.debug "saved ${respData.endRow}"
				exportPars["_startRow"]=Integer.valueOf(exportPars["_endRow"])
				exportPars["_endRow"]=Integer.valueOf(exportPars["_startRow"])+pageSize
				data.clear()
				session.clear()
				System.gc()
				respData = responseSCService.gridResponse(domainClazz,exportPars,plusCrit,sessFactory)
				data = respData?.data

			}
		}
		csvPrinter.flush()
		csvPrinter.close()
		tmpCsvWriter.close()
		tmpCsv.deleteOnExit()
		return tmpCsv
	}

}
