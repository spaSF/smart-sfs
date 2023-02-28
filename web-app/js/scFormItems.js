FormItem.addProperties({
   showFocused : true,
   blur : function(form, item) {
      var key = isc.EventHandler.getKey();
      // this.Super("blur",arguments);
      if (form && form.handleFocus && !EventHandler.leftButtonDown() && key == "Tab" && form.canEdit == true)
         form.handleFocus(item, EventHandler.shiftKeyDown());
   },
   getParentSmartComp : function() {
      var obj = this.parentElement || this.form.parentElement || this.form.grid.parentElement;
      if (obj == undefined) {
         return null;
      } else {
         return App._findParentSmartClass(obj, "GridComponentAny") || App._findParentSmartClass(obj, "DetailComponentTemplate");
      }
   },
   /**
    * @OVERRIDE_SMARTCLIENT ISC_Forms.js method bo v IE sa zpadne vo filter editore pri zavreti gridu z komba POZOR! musis kontrolovat pri prechode na
    *                       novu verziu SC
    */
   getDisplayFieldName : function() {

      var optionDataSource = this.getOptionDataSource(), formDS = this.form ? this.form.getDataSource() : null;

      // For a databound form, we can hit a situation where a field has a specified displayField for displaying values from the same record (statically),
      // but the equivalent field in the optionDataSource has a different name.
      // This means if we have both a dataSource on the form and an optionDataSource on the item, the intention of item.displayField is ambiguous.
      // Therefore:
      // - support explicit 'foreignDisplayField' as a displayField when retrieving values from an ODS
      // - otherwise if we have both ODS and form.dataSource, and displayField is set:
      // - verify the displayField actually exists in the ODS before using it.
      if (optionDataSource) {
         if (this.foreignDisplayField) {
            return this.foreignDisplayField;
         } else if (formDS == null && this.displayField) {
            return this.displayField;
         }
      } else if (this.displayField) {
         return this.displayField;
      }

      // At this stage, if we have a displayField, we know we also have both a form dataSource and an option dataSource.
      // Verify the field exists in the optionDataSource before using it!
      if (this.displayField) {
         var formDSField = formDS.getField(this.getFieldName()), formDSFieldDisplayField = formDSField ? formDSField.displayField : null;
         if (this.displayField != formDSFieldDisplayField || optionDataSource.getField(this.displayField) != null) {
            return this.displayField;
         } else {
            this.logInfo("Ignoring specified displayField:" + this.displayField
                  + " - this doesn't  match any fields present in our optionDataSource:" + optionDataSource);
         }
      }

      var valueFieldName = this.getValueFieldName();

      if (optionDataSource && optionDataSource != isc.DataSource.getDataSource(this.form ? this.form.dataSource : null) &&
      // Has a displayField - this implies a mapping from data
      // to display values
      // in the main DS which doesn't apply in the option
      // DataSource. Assume
      // we're working with (something like) primary keys in
      // the ODS and return
      // the title field as a display-field
      (this.displayField != null ||
      // The name field in the ODS is hidden - use the title
      // field

      (optionDataSource.getField(valueFieldName) && optionDataSource.getField(valueFieldName).hidden == true))) {
         return optionDataSource.getTitleField();
      }
   }
});

isc.DateItem.addProperties({
   textAlign : "left",
   // date as textfield
   useTextField : true,
   enforceDate : true,
   /**
    * @OVERRIDE_SMARTCLIENT ISC_Forms DateItem line 49838 nesmie povolit expressions, lebo value v criteria bude locale date string napr. Sat Nov 01
    *                       1980 12:00:00 GMT+0100 (Central Europe Standard Time)
    */
   _shouldAllowExpressions : function() {
      // if (this.useTextField) {
      // return this.Super("_shouldAllowExpressions", arguments);
      // } else {
      return false;
      // }
   },
   $85m : function() {
      return this._shouldAllowExpressions();
   },
   keyDown : function(item, form, keyName) {
      if (keyName == "f3" || keyName == "f2" || keyName == "A" && (isc.EventHandler.ctrlKeyDown()) || keyName == "S"
            && (isc.EventHandler.ctrlKeyDown())) {
         if (this.dateTextField)
            this.dateTextField.blur(form, item);// textfield update value
      }
   }
});

