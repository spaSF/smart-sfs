//isc.Date.setShortDisplayFormat("toEuropeanShortDate");
//isc.Date.setDefaultDateSeparator(".");
//isc.Date.setNormalDatetimeDisplayFormat("dd.MM.yyyy HH:mm:ss");
//isc.Date.setShortDatetimeDisplayFormat("toEuropeanShortDatetime");
isc.setAutoDraw(false);
Page.registerKey({
   ctrlKey : false,
   keyName : "f2"
}, "return false");
Page.registerKey({
   ctrlKey : false,
   keyName : "f3"
}, "return false");
Page.registerKey({
   ctrlKey : false,
   keyName : "f4"
}, "return false");
Page.registerKey({
   ctrlKey : false,
   keyName : "f5"
}, "return false");
Page.registerKey({
   ctrlKey : false,
   keyName : "f6"
}, "return false");
Page.registerKey({
   ctrlKey : false,
   keyName : "f7"
}, "return false");
Page.registerKey({
   ctrlKey : false,
   keyName : "f8"
}, "return false");
Page.registerKey({
   ctrlKey : false,
   keyName : "f9"
}, "return false");
Page.registerKey({
   ctrlKey : true,
   keyName : "W"
}, "return false");
Page.registerKey({
   ctrlKey : true,
   keyName : "T"
}, "return false");
Page.registerKey({
   ctrlKey : true,
   keyName : "Tab"
}, "return false");
Page.registerKey({
   shiftKey : true,
   ctrlKey : true,
   keyName : "T"
}, "return false");
Page.registerKey({
   altKey : true,
   ctrlKey : false,
   shiftKey : false,
   keyName : "Arrow_Left"
}, "return false");

//musim pridat compare values pre boolean,text lebo na forme je prazdny=undefined a pride ""
isc.SimpleType.getType("boolean").compareValues = function(value1, value2, field) {
   if (value1) {
      if (value2)
         return 0;
      else
         return 1;
   } else {
      if (value2)
         return -1;
      else {
         if (value1 === false) {
            if (value2 === false)
               return 0;
            else
               return -1;
         } else {
            if (value2 === false)
               return 1;
            else
               return 0;
         }
      }
   }
   //		if((value1==undefined||value1==null||value1=="")&&(value2==undefined||value2==null||value2=="")) return 0;
};
isc.SimpleType.getType("text").compareValues = function(value1, value2, field) {
   if ((value1 == undefined || value1 == null || value1 == "") && (value2 == undefined || value2 == null || value2 == ""))
      return 0;
   if (value1 != value2)
      return value1 > value2 ? 1 : -1;
   return 0;
};

//override localeFloat compare
isc.SimpleType.getType("localeFloat").compareValues = function(value1, value2, field) {
   if (value1 == value2) {
      // special case for equal values: if value1 is number
      // and value2 is not, value1 "wins" and vice versa
      var isNumber1 = isc.isA.Number(value1), isNumber2 = isc.isA.Number(value2);

      // only value1 is number
      if (isNumber1 && !isNumber2)
         return -1;

      // only value2 is number
      if (!isNumber1 && isNumber2)
         return 1;

      // values are equal
      return 0;
   }
   //sak nevedia to porovnat
   if ((value1 == null || value1 == "" || value1 === undefined) && (value2 == null || value2 == "" || value2 === undefined))
      return 0;
   // no special rules for non-equal values
   if (value1 > value2) {
      return -1;
   } else {
      return 1;
   }
};

RPCManager.addClassProperties({
   useSimpleHttp : true,
   showPrompt : true,
   promptStyle : 'dialog',
   loginRequired : function(tnum, req, resp) {
      //		App.get.loginUser(true, function() {
      App.get.user.enabled = false;//aby zbehol do relogin
      App.get.loadUser(undefined, undefined, true, function() {
         RPCManager.resendTransaction(tnum);
         //user uspesne prihlaseny - ak isiel cez login dialog a zavolanie urobi destroy logindialogu
         App.get.userLoginSucces();
      });
   },
   handleTransportError : function(transactionNum, status, httpResponseCode, httpResponseText) {
      isc.say(httpResponseText);
   }
});

