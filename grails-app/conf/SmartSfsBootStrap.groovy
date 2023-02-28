import java.lang.invoke.SwitchPoint

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityUtils
import groovy.json.JsonSlurper

import org.apache.poi.util.TempFile
import org.apache.poi.util.TempFile.DefaultTempFileCreationStrategy

import com.sfs.smartsfs.app.ConfigProperty
import com.sfs.smartsfs.app.Localization
import com.sfs.smartsfs.app.MenuItem
import com.sfs.smartsfs.isc.SmartOperation
import com.sfs.smartsfs.isc.SmartOperationParam
import com.sfs.smartsfs.isc.SmartSource
import com.sfs.smartsfs.isc.SmartSourceField
import com.sfs.smartsfs.sec.LocaleLang
import com.sfs.smartsfs.util.SmartDomainClassMarshaller

class SmartSfsBootStrap {
	def dataSourceUtilService
	def grailsApplication



	def init = { servletContext ->

		dataSourceUtilService.setCtxRoot(servletContext.contextPath)
		dataSourceUtilService.initializeData() //zrobi iba pri prvom starte
		def tmpDir = ConfigProperty.findByKey("smartsfs.temp.directory").value?:"tmp"
		def gapc = (grailsApplication.mainContext.servletContext.getRealPath("/${tmpDir}"))
		File tempF = new File(gapc)
		tempF.mkdirs()
		TempFile.setTempFileCreationStrategy(new DefaultTempFileCreationStrategy(tempF))

		//UPGRADE mimo initializeData po upgrade pluginu
		SpringSecurityUtils.doWithAuth("admin") {
			upgrade2_5_0()
         upgrade_2_5_1()
			dataSourceUtilService.createDataSources()
			ConfigProperty.list()*.updateConfigMap()
		}



		//marshaller s prioritou 2(vyssia bere) = smart marshaller bez toMany a shortFields
		JSON.registerObjectMarshaller(new SmartDomainClassMarshaller(true,grailsApplication),9)
		//marshaller s prioritou 1 = standard - kedze je prebity smartom, asi je to zbytocne...
		//JSON.registerObjectMarshaller(new DomainClassMarshaller(true,grailsApplication), 1)
		//Date marshaller - datum bez casu na cisty datum, inak js dokazi historicke datumy
		JSON.registerObjectMarshaller(Date) {
			// SmartClient uz spravne spracuje aj DateItem s posunom na UTC
			//			if(it?.format("HH:mm:ss.S")=="00:00:00.0"){
			//				return it?.format("yyyy-MM-dd")
			//			}else{
			def tz = TimeZone.getTimeZone('UTC')
			return it?.format("yyyy-MM-dd'T'HH:mm:ss",tz)
			//			}
		}
		//add method to String class doRadecku
		String.metaClass.doRadecku << {delegate.replaceAll("\\r?\\n", "...")}
	}

	def destroy = {
	}

