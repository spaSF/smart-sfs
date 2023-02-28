/**
 * MUSI BYT COMPILOVANE IBA WHITESPACE_ONLY LEVELOM
 * POTREBUJEM LOKALNE PREMENNE BEZ ZMENY NAZVU
 */
/**
 * Dialog pre custom operaciu
 */
isc.ClassFactory.defineClass('OperationDialog', 'Window').addProperties({
   // height : "40%",
   // width : "50%",
   isModal : true,
   showModalMask : true,
   autoCenter : true,
   // autoDraw : true,
   autoSize : true,
   canDragResize : true,
   showFooter : true,
   showMinimizeButton : false,
   canDragReposition : true,
   canDragResize : true,
   operation : {},
   dataSource : null,
   currRecord : {},
   dataComp : null,
   initWidget : function() {
      this.Super("initWidget", arguments);
      var D = this;
      if (D.operation && D.dataSource) {
         D.title = D.operation.title;
         var flds = D.operation.operationParams.duplicate();// inak prepises
         var btn = {
            name : "executeBtn",
            type : "button",
            canFocus : true,
            colSpan : 2,
            canEdit : null,
            prompt : D.operation.prompt,
            title : D.operation.title,
            fieldPosition : D.operation.operationParams.length + 1,
            autoFit : true,
            showButtonTitle : true,
            icon : D.operation.icon
         }
         if (D.operation.uploadFile == true) {
            btn = isc.addProperties(btn, {
               click : function() {
                  if (D.form.validate()) {
                	 var ctxRoot = D.dataSource.contextRoot||App.appRootUrl; 
                     D.dataSource.uploadFileToIframe(D.form, ctxRoot + D.operation.uri, function() {
                        D.close();
                        D.markForDestroy();
                     }, D.operation, D.dataComp, D.currRecord);
                  }
               }
            });
         } else {
            btn = isc.addProperties(btn, {
               click : function() {
                  if (D.form.validate()) {
                     D.dataSource._performCustomOperation(D.operation, D.form.getValues(), D.dataComp, D.currRecord, function() {
                        D.close();
                        D.markForDestroy();
                     });
                  }
               }
            });
         }
         flds.add({
            name : "spacer",
            editorType : "RowSpacerItem"
         });
         flds.add(btn);
         D.form = isc.DynamicForm.create({
            autoFocus : true,
            wrapItemTitles : false,
            padding : 10,
            fields : flds
         });

         // params
         D.addItem(D.form);
         var initVals = D.dataSource._getOperParamsInitVals(D.operation, D.dataComp, D.currRecord);
         D.form.setValues(initVals);
         D.draw();
      } else {
         isc.Warn("ERROR");
      }
   }
});

/**
 * Rest data source global customizations
 */