ListGrid
      .addProperties({
         exportWrapHeaderTitles : true,
         exportHeaderHeights : true,
         exportAlternateRowBGColor : "#d0dff6",
         autoFitWidthApproach : "both",
         autoFitDateFields : "both",
         autoFitTimeFields : "both",
         //	editorKeyDown : function(item, keyName) {
         //		// overide sc bo nefunguje keydown v filter editore
         //		if (isc.Browser.isMoz && item && item.multiple
         //				&& isc.isA.NativeSelectItem(item) && keyName == "Enter") {
         //			item._selectedOnEnterKeydown = item.getValue();
         //		}
         //		if (item.form.grid.isA("RecordEditor")
         //				&& item.form.grid.parentElement.parentElement
         //						.isA("GridComponentAny"))
         //			item.form.grid.parentElement.parentElement.keyDown();
         //	},
         /**
          * @OVERRIDE_SMARTCLIENT override ISC_Core.js aby sme dostali advanced criteria
          */
         fetchRelatedData : function(record, schema, callback, requestProperties) {
            var otherDS = isc.isA.DataSource(schema) ? schema : isc.isA.String(schema) ? isc.DS.get(schema)
                  : isc.isA.Canvas(schema) ? schema.dataSource : null;
            if (!otherDS) {
               this.logWarn("schema not understood: " + this.echoLeaf(schema));
               return;
            }
            var relationship = this.getDataSource().getTreeRelationship(otherDS, null, true), parentIdFields = relationship.parentIdFields, idFields = relationship.idFields;
            // form criteria to find related records
            var criteria = {};
            for (var i = 0; i < parentIdFields.length; i++) {
               criteria[parentIdFields[i]] = record[idFields[i]];
            }

            //prepni na dvanced
            var advancedCriteria = relationship.childDS.convertDataSourceCriteria(criteria);

            this.fetchData(advancedCriteria, callback, requestProperties);
         },
         /**
          * @OVERRIDE_SMARTCLIENT DEPRECATED override ISC_Core.js refreshData - bug na grouped gride s firstRow a endRow pouzity kod z verzie 11.1
          *                       opravene v builde SmartClient_v111p_2019-09-29_PowerEdition
          */
         refreshData_DEPRECATED : function(callback) {
            if (!this.getDataSource()) {
               this.logError("In order to refresh data a dataSource has to be specified for the component '" + this.ID + "'.");
               return;
            }

            var resultSet = this.getData();
            // Handle the grid being grouped
            if (!this.dataObjectSupportsFilter(resultSet))
               resultSet = this.originalData;

            if (resultSet && resultSet.fetchIsPending && resultSet.fetchIsPending()) {
               this.logWarn("A fetch for this component is currently pending, please try again later.");
               return;
            }

            var dataSource = this.getDataSource(), visibleRows = this.getVisibleRows(), selectedState = this.getSelectedState();

            // request one page's worth of data on either side of the current viewport
            var startRow = visibleRows[0] - resultSet.resultSize, endRow = visibleRows[1] + resultSet.resultSize;

            if (startRow < 0) {
               startRow = 0;
            }

            var request = {
               startRow : startRow,
               endRow : endRow,
               sortBy : this.getSort(),
               showPrompt : false,
               componentId : this.getID()
            };

            var context = resultSet.context;
            if (context && context.textMatchStyle)
               request.textMatchStyle = context.textMatchStyle;
            if (context && context.operationId)
               request.operationId = context.operationId;

            if (this.implicitCriteria) {
               request.dbcImplicitCriteria = isc.shallowClone(this.implicitCriteria);
            }

            var oldCriteria = isc.clone(resultSet.getCriteria());
            oldCriteria = isc.DS.compressNestedCriteria(isc.DS.combineCriteria(oldCriteria, isc.shallowClone(this.implicitCriteria)));
            var oldSort = isc.clone(resultSet.getSort());

            dataSource.fetchData(this.getCriteria(), function(dsResponse, data, dsRequest) {
               var d = this.data;
               // Handle the grid being grouped
               if (!this.dataObjectSupportsFilter(d))
                  d = this.originalData;

               var newCriteria = isc.DS.compressNestedCriteria(isc.DS.combineCriteria(d.getCriteria(), d.getImplicitCriteria ? d
                     .getImplicitCriteria() : {}));
               var newSort = d.getSort();
               var criteriaOrSortChanged = d.compareCriteria(newCriteria, oldCriteria) === 0 || d.compareSort ? d.compareSort(newSort, oldSort)
                     : false;

               // If we've reached this point and a fetch is pending on the previous ResultSet then
               // the user has most likely asked for a fetch after refreshData was called. In this
               // case lets abort this refreshData call.
               if (d && d.fetchIsPending && d.fetchIsPending() && criteriaOrSortChanged) {
                  this.logDebug("refreshData aborted as a fetch had been issued while waiting for refreshData to complete.");
                  return;
               }

               var result = dsResponse.data, initialData = [];

               // correctly position the result in the resultset's cache
               initialData.length = dsResponse.totalRows;

               // Copy results
               var start = dsResponse.startRow || 0;
               for (var i = 0; i < result.length; i++) {
                  initialData.set(start + i, result.get(i));
               }

               var resultSetOrTree;
               //	        if (isc.ResultSet && isc.isA.ResultSet(d)) {
               //	            resultSetOrTree = dataSource.getResultSet({
               //	                dataSource: this.getDataSource(),
               //	                initialLength: dsResponse.totalRows,
               //	                initialData: initialData,
               //	                sortSpecifiers: this.getSort(),
               //	                criteria: this.getCriteria(),
               //	                context : d && isc.isA.ResultSet(d) ? d.context : null
               //	            });
               //	        } else if (isc.ResultTree && isc.isA.ResultTree(d)) {
               //	            initialData.length = dsResponse.endRow - dsResponse.startRow;
               //	            resultSetOrTree = isc.ResultTree.create({
               //	                dataSource: this.getDataSource(),
               //	                data: initialData,
               //	                defaultIsFolder: d ? d.defaultIsFolder : null,
               //	                criteria: this.getCriteria(),
               //	                context : d && isc.isA.ResultTree(d) ? d.context : null
               //	            });
               //	        }

               resultSetOrTree = dataSource.getResultSet({
                  dataSource : this.getDataSource(),
                  initialLength : dsResponse.totalRows,
                  initialData : initialData,
                  sortSpecifiers : this.getSort(),
                  criteria : this.getCriteria(),
                  context : this.data && isc.isA.ResultSet(this.data) ? this.data.context : null
               });

               // Lets temporarily enable this component to preserve edits on setData call. This means
               // that if a cell or row edit is in place with an edited value, this value will be retained
               // after the refreshData call has completed.
               var originalPreserveEditsOnSetData = this.preserveEditsOnSetData;
               this.preserveEditsOnSetData = true;
               this.setData(resultSetOrTree);
               this.preserveEditsOnSetData = originalPreserveEditsOnSetData;
               this.setSelectedState(selectedState);

               if (callback) {
                  callback(dsResponse, data, dsRequest);
               }
            }.bind(this), request);
         }
      });