	def upgrade2_5_0(){
		//upgrade so zmenami po nasadeni v prvej aplikacii
		if(!Localization.findByCode("default.grid.tabtitle")){
			LocaleLang.findAll().each {lang->
				Localization.findOrSaveWhere(locale:lang.id,code: "default.grid.tabtitle", text: "Prehľad" )
			}
			Localization.withSession { it.flush() }
		}
		if(!Localization.findByCode("smartsfs.buttons.switch.prompt")){
			LocaleLang.findAll().each {lang->
				Localization.findOrSaveWhere(locale:lang.id,code: "smartsfs.buttons.switch.prompt", text: "Sekcie/Záložky" )
			}
			Localization.withSession { it.flush() }
		}
		if(!Localization.findByCode("smartsfs.tabset.closeAll")){
			LocaleLang.findAll().each {lang->
				Localization.findOrSaveWhere(locale:lang.id,code: "smartsfs.tabset.closeAll", text: "Zavri všetky záložky" )
				Localization.findOrSaveWhere(locale:lang.id,code: "smartsfs.tabset.closeOthers", text: "Zavri ostatné záložky" )
				Localization.findOrSaveWhere(locale:lang.id,code: "smartsfs.tabset.closeRight", text: "Zavri záložky vpravo" )
			}
			Localization.withSession { it.flush() }
		}
		if(!SmartOperation.findByCode("csvImport")){
			def json =
					'{"callbackOnSuccess":"function(ds,comp,rec,resp){debugger; isc.say(isc.i18nMessages[\\"smartsfs.operation.success.default.message\\"].messageArgs(this.title)+\\" \\"+isc.i18nMessages[\\"smartsfs.csvImport.success.message\\"].messageArgs(resp.data.all,resp.data.done)); }" \
			,"code":"csvImport","downloadResult":false,"icon":"[SKIN]/custom/csv_in.png","needRefresh":true \
			,"placeOn":"GRID","position":5,"requiresRole":"ROLE_SUPER","returnMsgPath":"data","returnStatusPath":"status" \
			,"scDialogFunction":null,"successTestValue":"0","title":"isc.i18nMessages[\\"smartsfs.csvImport.title\\"]","uploadFile":true,"uri":"/SmartSource/importCSV","useIdAsOnlyParam":false}'
			def jop = new JsonSlurper().parseText(json)
			SmartOperation op =SmartOperation.newInstance(jop)
			op.dSource=SmartSource.findWhere(ID:"SmartSource")
			op.save(flush:true)
			json='{"editorType":"UploadItem","fieldPosition":1,"name":"uploadFile","required":true,"title":"isc.i18nMessages[\\"smartsfs.csvImport.uploadFile\\"]","type":"file","visible":true}'
			def opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			json='{"canEdit":true,"fieldPosition":2,"initialValue":"MERGE","name":"merge","required":true,"title":"isc.i18nMessages[\\"smartsfs.csvImport.merge\\"]","type":"select","valueMap":"MERGE,INSERT","visible":true}'
			opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			json='{"evaluateInitVal":true,"fieldPosition":3,"initialValue":"dataComp.dataSource.ID","name":"dataSource","type":"text","visible":false}'
			opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)

			json='{"code":"jsonExport","downloadResult":true,"needRefresh":false,"placeOn":"GRID","position":4,"requiresRole":"ROLE_SUPER","returnMsgPath":"httpResponseText","returnStatusPath":"httpResponseCode","successTestValue":"200","title":"isc.i18nMessages[\\"smartsfs.jsonExport.title\\"]","uri":"/SmartNavigator/exportJSON","useIdAsOnlyParam":false}'
			jop = new JsonSlurper().parseText(json)
			op =SmartOperation.newInstance(jop)
			op.dSource=SmartSource.findWhere(ID:"SmartSource")
			op.save(flush:true)
			json='{"canEdit":true,"fieldPosition":1,"initialValue":"false","name":"exportSelected","required":true,"title":"isc.i18nMessages[\\"smartsfs.jsonExport.exportSelected\\"]","type":"boolean","visible":true}'
			opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			json='{"evaluateInitVal":true,"fieldPosition":2,"initialValue":"isc.JSON.encode(dataComp.getCriteria())","name":"criteria","type":"text","visible":false}'
			opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			json='{"evaluateInitVal":true,"fieldPosition":3,"initialValue":"dataComp.grid.getSelectedRecords().getProperty(\\"id\\")","name":"selectedIds","type":"text","visible":false}'
			opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			json='{"evaluateInitVal":true,"fieldPosition":4,"initialValue":"dataComp.dataSource.ID","name":"dataSource","type":"text","visible":false}'
			opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			//dopln parameter importCompatible do csvExport operacie
			op=SmartOperation.findByUri("/smartSource/csvExport")
			op.setTitle("isc.i18nMessages[\"smartsfs.csvExport.title\"]")
			op.save()
			json='{"evaluateInitVal":true,"fieldPosition":4,"initialValue":"false","name":"importCompatible","required":true,"title":"isc.i18nMessages[\\"smartsfs.csvExport.importCompatible.title\\"]","type":"boolean","visible":true}'
			opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)