ClassFactory.defineClass("SmartCombo", "ComboBoxItem").addProperties({
   // allowExpressions : true,
   addUnknownValues : false,// ak false tak musi vybrat
   _shouldAllowExpressions : function() {
      return true;
   },
   $85m : function() {
      return this._shouldAllowExpressions();
   },
   getAdvancedPickLisCriteria : function(crit) {
      if (crit["_constructor"] != "AdvancedCriteria") {
         if (this["optionDataSource"] == undefined || !this["optionDataSource"]) {
            crit = isc.DataSource.convertCriteria(crit, "startsWith");
         } else {
            var ds = isc.DataSource.get(this.optionDataSource);
            if (ds) {
               crit = ds.convertDataSourceCriteria(crit, "startsWith");
            } else
               crit = isc.DataSource.convertCriteria(crit, "startsWith");
         }
      }
      return crit || {};
   },
   getPickListFilterCriteria : function() {
      var crit = this.Super("getPickListFilterCriteria");
      return this.getAdvancedPickLisCriteria(crit);
   },
   getCriterion : function(textMatchStyle) {
      // tato funcia hovori, ci moze zrobit expression
      // criterion, pre combo je
      // false
      if (this.addUnknownValues)
         this._shouldAllowExpressions = function() {
            return true
         };
      var crit = this.Super("getCriterion", textMatchStyle);
      if (this.addUnknownValues)
         this._shouldAllowExpressions = function() {
            return false
         };
      if (crit && (crit.operator == "isNull" || crit.operator == "notNull")) {
         crit.fieldName = this.getDataPath() || this.getFieldName();
      }
      return crit || {};
   },
   getDisplayValue : function() {
      return this.Super("getDisplayValue", arguments);
      // var dispVal =
      // this.Super("getDisplayValue",arguments);
      // return dispVal;
   },
   iconClick : function(form, item, icon) {
      var thisDS = item.optionDataSource;
      if (!thisDS && item.foreignKey)
         thisDS = item.foreignKey.charAt(0).toUpperCase() + item.foreignKey.slice(1).split(".")[0];
      App.getDataSource(thisDS, function(getDS) {
         if (getDS) {
            if (item.getValue() && icon.name == "detail") {
               App._showDetailByPK(getDS, item.getValue(), App._findParentTabSet(item.grid || item.form));
            }
         }
      });
   },
   icons : [ {
      name : "detail",
      title : 'Detail',
      prompt : function() {
         return isc.i18nMessages["smartsfs.buttons.showdetail.prompt"];
      },
      src : '[SKIN]/DynamicForm/default_formItem_icon.png',
      disableOnReadOnly : false
   } ]
});

isc.ClassFactory.defineClass('comboPickUp', 'SmartCombo').addProperties({
   id : 'comboPickUp',
   // showPickerIcon : false,
   pickerIconSrc : '[SKIN]/pickers/search_picker.png',
   showPickListOnKeypress : false, // Nevyhladava v datach
   addUnknownValues : false,
   showPicker : function() {},
   iconClick : function(form, item, icon) {
      var thisDS = item.optionDataSource;
      if (!thisDS && item.foreignKey)
         thisDS = item.foreignKey.charAt(0).toUpperCase() + item.foreignKey.slice(1).split(".")[0];
      App.getDataSource(thisDS, function(getDS) {
         if (getDS) {
            if (icon.name == "picker") {
               var setRec = function(resSelectedData) {
                  if (resSelectedData) {
                     // zapis nove data
                     var value = resSelectedData[0][item.getValueFieldName()];
                     var dispField = item.getDisplayFieldName();
                     if (dispField.indexOf(".") > -1)
                        dispField = dispField.split(".")[1];
                     var dispValue = resSelectedData[0][dispField];
                     var map = {};
                     map[value] = dispValue;
                     item.setValueMap(map);
                     item.setValue(value);
                  }
               }
               // otvor dialog
               isc.listGridDialog.create({
                  title : getDS.pluralTitle,
                  dataSource : getDS,
                  brefField : item.valueField,
                  brefValue : null,
                  selectionType : "single",
                  selectionAppearance : "rowStyle",
                  _reqProfile : null,
                  _resData : setRec
               });
            } else if (item.getValue() && icon.name == "detail") {
               App._showDetailByPK(getDS, item.getValue(), App._findParentTabSet(item.grid || item.form));
            }
         }
      });
   },
   icons : [ {
      name : "detail",
      src : '[SKIN]/DynamicForm/default_formItem_icon.png',
      disableOnReadOnly : false
   } ]
});

