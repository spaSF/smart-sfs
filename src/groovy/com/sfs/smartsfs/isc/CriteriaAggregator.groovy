package com.sfs.smartsfs.isc

import grails.converters.JSON

import java.sql.Timestamp
import java.text.SimpleDateFormat

import javax.xml.bind.DatatypeConverter

import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.web.json.JSONObject
import org.hibernate.criterion.Criterion
import org.hibernate.criterion.Order
import org.hibernate.criterion.ProjectionList
import org.hibernate.criterion.Restrictions
import org.hibernate.internal.CriteriaImpl
import org.hibernate.loader.criteria.CriteriaQueryTranslator
import org.hibernate.transform.Transformers

class CriteriaAggregator {
	private Class forClass
	private GrailsDomainClass dom
	private CriteriaImpl criteriaBuilder
	def aliasList = [:]
	def transientFilter = [:]

	def grailsApplication
	def sessionFactory

	def defaultDateConverter

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

	// forClass should be a Grails DomainClass; but since Grails injects rather than inherits I can't specify the type better than "Class"
	public CriteriaAggregator(Class forClass,grailsApp,sessFak) {
		this.grailsApplication=grailsApp
		this.sessionFactory=sessFak
		this.forClass = forClass;
		this.defaultDateConverter = grailsApplication.mainContext.getBean('defaultDateConverter')
		this.dom= grailsApplication.getDomainClass(forClass.getName())
		assert dom != null,"Nenasiel domainClass"
		def session = sessionFactory.currentSession
		criteriaBuilder = session.createCriteria(forClass)
	}

	public String getClassIndentifier(){
      def ident=this.dom.getIdentifier().getName()
      this.dom.getPersistentProperties()?.find{
         it.identity==true
      }?.getName()?:this.dom.getIdentifier().getName()
	}
	public void parseISCCriteria(JSONObject critObj){
		switchOper(critObj,criteriaBuilder)
	}

	public void addCustomCrit(Criterion crit){
		criteriaBuilder.add(crit)
	}

	public String getSqlWhere(){
		CriteriaQueryTranslator innerQuery = new CriteriaQueryTranslator(
				this.sessionFactory,
				this.criteriaBuilder,
				this.forClass.name,
				"a"
				);

		def sql = innerQuery.getWhereCondition()
		if (sql.length() > 0) {
			def parameters = innerQuery.getQueryParameters().getPositionalParameterValues();

			if (parameters != null && parameters.length > 0) {
				for (Object val : parameters) {
					String value = "%";
					if (val instanceof Boolean) {
						value = ((Boolean) val) ? "1" : "0";
					} else if (val instanceof String) {
						value = "'" + val + "'";
					} else if (val instanceof Number) {
						value = val.toString();
					} else if (val instanceof Class) {
						value = "'" + ((Class) val).getCanonicalName() + "'";
					} else if (val instanceof Date) {
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						value = "to_date('" + sdf.format((Date) val) + "','yyyy-MM-dd HH24:mi:ss')";
					} else if (val instanceof Enum) {
						value = "" + ((Enum) val).ordinal();
					} else if (val instanceof Object) {
						value = val.id.toString();
					} else {
						value = val.toString();
					}
					sql = sql.replaceFirst("\\?", value);
				}
			}
		}
		println sql
		return sql
	}

	public void addOrder(String propName,String ord){
		if(propName&&propName!="null"){
			if(propName.contains('.')){
				propName.split("\\.").with {
					//id field asociacie vie hibernate selectovat priamo ce FK
					if(it[1]!="id"){
						if(!this.aliasList.containsKey(it[0])){
							this.aliasList[it[0]]=it[0].concat("Alias")
							criteriaBuilder.createAlias(it[0],this.aliasList[it[0]])
						}
						propName=this.aliasList[it[0]].toString().concat(".").concat(it[1])
					}
				}
			}
			criteriaBuilder.addOrder(ord=="asc"?Order.asc(propName):Order.desc(propName))
		}
	}