			LocaleLang.findAll().each {lang->
				new Localization(locale:lang.id,code: "smartsfs.buttons.csvIn.prompt", text: "Import údajov (CSV)" ).save(failOnError:false)
				new Localization(locale:lang.id,code: "smartsfs.csvImport.title", text: "Import údajov (CSV)" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartsfs.csvImport.uploadFile", text: "Súbor CSV" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartsfs.csvImport.merge", text: "Metóda vloženia" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartsfs.csvImport.success.message", text: "Počet záznamov {0}/Spracovaných {1}" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartsfs.jsonExport.title", text: "Export údajov (JSON)" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartsfs.jsonExport.exportSelected", text: "Exportovať označené" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartsfs.csvExport.title", text: "Export údajov (CSV)" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartsfs.csvExport.importCompatible.title", text: "Kompatibilne s importom" ).save(failOnError :false)
			}
			Localization.withSession { it.flush() }

		}
		if(!SmartOperationParam.findByName("charset")){
			SmartOperation op=SmartOperation.findByUri("/SmartSource/importCSV")
			def json='{"evaluateInitVal":false,"editorType":"select","fieldPosition":4,"initialValue":"windows-1250","name":"charset","required":false,"valueMap":"windows-1250,ISO-8859-2,UTF-8,UTF-16","title":"isc.i18nMessages[\\"smartsfs.csvImport.charset\\"]","type":"text","canEdit":true,"visible":true}'
			def opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			LocaleLang.findAll().each {lang->
				new Localization(locale:lang.id,code: "smartsfs.csvImport.charset", text: "Znaková sada súboru" ).save(failOnError :false)
			}
				

		}
		if(!ConfigProperty.findByKey("smartsfs.csvImport.support")){
			new ConfigProperty(adminProperty: true,key: "smartsfs.csvImport.support", value: "false",description: "Podpora vseobecneho importu CSV v Gride"  ).save(flush:true)
		}
		if(!SmartOperation.findByCode("cloneOperation")){
			def json='{"code":"cloneOperation","downloadResult":false,"icon":null,"placeOn":"DETAIL","position":1,"prompt":"isc.i18nMessages[\\"smartOperation.cloneOperation.prompt\\"]","requiresRole":"ROLE_SUPER","returnMsgPath":"data","returnStatusPath":"status","successTestValue":"0","title":"isc.i18nMessages[\\"smartOperation.cloneOperation.title\\"]","uploadFile":false,"uri":"/SmartOperation/cloneOperation.json","useIdAsOnlyParam":false}'
			def jop = new JsonSlurper().parseText(json)
			SmartOperation op =SmartOperation.newInstance(jop)
			op.dSource=SmartSource.findWhere(ID:"SmartOperation")
			op.save(flush:true)
			json='{"evaluateInitVal":true,"fieldPosition":1,"initialValue":"currRecord.id","name":"id","required":true,"type":"integer","visible":false}'
			def opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			json='{"displayField":"ID","editorType":"SmartCombo","fieldPosition":2,"name":"smartDS","optionDataSource":"SmartSource","prompt":"isc.i18nMessages[\\"smartOperation.cloneOperation.smartDS.prompt\\"]","required":true,"title":"isc.i18nMessages[\\"smartOperation.cloneOperation.smartDS\\"]","type":"text","valueField":"ID","visible":true}'
			opp = new JsonSlurper().parseText(json) as SmartOperationParam
			opp.scOperation=op
			opp.save(flush:true)
			LocaleLang.findAll().each {lang->
				new Localization(locale:lang.id,code: "smartOperation.cloneOperation.title", text: "Skopíruj operáciu" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartOperation.cloneOperation.prompt", text: "Bude vytvorená kópia definície operácie pod iným DataSource" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartOperation.cloneOperation.smartDS.prompt", text: "Cieľový DataSource kópie" ).save(failOnError :false)
				new Localization(locale:lang.id,code: "smartOperation.cloneOperation.smartDS", text: "Data Source ID" ).save(failOnError :false)
			}
			Localization.withSession { it.flush() }
		}