/**
 * FormItem musi mat Optiondatasource pri vypnuti showAdd = false bude button pr pridanie zaznamu viditelny lem v mode "NEW" inak bude aktivny v mode
 * "EDIT_BY_PK"
 */
ClassFactory.defineClass("SmartComboAdd", "SmartCombo").addProperties({
   showAdd : true,
   isExtended : false,
   dataSource : "",
   parentSmartComp : "",
   setDS : function() {
      var C = this;
      var thisDS = C.optionDataSource;
      if (!thisDS && C.foreignKey)
         thisDS = C.foreignKey.charAt(0).toUpperCase() + C.foreignKey.slice(1).split(".")[0];
      App.getDataSource(thisDS, function(getDS) {
         if (getDS)
            C.dataSource = getDS
      })
   },
   getParentSmartComp : function(form) {
      var obj = this.form.parentElement;
      if (obj == undefined)
         return null;
      return App._findParentSmartClass(obj, "DetailComponentTemplate");
   },
   redraw : function() {
      if (this.icons.length > 1 && this.showAdd && !this.isExtended) {
         this.parentSmartComp = this.getParentSmartComp(this.form)
         var W = this.getWidth()
         var P = this.pickListWidth ? this.pickListWidth : 0
         this.width = W + 40
         if (P - 5 <= W)
            this.pickListWidth = W - 5
         this.isExtended = true
      }
      this.Super("redraw", arguments);
   },
   addRecord : function(obj) {
      App._addRecord(obj, this)
   },
   iconClick : function(form, item, icon) {
      var C = this;
      if (icon.name == "add") {
         if (C.showAdd)
            C.addRecord(C.parentSmartComp)
      } else if (item.getValue() && icon.name == "detail") {
         App._showDetailByPK(item.dataSource, item.getValue(), App._findParentTabSet(item.grid || item.form));
      }
   },
   icons : [ {
      name : "detail",
      title : 'Detail',
      prompt : function() {
         return isc.i18nMessages["smartsfs.buttons.showdetail.prompt"];
      },
      src : '[SKIN]/DynamicForm/default_formItem_icon.png',
      disableOnReadOnly : false
   }, {
      name : "add",
      title : 'Add',
      prompt : function() {
         return isc.i18nMessages["smartsfs.buttons.create.prompt"].messageArgs("");
      },
      src : '[SKIN]/custom/plus_icon.png',
      disableOnReadOnly : true,
      showIf : function(form, item) {
         if (item.dataSource.canEdit != false) {
            if (item.parentSmartComp && item.parentSmartComp.mode == "NEW")
               item.showAdd = true
         } else {
            item.showAdd = false
         }
         return item.showAdd;
      }
   } ],
   init : function() {
      this.Super("init", arguments);
      var T = this;
      T.setDS()
      this.observe(T.form, "draw", "observer.redraw()");
   }
});

/**
 * pre smartFileItem musis v DS definovat skryte pole s menom tvojho smartFileItem+_filename
 */