	/**
	 * dodatocny filter na transientne properties
	 * zatial iba pre "equals"
	 * @param resList result buildera
	 * @param hasMore ak je size==max, tak asi ma aj dalsie riadky
	 * @param max pozadovany max
	 * @param offset aktualny offset
	 * @return result list prefiltrovany podmienkou na transient fields
	 */
	private def handleTransients(resList,hasMore,max,offset){
		if(this.transientFilter){
			def bkpSize = resList.size()
			this.transientFilter.each {key,val->
				resList = resList.findAll {(it[key]==val)}
			}
			if(resList.size()<max && hasMore){
				//dopln do max
				def addOffset = offset+bkpSize
				def addMax = max-resList.size()
				resList.addAll(criteriaBuilder.setFirstResult(addOffset).setMaxResults(addMax).list())
				return handleTransients(resList,resList.size()==max,max,addOffset)
			}else return resList
		}else return resList

	}

	public def list(max,offset) {
		if(max>0){
			def resultList = criteriaBuilder.setFirstResult(offset).setMaxResults(max).list()
			return handleTransients(resultList,resultList.size()==max, max, offset)
		}else return criteriaBuilder.setFirstResult(offset).list()
	}

	public def get(id){
		fieldCrit(parseAsJson("{'fieldName':'${getClassIndentifier()}', 'value':'${id}','operator':'equals'}"),criteriaBuilder )
		list(1,0)
	}

	def getFilterValue(domProperty,value){
		Object filterByValue

		try {
			switch (domProperty.getType() ) {
				case String:
					filterByValue=value
					break
				case int:
					filterByValue=DatatypeConverter.parseInt(value)
					break
				case Double:
					filterByValue=Double.valueOf(value)
					break
				case Float:
					filterByValue=Float.valueOf(value)
					break
				case float:
					filterByValue=DatatypeConverter.parseFloat(value)
					break
				case Integer:
					filterByValue=Integer.valueOf(value)
					break
				case BigDecimal:
					filterByValue=DatatypeConverter.parseDecimal( value)
					break
				case Long:
					filterByValue=Long.valueOf(value)
					break
				case Timestamp:
					Calendar cl  = DatatypeConverter.parseDateTime(value)
					filterByValue=new Timestamp(cl.getTimeInMillis())
					break
				case Date:
				//					Calendar cl  = DatatypeConverter.parseDate(value)
				//					filterByValue=new Date(cl.getTimeInMillis())
					filterByValue=(Date)defaultDateConverter.convert(value)
					break
				case Boolean:
				case boolean:
					filterByValue=new Boolean(value)
					break
				default:
					break
			}
			if (!filterByValue && domProperty.getType().isEnum() ){
				filterByValue= domProperty.getType().valueOf(value)
			}
			if((domProperty.manyToOne || domProperty.oneToOne)&& !filterByValue && value){
				filterByValue = domProperty.getReferencedDomainClass().clazz.findById(value)
			}

		} catch (Exception e) {
			e.printStackTrace()
			filterByValue=null
		}
		return filterByValue
	}

