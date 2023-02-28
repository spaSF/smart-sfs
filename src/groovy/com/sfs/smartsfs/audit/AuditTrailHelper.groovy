package com.sfs.smartsfs.audit

import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.beans.factory.InitializingBean
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware

class AuditTrailHelper implements ApplicationContextAware, InitializingBean {
   private static final Logger log = Logger.getLogger(AuditTrailInterceptor)

   Closure currentUserClosure
   Closure custom1Closure
   Closure custom2Closure
   Closure custom3Closure

   //injected
   GrailsApplication grailsApplication
   Map fieldPropsMap
   String companyIdField

   ApplicationContext applicationContext

   static Long ANONYMOUS_USER = 0

   void initializeFields(Object entity) {

      //if its not new then just exit as we will assume an updated entity is setup correctly
      if (!isNewEntity(entity)) return
         //exit fast if its off
      if (entity.hasProperty('disableAuditTrailStamp') && entity.disableAuditTrailStamp) return

      if (log.isDebugEnabled()) log.debug "initializeFields for new $entity"
      setFieldDefaults(entity)

   }

   void setFieldDefaults(Object entity) {
      Long time = System.currentTimeMillis()
      //assume its a new entity
      [
         FieldProps.CREATED_DATE_KEY,
         FieldProps.EDITED_DATE_KEY
      ].each { key ->
         setDateField(entity, key, time)
      }

      [
         FieldProps.CREATED_BY_KEY,
         FieldProps.EDITED_BY_KEY
      ].each { key ->
         setUserField(entity, key)
      }

      [
         FieldProps.CR_CUSTOM1_KEY,
         FieldProps.CR_CUSTOM2_KEY,
         FieldProps.ED_CUSTOM1_KEY,
         FieldProps.ED_CUSTOM2_KEY
      ].each { key ->
         setCustomField(entity, key)
      }

   }

   def setDateField(entity, String fieldName, time = System.currentTimeMillis()) {
      def field = fieldPropsMap.get(fieldName).name
      def property = entity.hasProperty(field)
      def valToSet
      if (property) {
         valToSet = property.getType().newInstance([time] as Object[])
         entity.setProperty(field, valToSet)
      }
      return valToSet
   }

   def setUserField(entity, String fieldName) {
      String field = fieldPropsMap.get(fieldName).name
      MetaProperty property = entity.hasProperty(field)

      def valToSet
      if (property) {
         valToSet = currentUserId()
         entity.setProperty(field, valToSet)
      }

      return valToSet
   }

   def setCustomField(entity, String fieldName) {

      String field = fieldPropsMap.get(fieldName)?.name
      MetaProperty property = field?entity.hasProperty(field):null

      def valToSet
      if (property) {
         switch (fieldName){
            case FieldProps.CR_CUSTOM1_KEY:
               valToSet = custom1Val()
               break
            case FieldProps.CR_CUSTOM2_KEY:
               valToSet = custom2Val()
               break
            case FieldProps.ED_CUSTOM1_KEY:
               valToSet = custom1Val()
               break
            case FieldProps.ED_CUSTOM2_KEY:
               valToSet = custom2Val()
               break
         }

         entity.setProperty(field, valToSet)
      }

      return valToSet
   }

   /**
    * Checks if the given domain instance is new
    *
    * it first checks for the createdDate property, if property exists and is not null, returns false, true if null
    * else If createdDate property is not defined, it checks if the domain is attached to session and exists in persistence context.
    *
    * @param entity
    * @return boolean
    */
   boolean isNewEntity(def entity) {
      String createdDateFieldName = fieldPropsMap.get(FieldProps.CREATED_DATE_KEY).name
      MetaProperty createdDateProperty = entity.hasProperty(createdDateFieldName)

      //see issue#41
      if(createdDateProperty != null) {
         def existingValue = createdDateProperty.getProperty(entity)
         return (existingValue == null)
      } else {
         def session = applicationContext.sessionFactory.currentSession
         def entry = session.persistenceContext.getEntry(entity)
         return !entry
      }
   }

   boolean isDisableAuditStamp(entity) {
      def session = applicationContext.sessionFactory.currentSession
      def entry = session.persistenceContext.getEntry(entity)
      return !entry
   }

   def currentUserId() {
      return currentUserClosure(applicationContext)
   }

   def custom1Val(){
      return custom1Closure(applicationContext)
   }
   def custom2Val(){
      return custom2Closure(applicationContext)
   }

   def getSpringSecurityUser = { ctx ->
      def springSecurityService = ctx.springSecurityService
      if (springSecurityService.isLoggedIn()) {
         return springSecurityService.principal.id
      } else {
         return null //fall back
      }
   }

   Boolean isUserAuthorized() {
      def springSecurityService = applicationContext.springSecurityService
      if (springSecurityService.isLoggedIn()) {
         return true
      } else {
         return false
      }
   }

   //---------------------------------------------------------------------
   // Implementation of InitializingBean interface
   //---------------------------------------------------------------------

   public void afterPropertiesSet() throws Exception {

      def cfgClosure = grailsApplication.config.smartsfs.audittrail.currentUserClosure
      if (cfgClosure) {
         currentUserClosure = cfgClosure
      } else {
         currentUserClosure = getSpringSecurityUser
      }
      def cust1Closure = grailsApplication.config.smartsfs.audittrail.custom1Closure
      if(cust1Closure) custom1Closure = cust1Closure
      def cust2Closure = grailsApplication.config.smartsfs.audittrail.custom2Closure
      if(cust2Closure) custom2Closure = cust2Closure

   }

   /**
    * mocks this out for a unit test
    */
   static mockForUnitTest(config, userVal = 1,cust1='test1',cust2='test2',cust3='test3') {
      def testHelper = new AuditTrailHelper()
      testHelper.fieldPropsMap = FieldProps.buildFieldMap(config)
      testHelper.currentUserClosure = { ctx -> userVal }
      testHelper.custom1Closure = {ctx -> cust1}
      testHelper.custom2Closure= {ctx -> cust2}
      testHelper.custom3Closure= {ctx -> cust3}
      testHelper.metaClass.initializeFields = { Object entity -> testHelper.setFieldDefaults(entity) }
      return testHelper
   }
}