		if(!ConfigProperty.findByKey("smartsfs.tabcolor.edit")){
			new ConfigProperty(adminProperty: true,key: "smartsfs.tabcolor.edit", value: "green",description: "Zafarbenie tabu v edit mode"  ).save(flush:true)
		}
		if(!ConfigProperty.findByKey("smartsfs.tabset.dynamicGridTabs")){
			new ConfigProperty(adminProperty: true,key: "smartsfs.tabset.dynamicGridTabs", value: "false",description: "Dynamicky grid TabSet"  ).save(flush:true)
		}
		if(!ConfigProperty.findByKey("smartsfs.tabset.editTabIcon")){
			new ConfigProperty(adminProperty: true,key: "smartsfs.tabset.editTabIcon", value: "[SKIN]/custom/save.png",description: "Ikona tabu v edit mode"  ).save(flush:true)
		}
		//poradie do menu polozky => nasledna konfiguracia DS
		SmartSource.findWhere(ID:"MenuItem").each{ds->
			if(!SmartSourceField.findByNameAndDSource("position",ds)){
				SmartSourceField.findAllByDSource(ds).each{ssf->
					if(ssf.name=="id"){
						ssf.canEdit=false
						ssf.autoGenerated=true
						ssf.canFocus=false
						ssf.required=false
						ssf.save(flush:true)
					}
					if(ssf.fieldPosition>1) ssf.fieldPosition=ssf.fieldPosition+1
					ssf.save(flush:true)
				}
				new SmartSourceField(name:"position",autoGenerated:false,canEdit:null,canFilter:true,canSave:true,decimalPad:null,decimalPrecision:null,detail:null,displayField:"",dSource:ds,editRequiresRole:"",editorType:"integer",fieldPosition:2,foreignDisplayField:"",foreignKey:"",hidden:null,includeFrom:"",includeVia:"",length:null,primaryKey:null,propertiesOnly:null,readOnlyEditorType:"text",required:true,rootValue:"",title:"isc.i18nMessages[\"menuItem.position.label\"]",type:"integer",updateRequiresRole:"",validOperators:"",validators:"",valueXPath:"",viewRequiresRole:"",formItemProps:"",optionDataSource:"",canFocus:true,valueField:"",multiple:null,multipleStorage:"",prompt:"", characterCasing:"",mask:"",valueMap:"").save(flush:true)
				ds.gridProperties="{\"reorderIndexField\":\"position\",\"initialSort\":[{property:'position',direction:'ascending'},{property:'id',direction:'ascending'}]}"
				ds.save()
				int pp=1
				MenuItem.findAll(sort:"id").each{mi->
					mi.position=pp++
					mi.save()
				}
         }
		}
		SmartSource.findWhere(ID:"MenuItemDetail").each{ds->
			if(!SmartSourceField.findByNameAndDSource("position",ds)){
				SmartSourceField.findByDSource(ds).each{ssf->
					if(ssf.name=="id"){
						ssf.canEdit=false
						ssf.canFocus=false
						ssf.autoGenerated=true
						ssf.required=false
						ssf.save(flush:true)
					}
					if(ssf.fieldPosition>1) ssf.fieldPosition=ssf.fieldPosition+1
					ssf.save(flush:true)
				}
				new SmartSourceField(name:"position",autoGenerated:false,canEdit:null,canFilter:true,canSave:true,decimalPad:null,decimalPrecision:null,detail:null,displayField:"",dSource:ds,editRequiresRole:"",editorType:"integer",fieldPosition:2,foreignDisplayField:"",foreignKey:"",hidden:null,includeFrom:"",includeVia:"",length:null,primaryKey:null,propertiesOnly:null,readOnlyEditorType:"text",required:false,rootValue:"",title:"isc.i18nMessages[\"menuItem.position.label\"]",type:"integer",updateRequiresRole:"",validOperators:"",validators:"",valueXPath:"",viewRequiresRole:"",formItemProps:"",optionDataSource:"",canFocus:true,valueField:"",multiple:null,multipleStorage:"",prompt:"", characterCasing:"",mask:"",valueMap:"").save(flush:true)
         }else{
            def fld=SmartSourceField.findByNameAndDSource("position",ds)
            if(!fld.required){
               fld.setRequired(true)
               fld.save()
            }
         }
		}
      SmartOperation.findByCode("setContextRoot").each{o->
         def p=o.operationParams.find{it.name=="toCtx"}
         if(p?.required){
            p.setRequired(false)
            p.save()
         }
      }
	}

   def upgrade_2_5_1(){
      //custom icon menu polozky
      SmartSource.findWhere(ID:"MenuItem").each{ds->
         if(!SmartSourceField.findByNameAndDSource("icon",ds)){
            SmartSourceField.findAllByDSource(ds).each{ssf->
               if(ssf.fieldPosition>3) ssf.fieldPosition=ssf.fieldPosition+1
               ssf.save(flush:true)
            }
            new SmartSourceField(name:"icon",autoGenerated:false,canEdit:null,canFilter:true,canSave:true,displayField:"",dSource:ds,editRequiresRole:"",editorType:"text",fieldPosition:4,foreignDisplayField:"",foreignKey:"",hidden:null,includeFrom:"",includeVia:"",readOnlyEditorType:"text",required:false,rootValue:"",title:"isc.i18nMessages[\"menuItem.icon.label\"]",type:"text",updateRequiresRole:"",validOperators:"",validators:"",valueXPath:"",viewRequiresRole:"",formItemProps:"",optionDataSource:"",canFocus:true,valueField:"",multiple:null,multipleStorage:"",prompt:"[SKIN]custom/XXX.png", characterCasing:"",mask:"",valueMap:"").save(flush:true)
            MenuItem.findAll().each{MenuItem item->
               switch (item.getTitle()){
                  case "menu.configuration.title":
                     item.setIcon("[SKIN]custom/folder_open.png" )
                     item.save()
                     break
                  case "menu.menuItem.title":
                     item.setIcon("[SKIN]custom/menu.png" )
                     item.save()
                     break
                  case "menu.dataSource.title":
                     item.setIcon("[SKIN]custom/datasource.png" )
                     item.save()
                     break
                  case "menu.requestMap.title":
                     item.setIcon("[SKIN]custom/disconnect.png" )
                     item.save()
                     break
                  case "menu.administration.title":
                     item.setIcon("[SKIN]custom/folder_open.png" )
                     item.save()
                     break
                  case "menu.localization.title":
                     item.setIcon("[SKIN]custom/world.png" )
                     item.save()
                     break
                  case "menu.localeLang.title":
                     item.setIcon("[SKIN]custom/world.png" )
                     item.save()
                     break
                  case "menu.localeCountry.title":
                     item.setIcon("[SKIN]custom/world.png" )
                     item.save()
                     break
                  case "menu.configProperty.title":
                     item.setIcon("[SKIN]custom/gears.png" )
                     item.save()
                     break
                  case "menu.hotNews.title":
                     item.setIcon("[SKIN]custom/lightning.png" )
                     item.save()
                     break
                  case "menu.appSecurity.title":
                     item.setIcon("[SKIN]custom/user_go.png" )
                     item.save()
                     break
                  case "menu.user.title":
                     item.setIcon("[SKIN]custom/vcard_edit.png" )
                     item.save()
                     break
                  case "menu.roles.title":
                     item.setIcon("[SKIN]custom/user_orange.png" )
                     item.save()
                     break
                  case "menu.roleGroups.title":
                     item.setIcon("[SKIN]custom/user_orange.png" )
                     item.save()
                     break
                  default:
                     break
               }
            }
         }
      }
      SmartSource.findWhere(ID:"MenuItemDetail").each{ds->
         if(!SmartSourceField.findByNameAndDSource("icon",ds)){
            SmartSourceField.findByDSource(ds).each{ssf->
               if(ssf.fieldPosition>3) ssf.fieldPosition=ssf.fieldPosition+1
               ssf.save(flush:true)
            }
            new SmartSourceField(name:"icon",autoGenerated:false,canEdit:null,canFilter:true,canSave:true,displayField:"",dSource:ds,editRequiresRole:"",editorType:"text",fieldPosition:4,foreignDisplayField:"",foreignKey:"",hidden:null,includeFrom:"",includeVia:"",readOnlyEditorType:"text",required:false,rootValue:"",title:"isc.i18nMessages[\"menuItem.icon.label\"]",type:"text",updateRequiresRole:"",validOperators:"",validators:"",valueXPath:"",viewRequiresRole:"",formItemProps:"",optionDataSource:"",canFocus:true,valueField:"",multiple:null,multipleStorage:"",prompt:"[SKIN]custom/XXX.png", characterCasing:"",mask:"",valueMap:"").save(flush:true)
         }
      }
      if(!ConfigProperty.findByKey("smartsfs.tabset.gridTabSet")){
         new ConfigProperty(adminProperty: true,key: "smartsfs.tabset.gridTabSet", value: "true",description: "Grid s vlastnym TabSetom"  ).save(flush:true)
      }
   }

}