FilterEditorBody.addProperties({
   keyDown : function() {
      debugger;
      return this.parentElement.keyDown();
   }
});

DynamicForm.addProperties({
   errorOrientation : "right",
   itemHoverWidth : "25%",
   /**
    * handle focus z prveho a posledneho focusable itemu, nativne skoci mimo form
    */
   handleFocus : function(blurItem, goBack) {
      // handle navigaciu focusu, lebo robi cpcny
      if (blurItem.hasOwnProperty("fieldPosition") & !this.isSearchForm) {
         var F = this;
         var firstItem = F.items.length + 1;
         var lastItem = -1;
         var thisItem = 0;
         for (var i = 0; i < F.items.length; i++) {
            if (F.items[i].canEdit != false && !F.items[i].disabled) {
               if (i < firstItem)
                  firstItem = i;
               if (i > lastItem)
                  lastItem = i;
            }
            if (F.items[i].fieldPosition == blurItem.fieldPosition)
               thisItem = i;
         }
         if (goBack && thisItem <= firstItem)
            F.focusInItem(F.items[lastItem]);
         if (!goBack && thisItem >= lastItem)
            F.focusInItem(F.items[firstItem]);
         return;

         // var hasNext = false;
         // if (goBack) {
         // for (var i = F.items.length - 1; i >= 0; i--) {
         // if (F.items[i].fieldPosition < blurItem.fieldPosition &&
         // F.items[i].canEdit != false && !F.items[i].disabled) {
         // F.focusInItem(F.items[i]);
         // hasNext = true;
         // break;
         // }
         // }
         // if (!hasNext) {
         // // focus na posledny editovatelny
         // for (var i = (F.items.length - 1); i > blurItem.fieldPosition - 1;
         // i--) {
         // if (F.items[i].canEdit != false && !F.items[i].disabled) {
         // F.focusInItem(F.items[i]);
         // break;
         // }
         // }
         // }
         // } else {
         // for (var i = 0; i < F.items.length; i++) {
         // if (F.items[i].fieldPosition > blurItem.fieldPosition &&
         // F.items[i].canEdit != false && !F.items[i].disabled) {
         // F.focusInItem(F.items[i]);
         // hasNext = true;
         // break;
         // }
         // }
         // if (!hasNext) {
         // // focus na prvy editovatelny
         // for (var i = 0; i < F.items.length; i++) {
         // if (F.items[i].canEdit != false && !F.items[i].disabled) {
         // F.focusInItem(F.items[i]);
         // break;
         // }
         // }
         // }
         // }

      }
   }
});

