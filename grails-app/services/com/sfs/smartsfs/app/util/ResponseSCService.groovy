package com.sfs.smartsfs.app.util

import grails.converters.JSON
import grails.validation.ValidationErrors

import org.codehaus.groovy.grails.commons.GrailsDomainClassProperty
import org.codehaus.groovy.grails.web.json.JSONObject
import org.hibernate.criterion.AggregateProjection
import org.hibernate.criterion.CountProjection
import org.hibernate.criterion.Criterion
import org.hibernate.criterion.Projections
import org.springframework.context.i18n.LocaleContextHolder as LCH

import com.sfs.smartsfs.isc.CriteriaAggregator

class ResponseSCService {

	def sessionFactory
	def grailsApplication
	def messageSource


	public getAsList(Collection orig){
		return orig
	}
	public getAsList(String[] orig){
		return orig
	}
	public getAsList(orig){
		return [orig]
	}

	public parseAsJson(JSONObject orig){
		return orig
	}
	public parseAsJson(orig){
		return JSON.parse(orig)
	}

	def uploadResponse(status,data,def errors = null){
		JSONObject upResponse = new JSONObject()
		upResponse["response"]=[status:status,data:data,errors:errors]
		return upResponse as JSON
	}


	/**
	 * response pre SC grid
	 * @param claz domain class name
	 * @param params controller params
	 * @param plusCrit hibernate SQL custom criterion
	 * @param domSesFactory pre multiple datasources sessin factory fazula pre dom class (postfix datasource) 
	 * @return filtrovany list pre SC
	 */
	def gridResponse(claz,params,plusCrit=null,domSesFactory=null) {

		CriteriaAggregator critBuilder = getCriteriaBuilder(claz,params,plusCrit,domSesFactory)

		Integer startRow = Integer.valueOf( params._startRow?:0)
		Integer endRow = Integer.valueOf( params._endRow?:0)
		Integer maxRows = endRow - startRow
		String operator = params.operator?:"and"
		def outList
		def totalRows

		if(params[critBuilder.getClassIndentifier()]){
			outList=critBuilder.get(params[critBuilder.getClassIndentifier()])
			totalRows = 1
		}else{
			outList=critBuilder.list(maxRows,startRow)
			if(endRow==0){
				maxRows=outList.size()
				endRow=maxRows
				totalRows=maxRows
			}else
				totalRows = outList.size()<maxRows?startRow+outList.size():endRow+maxRows
		}

		endRow = totalRows<endRow?totalRows:endRow
		return [status:0,data:outList,startRow:startRow,endRow:endRow,totalRows:totalRows]
	}

	/*
	 * response pre SC grid
	 * @param claz domain class name
	 * @param params controller params
	 * @param plusCrit hibernate SQL custom criterion
	 * @param domSesFactory pre multiple datasources sessin factory fazula pre dom class (postfix datasource)
	 * @return filtrovany list pre SC
	 */
	def gridSummaryResponse(claz,params,summaryFields=[],plusCrit=null,domSesFactory=null) {

		CriteriaAggregator critBuilder = getCriteriaBuilder(claz,params,plusCrit,domSesFactory,false)

		Integer startRow = Integer.valueOf( params._startRow?:0)
		Integer endRow = Integer.valueOf( params._endRow?:75)
		Integer maxRows = endRow - startRow
		String operator = params.operator?:"and"
		def outList
		def totalRows
		
		def forClass = claz;
		def domClass = grailsApplication.getDomainClass(forClass.getName())

		def properties = summaryFields?:(domClass.getPersistentProperties().findAll{it.getTypePropertyName().equalsIgnoreCase("bigDecimal")}*.getName());

		def agrFieldList = new HashMap<String,String>();
		def projections = new Projections()
		def projectionList = projections.projectionList()

		//count do ID
		projectionList.add(projections.alias(new CountProjection(domClass.getIdentifier().getName()),domClass.getIdentifier().getName()))
		//sum za kazdy bigDecimal
		properties.each{property->
			projectionList.add(projections.alias(new AggregateProjection("sum",property),property))
		}

		critBuilder.addProjections(projectionList);
		//Bude len jeden
		outList=critBuilder.list(maxRows,startRow);
		totalRows = 1

		endRow = totalRows<endRow?totalRows:endRow
		return [status:0,data:outList,startRow:startRow,endRow:endRow,totalRows:totalRows]
	}

	def getSqlWhereCondition(claz,params,plusCrit=null,domSesFactory=null) {
		CriteriaAggregator critBuilder = getCriteriaBuilder(claz,params,plusCrit,domSesFactory)
		return critBuilder.getSqlWhere()
	}

	/**
	 * criteria SC
	 * @param claz domain class name
	 * @param params controller params
	 * @param plusCrit hibernate SQL custom criterion
	 * @param domSesFactory pre multiple datasources sessin factory fazula pre dom class (postfix datasource)
	 * @param withSort boolean aj so sortBy
	 * @return criteria 
	 */
	def getCriteriaBuilder(claz,params,plusCrit=null,domSesFactory=null,withSort=true) {
		log.debug "params: ${params}"

		CriteriaAggregator critBuilder = new CriteriaAggregator(claz,grailsApplication,domSesFactory?:sessionFactory)

		String operator = params.operator?:"and"

		JSONObject criteria = new JSONObject()
		if(params.criteria){
			criteria["operator"]=operator
			criteria["criteria"]=critBuilder.getAsList(params.criteria)
			critBuilder.parseISCCriteria(criteria)
		}

		if(plusCrit!=null&&plusCrit instanceof Criterion) critBuilder.addCustomCrit(plusCrit)

		if (withSort) {
			def sortIndex = params._sortBy?:critBuilder.getClassIndentifier()
			// toto je len vymysel aby nerobil order by vobec. Ale neda sa potom triedit nijako
			// napr v controllery dat do params._sortBy = "#unsorted#"
			if (sortIndex != "#unsorted#") {
				sortIndex=critBuilder.getAsList(sortIndex)
				sortIndex.each {i->
					log.debug "order by ${i}"
					//nesortuj cez transient
					if(!i.startsWith("_")&&!i.startsWith("-_")){
						if(i.startsWith("-")){
							critBuilder.addOrder(i.substring(1),"desc")
						}else{
							critBuilder.addOrder(i,"asc")
						}
					}
				}
				if(params._sortBy) critBuilder.addOrder(critBuilder.getClassIndentifier(),"asc")
			}
		}
		return critBuilder
	}
	
	def handleValidationErrors(ValidationErrors errors,String fieldPrefix = null){
		def erm =[:]
		log.debug "Validation errors local:"+LCH.getLocale()
		errors.allErrors.each {e->
			println(messageSource.getMessage(e,null))
			def fldName = fieldPrefix?(fieldPrefix+e.field):e.field
			erm[fldName]=messageSource.getMessage(e,null)
		}
		return erm
	}
}