	def fieldCrit(crit,actualC){
		def col = dom.getPropertyByName(crit.fieldName)
		assert col!=null,"Nenasiel property stlpca ${crit.fieldName}"
		Object filterData
		Object intEnd
		String operField

		try {
			operField = crit.fieldName
			if(String.valueOf(operField).startsWith("_")){
				if(crit.operator=="equals")	this.transientFilter[crit["fieldName"]]=getFilterValue(col,crit["value"])
				return //ignore transients
			}

			//ak pride fieldName s bodkou, t.j. property asociacie, urob alias
			if(operField.contains('.')){
				operField.split("\\.").with {
					//id field asociacie vie hibernate selectovat priamo ce FK
					if(it[1]!="id"){
						if(!this.aliasList.containsKey(it[0])){
							this.aliasList[it[0]]=it[0].concat("Alias")
							criteriaBuilder.createAlias(it[0],this.aliasList[it[0]])
						}
						operField=this.aliasList[it[0]].toString().concat(".").concat(it[1])
					}
				}
			}
			println "${crit.operator} ${crit.fieldName}"

			switch (crit.operator){
				case "equals":
					actualC.add(Restrictions.eq(operField,getFilterValue(col,crit["value"])))
					break;
				case "iEquals":
					actualC.add(Restrictions.ilike(operField,getFilterValue(col,crit["value"])))
					break;
				case "notEqual":
					actualC.add(Restrictions.not(Restrictions.eq(operField, getFilterValue(col,crit["value"]))))
					break;
				case "iNotEqual":
					actualC.add(Restrictions.not(Restrictions.ilike(operField,getFilterValue(col,crit["value"]))))
					break;
				case "startsWith":
					actualC.add(Restrictions.like (operField,String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%"))
					break;
				case "notStartsWith":
					actualC.add(Restrictions.not(Restrictions.like (operField,String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%")))
					break;
				case "iNotStartsWith":
					actualC.add(Restrictions.not(Restrictions.ilike (operField,String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%")))
					break;
				case "iStartsWith":
					actualC.add(Restrictions.ilike (operField,String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%"))
					break;
				case "iEndsWith":
					actualC.add(Restrictions.ilike(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')))
					break;
				case "endsWith":
					actualC.add(Restrictions.like(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')))
					break;
				case "notEndsWith":
					actualC.add(Restrictions.not(Restrictions.like(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_'))))
					break;
				case "iNotEndsWith":
					actualC.add(Restrictions.not(Restrictions.ilike(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_'))))
					break;
				case "iContains":
					actualC.add(Restrictions.ilike(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%"))
					break;
				case "iContainsPattern":
					actualC.add(Restrictions.ilike(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%"))
					break;
				case "contains":
					actualC.add(Restrictions.like(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%"))
					break;
				case "notContains":
					actualC.add(Restrictions.not(Restrictions.like(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%")))
					break;
				case "iNotContains":
					actualC.add(Restrictions.not(Restrictions.ilike(operField,"%"+String.valueOf(getFilterValue(col,crit["value"])).replace('*', '%').replace('?', '_')+"%")))
					break;
				case "greaterThan":
					actualC.add(Restrictions.gt(operField,getFilterValue(col,crit["value"])))
					break;
				case "greaterOrEqual":
					actualC.add(Restrictions.ge(operField,getFilterValue(col,crit["value"])))
					break;
				case "lessOrEqual":
					actualC.add(Restrictions.le(operField,getFilterValue(col,crit["value"])))
					break;
				case "lessThan":
					actualC.add(Restrictions.lt(operField,getFilterValue(col,crit["value"])))
					break;
				case "between":
					actualC.add(Restrictions.gt(operField,getFilterValue(col,crit["start"])))
					actualC.add(Restrictions.lt(operField,getFilterValue(col,crit["end"])))
					break
				case "iBetweenInclusive":
				case "betweenInclusive":
					actualC.add(Restrictions.between(operField, getFilterValue(col,crit["start"]), getFilterValue(col,crit["end"])))
					break
				case "notNull":
					actualC.add(Restrictions.isNotNull(operField))
					break;
				case "isNull":
					actualC.add(Restrictions.isNull(operField))
					break;
				default:
					break
			}
		} catch (Exception e) {
			log.debug "Ignore exception:"+e.getMessage()
			//aby nevratil nic dame ze id je null
			actualC.add(Restrictions.isNull(this.getClassIndentifier()))
		}
	}

	def addCriteria(critObj,toRestriction){
		//		println "pridaj ${critObj}"
		critObj.each { crit ->
			switchOper(crit,toRestriction)
		}
	}


	def switchOper(critObj,actualC){
		JSONObject crit = parseAsJson(critObj)
		def restr

		if(crit.has("operator")){
			switch(crit.operator?:""){
				case "and":
					restr = Restrictions.conjunction()
					addCriteria(crit.criteria,restr)
					actualC.add(restr)
					break;
				case "or":
					restr = Restrictions.disjunction()
					addCriteria(crit.criteria,restr)
					actualC.add(restr)
					break;
				case "not":
					restr = Restrictions.conjunction()
					addCriteria(crit.criteria,restr)
					actualC.add(Restrictions.not(restr))
					break;
				default:
					fieldCrit(crit,actualC)
					break;
			}
		}
	}

	void addProjections(ProjectionList projections) {
		projections.each { i ->
			this.criteriaBuilder.setProjection(i)
		}
		this.criteriaBuilder.setResultTransformer(Transformers.aliasToBean(this.forClass));
	}
}