ClassFactory.defineClass('SmartSFSValuesManager', 'ValuesManager').addProperties({
   /**
    * @OVERRIDE_SMARTCLIENT
    */
   saveData : function() {
      var values = this.getValues();
      var propertiesToSkip = {
         __ref : true,
         __module : true
      };

      for ( var key in values) {

         // Don't touch functions, classes, instances or properties
         // explicitly called out
         // in the proeprtiesToSkip object above
         if (isc.isA.Function(values[key]))
            continue;
         if (propertiesToSkip[key] == true)
            continue;
         if (isc.isAn.Instance(values[key]) || isc.isA.Class(values[key]))
            continue;

         var value = values[key];
         // noNullUpdates nefunguje pre undefined, nastav na null
         if (value == undefined)
            values[key] = null;
      }
      this.setValues(values);
      this.Super("saveData", arguments);
   },
   /**
    * @OVERRIDE_SMARTCLIENT DEPRECATED 11.0 ISC_Core.js porovnanie hodnot fieldu - blbec porovnava aj propertiesOnly opravene v builde
    *                       SmartClient_v111p_2019-09-29_PowerEdition
    */
   fieldValuesAreEqual_DEPRECATED : function(field, value1, value2) {

      if (field != null) {
         //oznacime secky ficurie v datasourcoch, asociacie aj Item objekty ako SpacerItem...
         if (field.propertiesOnly === true)
            return true;

         // if passed field isn't an object, try to find one in fields, completeFields or DS
         if (!isc.isAn.Object(field))
            field = this.getUnderlyingField(field) || field;

         // If this is a 'multiple' field, reach into array values
         if (field.multiple && isc.isAn.Array(value1) && isc.isAn.Array(value2)) {
            if (value1.length != value2.length)
               return false;
            var match = true;
            // This treats a change in order as a meaningful change
            for (var i = 0; i < value1.length; i++) {
               if (!this.fieldValuesAreEqual(field, value1[i], value2[i])) {
                  match = false;
                  break;
               }
            }
            return match;
         }

         if (field.type != null) {
            // If the type is a SimpleType with a compareValues() impl, use that first
            var simpleType = isc.SimpleType.getType(field.type);
            if (simpleType && simpleType.compareValues) {
               return simpleType.compareValues(value1, value2, field) == 0;
            }
            if (isc.SimpleType.inheritsFrom(field.type, "datetime")) {
               if (isc.isA.Date(value1) && isc.isA.Date(value2)) {
                  return (Date.compareDates(value1, value2) == 0);
               }
            } else if (isc.SimpleType.inheritsFrom(field.type, "date")) {
               if (isc.isA.Date(value1) && isc.isA.Date(value2)) {
                  return (Date.compareLogicalDates(value1, value2) == 0);
               }

            } else if (field.type == "valueMap") {
               if (isc.isAn.Array(value1) && isc.isAn.Array(value2)) {
                  return value1.equals(value2)

               } else if (isc.isAn.Object(value1) && isc.isAn.Object(value2)) {
                  for ( var i in value1) {
                     if (value2[i] != value1[i])
                        return false;
                  }

                  for ( var j in value2) {
                     if (value1[j] != value2[j])
                        return false;
                  }

                  // everything matched
                  return true;
               }
            }
         }
      }

      if (!isc.isAn.Object(field)) {
         // If no field was detected and both values are Date instances, compare them according
         // to whether they are logical dates or times, or do a basic millisecond comparison
         // otherwise.  If this behavior misfires for whatever reason, the developer should
         // provide a field.
         if (isc.isA.Date(value1) && isc.isA.Date(value2)) {
            if (value1.logicalDate || value2.logicalDate)
               return isc.Date.compareLogicalDates(value1, value2) == 0;
            else if (value1.logicalTime || value2.logicalTime)
               return isc.Time.compareLogicalTimes(value1, value2) == 0;
            else
               return value1.getTime() == value2.getTime();
         }
      }

      // no matter what the type, if we get this far, the field type had no custom comparison
      // mechanism - just rely on the "==" comparison

      if (value1 == value2)
         return true;
      //nic=nic
      if ((value1 == null || value1 == "" || value1 === undefined) && (value2 == null || value2 == "" || value2 === undefined))
         return true;
      //prazdny object bez fieldu=>nejaka entity,ktorej fieldy su mapovane v DS zvlast,asi su to aj enumeracie, ale to je jedno
      if (field == null && (isc.isAn.Object(value1) || isc.isAn.Object(value2))) {
         //su oba objekty prazdne - ok
         if (isA.emptyObject(value1) && isA.emptyObject(value2))
            return true;
         //je jeden z nich undefined - ok
         if (value1 == undefined || value2 == undefined)
            return true;
         //kedze sa nedaju editovat, staci aku rovnakeho classu
         if (value1["class"] && value2["class"] && value1["class"] == value2["class"])
            return true;
      }
      // return false
      return false;
   }
});

