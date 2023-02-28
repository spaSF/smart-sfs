package com.sfs.smartsfs.app



import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.SpringSecurityUtils
import grails.transaction.Transactional

@Transactional(readOnly = true)
class MenuItemController {

   static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

   def responseSCService

   def index() {
      def resp=responseSCService.gridResponse(MenuItem.class,params)
      resp.data.each {row->
         if(row.needrole && !SpringSecurityUtils.ifAnyGranted(row.needrole) && SpringSecurityUtils.ifNotGranted("ROLE_SUPER")){
            resp.data = resp.data - row
            log.debug "remove secured menuItem: ${row}"
            resp.endRow--
            resp.totalRows--
         }else{

            log.debug row.title + ":" + message(code:row.title)
            if(message(code:row.title)){
               row.title=message(code:row.title)
            }
            if(row.parent){
               if(message(code:row.parent.getTitle())){
                  row.parent.title=message(code:row.parent.getTitle())
               }
            }
         }
      }
      //		JSON.use("AllToOne") {respond response:resp}
      respond response:resp
   }

   def getOne(){
      if(params.id){
         respond response:[status:0,data:MenuItem.get(params.id as Long),startRow:1,endRow:1,totalRows:1]
      }
   }

   @Transactional
   def save() {
      MenuItem instance = MenuItem.newInstance(params)
      //		instance.id = Long.valueOf(params.id) //id nesetne!
      instance.validate()
      if (instance.hasErrors()) {
         respond response:[status:-4,data:instance,errors:responseSCService.handleValidationErrors(instance.errors)]
         return
      }

      try {
         instance.save flush:true
      } catch (Exception e) {
         respond response:[status:-1,data:instance,errors:["":e.message]]
         return
      }

      respond response:[status:0,data:instance]
   }

   @Transactional
   def update() {
      MenuItem instance = MenuItem.lock(params.id)
      if (!instance) {
         respond response:[status:-4,data:message(code:"default.not.found.message",args:[
               message(code:"menuItem.label"),
               params.id
            ])]
         return
      }

      def inAtt = params
      if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
         //zmenilo sa!
         respond response:[status:-4,data:message(code:"default.optimistic.locking.failure",args:[instance.id])]
         return
      }
      inAtt.remove("dateCreated")
      inAtt.remove("lastUpdated")
      inAtt.remove("menuItems")
      instance.properties = inAtt
      instance.validate()

      if (instance.hasErrors()) {
         respond response:[status:-4,data:instance,errors:instance.errors]
         return
      }

      try {
         instance.save flush:true
      } catch (Exception e) {
         respond response:[status:-1,data:e.message]
         return
      }

      respond response:[status:0,data:instance]
   }

   @Transactional
   def delete() {
      MenuItem instance = MenuItem.lock(params.id)
      if (!instance) {
         respond response:[status:-4,data:instance,message:message(code:"default.not.found.message",args:[
               message(code:"menuItem.label"),
               params.id
            ])]
         return
      }

      def inAtt = params
      if(instance.version!=Long.valueOf(inAtt.version?:instance.version)){
         //zmenilo sa!
         respond response:[status:-4,data:instance,message:message(code:"default.optimistic.locking.failure",args:[instance.id])]
         return
      }

      MenuItem.withTransaction {status->
         try {
            if(MenuItem.findByParent(instance)) {
               MenuItem.findAllByParent(instance)*.lock()
               MenuItem.findAllByParent(instance)*.delete()
            }
            instance.delete flush:true
         } catch (Exception e) {
            respond response:[status:-1,message:e.message]
            return
         }
      }
      respond response:[status:0,data:instance]
   }
}