isc.ClassFactory.defineClass("SmartFileItem", "FileItem").addProperties(
      {
         downloadIconSrc : "[SKIN]/actions/download.png",
         _updateFileDisabled : true,
         viewIconSrc : "[SKIN]/actions/edit.png",
         viewFile : function() {
            this.setCanEdit(true);
            this.redraw();
         },
         downloadFile : function() {
            isc.DS.get(this.getFormDataSource()).downloadSmartFile(this.getFormRecord()[this.name]);
         },
         handleSmartView : function(canEdit, value) {
            //doplnit kombinaciu s nastavenim canSave itemu (canEdit sa meni nemozme pouzit)
            var itemEditable=!(this.canSave===false)&&canEdit;
            this._updateFileDisabled = !itemEditable;
            this.setCanEdit(itemEditable ? (value ? (value.hasOwnProperty("filename") ? false : true) : true) : false);
            this.delayCall("redraw");
         },
         /**
          * @OVERRIDE_SMARTCLIENT DEPRECATED ISC_Forms.js _recreateCanvas je neexistujuca fcia pouzita redraw() pri zmene readOnly statusu je to zjavne preklep,
          *                       mala byt volana public recreateCanvas alebo nemala byt public v minify je to funkcia $173n (opravene v 11.1)
          * opravene v smartclient builde SmartClient_v111p_2019-09-29_PowerEdition                     
          */
//         _recreateCanvas : function() {
//            this.recreateCanvas();
//         },
//         $173n : function() {
//            this.recreateCanvas();
//         },
         redraw : function() {
            // This occurs when changing the state of canEdit.
            // if (this._isReadOnly != this.isReadOnly()) {
            var value = this.getValue();
            if (this.canvas) {
               delete this.canvas.canvasItem;
               this.canvas.destroy(true);
            }
            if (this._createReadOnlyCanvas == undefined)
               this._createReadOnlyCanvas = this.$862;
            if (this._createEditableCanvas == undefined)
               this._createEditableCanvas = this.$863;
            this._isReadOnly = this.isReadOnly();
            this.setCanvas(this._isReadOnly ? this._createReadOnlyCanvas() : this._createEditableCanvas());
            this.setValue(value);
            // }
            this.Super("redraw", arguments);
         },
         _getViewIconSrc : function() {
            return this._updateFileDisabled ? "&nbsp;" : isc.Canvas.imgHTML({
               src : this.viewIconSrc,
               width : 16,
               height : 16,
               extraCSSText : "cursor:" + isc.Canvas.HAND,
               extraStuff : "onclick='" + this.getID() + ".viewFile()'"
            });
         },
         _getDownloadIconSrc : function() {
            return isc.Canvas.imgHTML({
               src : this.downloadIconSrc,
               width : 16,
               height : 16,
               extraCSSText : "cursor:" + isc.Canvas.HAND,
               extraStuff : " onclick='" + this.getID() + ".downloadFile()'"
            });
         },
         getViewDownloadHTML : function(value, record) {
            // if (isc.isA.String(value)) return value;
            if (record == null)
               return null;
            var form = this.form, ds = form.getDataSource(), field = ds ? ds.getField(this.name) : null, name = (value ? value["filename"] : null)
                  || record[this.name + "_filename"];
            if (field && !field.filenameSuppressed && (name == null || isc.isAn.emptyString(name))) {
               return this.emptyCellValue;
            }
            return "<nobr>" + this._getViewIconSrc() + "&nbsp;" + this._getDownloadIconSrc() + (name ? "&nbsp;" + name : "") + "</nobr>";
         }
      });

isc.ClassFactory.defineClass("DetailHasOneItem", "CanvasItem").addProperties({
   showTitle : false,
   showGroupTitle : true,
   colSpan : 4,
   shouldSaveValue : true,
   fetchFormData : function() {
      var crit = {};
      var ival = this.getValue()
      crit[this.valueField] = this.getValue();
      crit = this.formDataSource.convertDataSourceCriteria(crit, "exactCase");
      this.detail.valuesManager.fetchData(crit);
   },
   getParentSmartComp : function(form) {
      var obj = form.parentElement;
      if (obj == undefined)
         return null;
      return App._findParentSmartClass(obj, "DetailComponentTemplate");
   },
   save : function(comp, item) {
      if (this.detail.valuesHaveChanged()) {
         this.detail.valuesManager.setValue('_dataType', "hasOne")
         comp.valuesManager.setValue(item.name, this.detail.valuesManager.getChangedValues());
      }
   },
   createCanvas : function(form, item) {
      this.valuesManager = SmartSFSValuesManager.create({
         autoSynchronize : true,
         dataSource : this.formDataSource
      });

      var D = this;
      this.formDataSource = DataSource.get(item.optionDataSource);

      if (isc.Browser.isDesktop) {
         var cols = Object.keys(D.formDataSource.fields).length > 15 ? 4 : 2;
      } else
         cols = 2;

      cols = cols || 2;
      var addProps = {};
      var cw = [ "15%" ];
      for (var c = 1; c < cols; c++) {
         cw.add("*");
      }

      var formProps = {
         autoDraw : false,
         groupLabelBackgroundColor : "none",
         colWidths : form.colWidths,
         border : App.get.config["smartsfs.detailBorder"],
         isGroup : true,
         groupBorderCSS : App.get.config["smartsfs.detailBorder"],
         margin : 5,
         padding : 10,
         dataSource : this.formDataSource,
         numCols : cols
      };
      if (item.formItemProps) {
         var props = {};
         try {
            for ( var propkey in item.formItemProps) {
               props[propkey] = App._evalPropertyValue(item.formItemProps[propkey]);
            }
         } catch (e) {
            console.log("nezdarilo sa");
         }
         isc.addProperties(formProps, props);
      }
      this.detail = isc.DynamicForm.create(formProps);
      if (this.showGroupTitle)
         this.detail.setGroupTitle(D.title);
      this.detail.valuesManager = SmartSFSValuesManager.create({
         autoSynchronize : true,
         dataSource : this.detail.dataSource
      });
      this.detail.valuesManager.addMember(this.detail);
      this.delayCall("fetchFormData");
      return this.detail;
   }
});