isc.EventHandler.addClassProperties({
   /**
    * @OVERRIDE_SMARTCLIENT ISC_Core line 47580 ver.11.1
    */
   _handleTouchEnd : function(DOMevent) {
      debugger;
      var EH = isc.EH;

      EH.DOMevent = DOMevent;
      var event = EH.getMouseEventProperties(DOMevent);

      if (EH.eventHandledNatively(DOMevent.type, DOMevent.target))
         return EH._handledNativelyReturnVal;

      // maintain touch state for synthetic mouseDown/mouseUp
      if (EH._handledTouch == EH._touchEventStatus.TOUCH_STARTED) {
         EH._handledTouch = EH._touchEventStatus.TOUCH_ENDING;
      }

      var returnValue = EH.handleEvent(event.target, EH.TOUCH_END);
      if (returnValue !== false) {
         event.originalType = EH.TOUCH_END;
         event.eventType = EH.MOUSE_UP;
         EH._handleMouseUp(DOMevent, true);
      }

      if (EH._handledTouch == EH._touchEventStatus.TOUCH_ENDING) {
         EH._handledTouch = EH._touchEventStatus.TOUCH_COMPLETE;
      }

      if (EH._longTouchTimer != null) {
         isc.Timer.clear(EH._longTouchTimer);
         EH._longTouchTimer = null;
      }

      var targetElem = (DOMevent.target && (DOMevent.target.nodeType == 1 ? DOMevent.target : DOMevent.target.parentElement));
      //      if (!EH._shouldIgnoreTargetElem(targetElem)) {
      //         DOMevent.preventDefault();
      //         return false;
      //      }
      if (!EH._shouldIgnoreTargetElem(targetElem)) {
         if (DOMevent.cancelable) {
            DOMevent.preventDefault();
            DOMevent.stopPropagation();
            swiping = true;
            return false;
         }
      }
   },
   $77r : function(DOMevent) {
      return this._handleTouchEnd(DOMevent);
   }
});

// doplnena metoda do prorotypu Stringu pre nahradenie argumentu message {1} a
// pod za vstupne argumenty
String.prototype.messageArgs = function() {
   var args = arguments;

   return this.replace(/\{(\d+)\}/g, function() {
      return args[arguments[1]];
   });
};
//metoda string na boolean
//true ak toLowerCase()="true"
//false ak toLowerCase()="false"
//inak undefined
String.prototype.toBoolean = function() {
   if (this.toLowerCase() == "true")
      return true;
   else if (this.toLowerCase() == "false")
      return false;
   else
      return undefined;
}