ClassFactory.defineClass("SmartDataSource", "RestDataSource").addProperties({
   noNullUpdates : true,
   omitNullDefaultsOnAdd : true,
   nullIntegerValue : '',
   nullFloatValue : '',
   nullDateValue : '',
   nullBooleanValue : '',
   reorderIndexField : null,
   handleError : function(response, request) {
      var notHandled = true;
      if(response){
         switch (response.httpResponseCode) {
            case 403:
               // forbidden
               if (response.httpResponseText) {
                  isc.warn(response.httpResponseText);
               } else
                  isc.warn(isc.i18nMessages["springSecurity.denied.message"]);
               notHandled = false;
               break;
            case 404:
               // not found
               if (response.httpResponseText) {
                  isc.warn(response.httpResponseText);
                  notHandled = false;
               }
               break;
            default:
               break;
         }
      }
      return notHandled;
   },
   _isReadAble : false,
   _isCreateAble : false,
   _isEditAble : false,
   _isRemoveAble : false,
   setAccess : function() {
      var R = this;
      if (App.get.user) {
         if (R.requiresRole) {
            R._isReadAble = App.get.user.hasAnyRole(R.requiresRole);
         } else
            R._isReadAble = true;
         if (R.editRequiresRole) {
            R._isEditAble = App.get.user.hasAnyRole(R.editRequiresRole);
         } else
            R._isEditAble = R.canEdit == false ? false : true;
         if (R.saveRequiresRole) {
            R._isCreateAble = App.get.user.hasAnyRole(R.saveRequiresRole);
         } else
            R._isCreateAble = R.canSave == false ? false : true;
         if (R.deleteRequiresRole) {
            R._isRemoveAble = App.get.user.hasAnyRole(R.deleteRequiresRole);
         } else
            R._isRemoveAble = R.canEdit == false ? false : true;
      }
   },
   _setFieldAccess : function(field, mode) {
      if (field.viewRequiresRole)
         field.showIf = "var fieldItem=this; return ((fieldItem.hidden === true ? false : true) && App.get.user.hasAnyRole(fieldItem.viewRequiresRole))";
      if (field.editRequiresRole)
         field.canEdit = App.get.user.hasAnyRole(field.editRequiresRole) ? null : false;
      if (field.updateRequiresRole)
         if (mode == "edit")
            field.canEdit = App.get.user.hasAnyRole(field.updateRequiresRole) ? null : false;
         else if(mode!="add") field.canEdit = field.canEdit == false ? false : null;

   },
   setFieldAccess : function(mode, form) {
      var R = this;
      if (App.get.user) {
         for (var key = 0; key < Object.keys(R.fields).length; key++) {
            var field = Object.keys(R.fields)[key];
            R._setFieldAccess(R.fields[field], mode);
         }
         if (form) {
            for (var f = 0; f < form.items.length; f++) {
               var field = form.items[f];
               R._setFieldAccess(field, mode);
            }
         }
      }
   },
   operations : [],
   canPerformOperation : function(operationId) {
      var oper = this.operations.find({
         id : operationId
      })
      if (oper) {
         if (oper.requiresRole) {
            return App.get.user.hasAnyRole(oper.requiresRole);
         } else
            return true;
      } else
         return false;
   },
   uploadFileToIframe : function(valuesManager, actionUri, callBack, oper, dataComp, currRecord) {
      var R = this;
      isc.showPrompt(RPCManager.defaultPrompt);
      var iframe = document.getElementById('_uploadIFrame');
      if (!iframe) {
         iframe = document.createElement('iframe');
         iframe.id = '_uploadIFrame';
         iframe.name = '_uploadIFrame';
         iframe.style.display = 'none';
         document.body.appendChild(iframe);
      }
      if (oper) {
         iframe.onload = function() {
            var resp;
            try {
               resp = isc.JSON.decode(this.contentDocument.body.innerText);
            } catch (e) {
               try {
                  eval("resp=" + this.contentDocument.body.innerText);
               } catch (e) {
                  isc.logWarn("nemozno decodovat navrat uploadu: ->"+this.contentDocument.body.innerText+"<-");
               }
            }
            isc.clearPrompt();
            if(resp) R._handleOperationResponse(oper, resp, resp, dataComp, currRecord)
            callBack();
         }
      } else {
         iframe.onload = function() {
            var resp;
            try {
               resp = isc.JSON.decode(this.contentDocument.body.innerText);
            } catch (e) {
               try {
                  eval("resp=" + this.contentDocument.body.innerText);
               } catch (e) {
                  isc.logWarn("nemozno decodovat navrat uploadu: ->"+this.contentDocument.body.innerText+"<-");
                  resp={response:{}};
               }
            }
            isc.clearPrompt();
            callBack(resp, resp.response.data);
         }
      }
      // IE musi mat form fyzicky na page aby fungoval submit
      var form = document.getElementById('_uploadForm');
      if (!form) {
         form = document.createElement('form');
         form.id = '_uploadForm';
         form.name = '_uploadForm';
      }
      while (form.firstChild) {
         form.removeChild(form.firstChild);
      }
      form.method = "POST";
      form.action = actionUri;
      form.enctype = "multipart/form-data";
      form.target = "_uploadIFrame";

      var frmItems = valuesManager.getItems();

      var uplFormItem = frmItems.find({
         editorType : "UploadItem"
      });
      if (!uplFormItem) {
         uplFormItem = frmItems.find({
            editorType : "SmartFileItem"
         }).canvas.items[0];

      }
      var uplItem = uplFormItem.getHandle().children[0];
      form.appendChild(uplItem);

      var otherValues = document.createElement('textarea');
      otherValues.innerText = isc.JSON.encode(valuesManager.getValues());
      otherValues.name = '_dataUpload';
      form.appendChild(otherValues);
      form.submit();

      uplFormItem.getHandle().appendChild(uplItem);
   },
   _handleOperationResponse : function(oper, response, data, dataComp, currRecord) {
      var R = this;
      if (isA.String(oper))
         oper = R.operations.find({
            code : oper
         });
      if (R.handleError(response)) {
         oper.returnStatusPath = oper.returnStatusPath || "status";
         oper.successTestValue = oper.successTestValue || 0;
         oper.returnMsgPath = oper.returnMsgPath || "data";
         // kedze request isel bez EVAL musim decodovat json data,
         // pride v
         // tvare {response:{data:...}}
         try {
            retJson = data;
            if (isA.String(data))
               retJson = isc.JSON.decode(data);
            if (retJson.hasOwnProperty("response")) {
               response.data = retJson.response["data"];
               response.status = retJson.response["status"];
            }
         } catch (e) {
            response.status = response.status < 0 ? response.status : -1;
         }
         if (response[oper.returnStatusPath] == oper.successTestValue) {
            if (oper.needRefresh == true) {
               dataComp.reload();
               if(dataComp.isA("DetailComponentTemplate")&&dataComp._fromGridCom!=null){
            	   if(dataComp._fromGridCom.isA("GridComponentAny")) dataComp._fromGridCom.grid.refreshData();
               }
            }
            if (oper.callbackOnSuccess) {
               var param = {};
               try {
                  if (!isA.Function(oper.callbackOnSuccess))
                     oper.callbackOnSuccess = eval("(" + oper.callbackOnSuccess + ")");
                  if (isA.String(oper.callbackParam))
                     param = eval(oper.callbackParam);
                  // default parametre DataSource,
                  // dataComp,currRecord,response + volitelny
                  oper.callbackOnSuccess(R, dataComp, currRecord, response, param);
               } catch (e) {
                  isc.warn(isc.i18nMessages["smartsfs.operation.failure.default.message"].messageArgs(oper.title, e.message));
               }
            } else
               isc.say(isc.i18nMessages["smartsfs.operation.success.default.message"].messageArgs(oper.title));
         } else {
            if (response.httpResponseCode == 404) {
               isc.warn(isc.i18nMessages["smartsfs.operation.not.found.default.message"].messageArgs(oper.title));
            } else {
               isc.warn(isc.i18nMessages["smartsfs.operation.failure.default.message"].messageArgs(oper.title, response[oper.returnMsgPath]
                     || response.httpResponseText));
            }
         }
      }

   },
   _performCustomOperation : function(oper, params, dataComp, currRecord, cbk) {
      var R = this;
      var reqProps = {};
      if (oper.downloadResult == true) {
         var downTimeout = isc.NumberUtil.parseInt(App.get.config["smartsfs.download.timeout"]||900000);
         //sc 11 nestaci downloadResult, pridal som transport a useSimpleHttp
         reqProps = {
            downloadResult : true,
//            transport:"hiddenFrame",
            useSimpleHttp:true,
            showPrompt : false,
            timeout:downTimeout
         }
      }
      try {
         var formatPars = isc.JSON.decode(isc.JSON.encode(params));
         params = formatPars;
      } catch (e) {
         params = params;
      }
      try {
    	  var ctxRoot = this.contextRoot||App.appRootUrl;
         App.dataRequest(ctxRoot + oper.uri, params, function(response, data) {
            R._handleOperationResponse(oper, response, data, dataComp, currRecord);
            if (cbk)
               cbk();
         }, true, false, reqProps);
      } catch (e) {
         isc.say(e);
      }
      if ((oper.downloadResult == true || oper.uploadFile == true) && cbk)
         cbk();// necekej
      // callback
      // z
      // requestu nebude
   },
   _hasInteractiveParams : function(oper) {
      for (var p = 0; p < oper.operationParams.length; p++) {
         var param = oper.operationParams[p];
         if (!(param.canEdit==false)&&param.visible==true) {
            return true;
         }
      }
      return false;
   },
   _getOperParamsInitVals : function(oper, dataComp, currRecord) {
      var initVals = {};
      for (var p = 0; p < oper.operationParams.length; p++) {
         var param = oper.operationParams[p];
         if (param.initialValue) {
            initVals[param.name] = param.evaluateInitVal == true ? eval(param.initialValue) : param.initialValue;
         }
      }
      return initVals;
   },
   /**
    * eval ds.formProperties
    * @return evaluated formProperties
    */
   getFormProperties : function(dataComp){
      var D = this;
      var props = isA.String(D.formProperties) ? isc.JSON.decode(D.formProperties) : D.formProperties;
      for ( var propkey in props) {
         props[propkey] = App._evalPropertyValue(props[propkey]);
      }
      return props?props:{};
   },
   /**
    * eval ds.gridProperties
    * @return evaluated gridProperties
    */
   getGridProperties : function(dataComp){
      var D = this;
      var props = isA.String(D.gridProperties) ? isc.JSON.decode(D.gridProperties) : D.gridProperties;
      for ( var propkey in props) {
         props[propkey] = App._evalPropertyValue(props[propkey]);
      }
      return props?props:{};
   },
   downloadSmartFile : function(smartFile) {
      App.dataRequest(App.smartFileDownloadUrl, {
         id : smartFile.id
      }, null, true, false, {
    	 downloadResult: true,
//         transport:"hiddenFrame",
         useSimpleHttp:true,
         showPrompt : false
      });
   },
   performCustomOperation : function(operationId, dataComp, currRecord) {
      var R = this;
      var oper = R.operations.find({
         id : operationId
      });
      if (!oper && isA.String(operationId)) {
         oper = R.operations.find({
            code : operationId
         });
      }
      if (oper) {
         var params = {};
         if (oper.scDialogFunction) {
            if (oper.useIdAsOnlyParam)
               params[R.getPrimaryKeyFieldName()] = currRecord[R.getPrimaryKeyFieldName()];
            else
               params = R._getOperParamsInitVals(oper, dataComp, currRecord);
            if (!isA.Function(oper.scDialogFunction))
               oper.scDialogFunction = eval("(" + oper.scDialogFunction + ")");
            oper.scDialogFunction(params);
         } else {
            if (oper.useIdAsOnlyParam) {
               params[R.getPrimaryKeyFieldName()] = currRecord[R.getPrimaryKeyFieldName()];
               R._performCustomOperation(oper, params, dataComp, currRecord);
            } else {
               if (R._hasInteractiveParams(oper)) {
                  // dialog na nastavenie parametrov
                  OperationDialog.create({
                     dataSource : R,
                     currRecord : currRecord,
                     operation : oper,
                     dataComp : dataComp
                  });
               }else{
                  params = R._getOperParamsInitVals(oper, dataComp, currRecord);
                  R._performCustomOperation(oper, params, dataComp, currRecord);
               }
            }
         }

      }
   },
   convertDSCriteria : function(criteria) {
	   return criteria._constructor=="AdvancedCriteria"?criteria:this.convertDataSourceCriteria(criteria, "exactCase");
   },
   /**
   *@OVERRIDE_SMARTCLIENT 
   *> @method dataSource.getField()
   * Return the field definition object.
   * @param fieldName (String) Name of the field to retrieve
   * @return (DataSourceField) field object
   * @visibility external
    */
   getField : function (fieldName, checkDataPath) {
       if (isc.isAn.Object(fieldName)) fieldName = fieldName.name;
       var fields = this.getFields(),undef;
       var field = fields ? fields[fieldName] : null;

       if (field == null && checkDataPath && fields != null) {
           for (var i in fields) {
               if (fields[i] == null) continue;
               if (fields[i].dataPath == fieldName) {
                   field = fields[i];
                   break;
               }
           }
       }
       if(field==undef||field==null){
    	   field={};
    	   isc.logWarn("Taky FIELD[" + fieldName + "] nemame v DS["+ this.ID + "] ");
       }
       return field;
   },
   /**
    *@OVERRIDE_SMARTCLIENT
    *kedze ani _applySparseAndNoNullUpdates metoda nevie osetrit undefined values...
    *@method dataSource.addData ISC ver.11.1. ISC_DataBinding line 20941 
    */ 
   addData : function (newRecord, callback, requestProperties) {
      var propertiesToSkip = {
            __ref : true,
            __module : true
         };

      for ( var key in newRecord) {

         // Don't touch functions, classes, instances or properties
         // explicitly called out
         // in the proeprtiesToSkip object above
         if (isc.isA.Function(newRecord[key]))
            continue;
         if (propertiesToSkip[key] == true)
            continue;
         if (isc.isAn.Instance(newRecord[key]) || isc.isA.Class(newRecord[key]))
            continue;

         var value = newRecord[key];
         // noNullUpdates nefunguje pre undefined, nastav na null
         if (typeof value == "undefined"){
            isc.logWarn("Osetrena hodnota undefined v insert FIELD[" + key + "] v DS["+ this.ID + "] ");
            newRecord[key] = null;
         }
      }
      this.Super("addData", arguments);
   },   
   /**
    *@OVERRIDE_SMARTCLIENT
    *kedze ani _applySparseAndNoNullUpdates metoda nevie osetrit undefined values...
    *@method dataSource.updateData ISC ver.11.1. ISC_DataBinding line 20960 
    */ 
   updateData : function(updatedRecord, callback, requestProperties){
      var propertiesToSkip = {
            __ref : true,
            __module : true
         };

      for ( var key in updatedRecord) {

         // Don't touch functions, classes, instances or properties
         // explicitly called out
         // in the proeprtiesToSkip object above
         if (isc.isA.Function(updatedRecord[key]))
            continue;
         if (propertiesToSkip[key] == true)
            continue;
         if (isc.isAn.Instance(updatedRecord[key]) || isc.isA.Class(updatedRecord[key]))
            continue;

         var value = updatedRecord[key];
         // noNullUpdates nefunguje pre undefined, nastav na null
         if (typeof value == "undefined"){
            isc.logWarn("Osetrena hodnota undefined v update FIELD[" + key + "] v DS["+ this.ID + "] ");
            updatedRecord[key] = null;
         }
      }
      this.Super("updateData", arguments);
   }
});