isc.ClassFactory.defineClass("ListGridItem", "CanvasItem").addProperties({
	   showTitle : false,
	   showGroupTitle : true,
	   colSpan : 4,
	   padding : 10,
	   //maxHeight : 350,
	   minHeight : 250,
	   overflow : "inherit",
	   //groupLabelBackgroundColor : "#8fbc95",
	   groupLabelStyleName : "sectionHeaderopened",	   
	   shouldSaveValue : true,	     
	   inTabSet : null,
	   fetchGridItemData : function() {		    
		    var I = this
		   	this.fkId = this.form.getValue(this.formDataSource.getPrimaryKeyFieldName())
			var criteria = {};
		    criteria[this.valueField] = this.fkId;		
			this.gridComp.setRequiredProfile(criteria);		            
			this.gridComp.grid.fetchData(this.gridComp._requiredProfile, function(){
			    var fld = I.gridComp.grid.getFieldByName(I.valueField);
			    I.gridComp.grid.hideField(fld);
			});
	   },
	   createCanvas : function(form, item) {
		      this.valuesManager = SmartSFSValuesManager.create({
		         autoSynchronize : true,
		         dataSource : this.optionDataSource
		      });
		      
		      this.formDataSource = form.dataSource
		      this.inTabSet = this.inTabSet?this.inTabSet:form.formTabset  
			  if (this.inTabSet.mode == "NEW") this.canEdit = false;
			  
			  var I = this
			  
		      var gridProps = {
		    	         autoDraw : false,
		    	         overflow : this.overflow,
		    	         groupLabelBackgroundColor : this.groupLabelBackgroundColor,
		    	         groupLabelStyleName : this.groupLabelStyleName,
		    	         border : App.get.config["smartsfs.detailBorder"],
		    	         isGroup : true,
		    	         padding : 10,
		    	         doAutoFetch : false,
		    	         groupBorderCSS : App.get.config["smartsfs.detailBorder"],
		    	         dataSource : this.valuesManager.dataSource
		    	      };
		      
		      if (item.formItemProps) {
		          var props = {};
		          try {
		             for ( var propkey in item.formItemProps) {
		                props[propkey] = App._evalPropertyValue(item.formItemProps[propkey]);
		             }
		          } catch (e) {
		             console.log("nezdarilo sa");
		          }
		          isc.addProperties(gridProps, props);
		       }
			               
		      // set autoFetch for grid
//		      if (gridProps.dataSource.gridProperties != null) {	    	  
//		    	  var replacement = ',"doAutoFetch":false}';
//		    	  gridProps.dataSource.gridProperties = gridProps.dataSource.gridProperties.replace(/}([^}]*)$/,replacement+'$1');     	  
//		      } else {
//		    	  gridProps.dataSource.gridProperties = '{"doAutoFetch":false}';
//		      }
		      
		      this.valueField = item.foreignKey
		      this.gridComp = isc.GridComponentAny.create(gridProps);
		      this.gridComp.tabBar.hide();
		      
//		      this.gridComp.tabSet = I.form.formTabset
		      
		      this.gridComp.addProperties ({
		            getDetail : function() {
		                var G = this;
		                var req = {};
		                var dtlComp;
		                var gridDS = this.dataSource;
		                if (this.grid.getSelectedRecord()) {
		                    var pkey = this.dataSource.getPrimaryKeyFieldName();
		                    var recId = this.grid.getSelectedRecord()[pkey];
		                    req[pkey] = recId;
		                } else {
		                    return;
		                }
		                //var pe = I.form.parentElement.parentElement.parentElement
		                debugger;
		                App._showDetailByPK(this.dataSource, recId, I.inTabSet, G.type, G.brefField, G.brefValue, G._ownerComp, G);
		                I.gridComp.tabBar.hide();
		            },
		            addRecord : function(isClone) {
	                    App._addRecord(I.gridComp, null, isClone, null, I.inTabSet)               
		            }		            
		      });
		      	            
		      this.delayCall("fetchGridItemData");
		      return this.gridComp;
	   }
});
