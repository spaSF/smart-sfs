ClassFactory
      .defineClass('SmartCalendarTemplate', 'SmartTabSet')
      .addClassProperties(
            {
               dateIsWorkDaySK : function(testDate,lane) {
                  var rok = testDate.getFullYear();
                  var mesiac = testDate.getMonth();
                  var denMesiaca = testDate.getDate();
                  var testString = mesiac + "," + denMesiaca;
                  //key v tvare month,day
                  var holidaysByDate = [ "0,1",//1.jan.
                  "0,6",//6.jan.
                  "4,1",//1.maj
                  "4,8",//8.maj
                  "6,5",//5.jul
                  "7,29",//29.aug
                  "8,1",//1.sep
                  "8,15",//15.sep
                  "10,1",//1.nov
                  "10,17",//17.nov
                  "11,24",//24.dec
                  "11,25",//25.dec
                  "11,26"//25.dec
                  ];
                  //velka noc podla https://sk.wikipedia.org/wiki/V%C3%BDpo%C4%8Det_d%C3%A1tumu_Ve%C4%BEkej_noci
                  var a = rok % 19;
                  var b = rok % 4;
                  var c = rok % 7;
                  var m = 24;
                  var n = 5;
                  var d = (19 * a + m) % 30;
                  var e = (n + 2 * b + 4 * c + 6 * d) % 7;
                  var marecNedela = 22 + d + e;
                  var aprilNedela = d + e - 9;
                  var VCNedela = marecNedela <= 31 ? DateUtil.createLogicalDate(rok, 2, marecNedela) : (aprilNedela > 25 ? DateUtil
                        .createLogicalDate(rok, 3, aprilNedela - 7) : DateUtil.createLogicalDate(rok, 3, aprilNedela));
                  var VCPiatok = new Date(VCNedela);
                  VCPiatok.setDate(VCNedela.getDate() - 2);
                  var VCPondelok = new Date(VCNedela);
                  VCPondelok.setDate(VCNedela.getDate() + 1);
                  //check date
                  if (holidaysByDate.contains(testString))
                     return false;
                  if (DateUtil.compareLogicalDates(VCPiatok, testDate) == 0 || DateUtil.compareLogicalDates(VCPondelok, testDate) == 0)
                     return false;
                  if (testDate.getDay() == 0 || testDate.getDay() == 6)
                     return false;
                  return true;
               }
            })
      .addProperties(
            {
               height : "100%",
               width : "100%",
               overflow : "hidden",
               dataSource : null,
               parentDataSource : null,
               type : "normal", //este neviem
               mode : "", // mode este neviem
               tabSet : null, // vstupny tabSet aby vedel zavriet
               _myTabName : null,//tabName tabu v tabSet-e, kde je umiestneny component
               _detailCanvas : null,
               _calendar : null,
               keyDown : function() {
                  var key = isc.EventHandler.getKey();
                  var bubble = true;
                  var C = this;
                  if (((key == "Q") && (isc.EventHandler.ctrlKeyDown())) || (key == "Escape")) {
                     C.cancel(function(closed, C) {
                        bubble = !closed;
                     });
                  }
                  if (((key == "F") && (isc.EventHandler.ctrlKeyDown())) || (key == "f4")) {
                     C.doFilter();
                     bubble = false;
                  };
                  if (((key == "R") && (isc.EventHandler.ctrlKeyDown())) || (key == "f5")) {
                     C.reload();
                     bubble = false;
                  };
                  return bubble;
               },
               _customCalProps : function() {
                  var C = this;
                  C._addCalProps = {};
                  if (C.dataSource.formProperties != null) {
                     var props = isA.String(C.dataSource.formProperties) ? isc.JSON.decode(C.dataSource.formProperties) : C.dataSource.formProperties;
                     for ( var propkey in props) {
                        C._addCalProps[propkey] = App._evalPropertyValue(props[propkey]);
                     }
                  }

               },
               _createCalendar : function() {
                  var C = this;
                  //najdi custom fields v datasource
                  if (!isA.emptyObject(C._addCalProps)) {
                     if (C._addCalProps.hasOwnProperty("eventDialogFields")) {
                        var flds = [];
                        for (var f = 0; f < C._addCalProps.eventDialogFields.length; f++) {
                           var fld = isc.addProperties({}, C.dataSource.getField(C._addCalProps.eventDialogFields[f].name));
                           flds.add(fld);
                        }
                        C._addCalProps.eventDialogFields = flds;
                     } else {
                        C._addCalProps.eventDialogFields = [];
                     }
                  }else {
                     C._addCalProps.eventDialogFields = [];
                  }
                  C._addCalProps.eventDialogFields.addAt({
                     name : "name",
                     required : true
                  }, 0);
                  C._addCalProps.eventDialogFields
                        .add({
                           name : "details",
                           type : "button",
                           click : function(form, item) {
                              var cal = form.calendar, isNew = cal.eventDialog.isNewEvent, event = cal.eventDialog.event || {}, sdate = cal.eventDialog.currentStart, edate = cal.eventDialog.currentEnd, lane = null, sublane = null, initVals = form
                                    .getValues();
                              if (isNew) {
                                 C.addRecord(initVals);
                              } else {
                                 var customValues = isc.addProperties({}, form.getCustomValues());
                                 if (!form.validate())
                                    return;
                                 cal._fromEventDialog = true;
                                 var newEvent = cal.createEventObject(event, sdate, edate, lane, sublane, form.getValue(cal.nameField));
                                 var _this = this;
                                 var updatedRecord = cal.getCleanEventRecord(isc.addProperties({}, newEvent, customValues));
                                 C.dataSource.updateData(updatedRecord, function(dsResponse, data, dsRequest) {
                                    cal.processSaveResponse(dsResponse, data, dsRequest, event);
                                    C.getDetail(event);
                                 }, {
                                    oldValues : event,
                                    componentId : this.ID,
                                    willHandleError : true
                                 });
                              }

                           }
                        });
                  C._calendar = isc.Calendar.create(isc.addProperties({}, {
                     dataSource : C.dataSource,
                     currentViewName : "day",
                     autoFetchData : true,
                     timeFormatter : "toShortPadded24HourTime",
                     addEventButtonProperties : {
                        click : function() {
                           C.addRecord();
                        }
                     },
                     keyDown : function() {
                        return C.keyDown();
                     },
                     dateIsWorkday : SmartCalendarTemplate.dateIsWorkDaySK,
                     shouldDisableDate : function(date,view){
                       return (this.showWorkday&&!this.dateIsWorkday(date));
                     },
                     eventClick : function(event, view){
                        if(view=="month") {
                           C.getDetail(event);
                           return false;
                        }
                        return true;
                     }
                  }, C._addCalProps));
                  C._calendar.controlsBar.addMember(C._btnAdvFilter);
                  C._calendar.controlsBar.addMember(C._btnClearFilter);
                  C._btnReload = btnRel.create({
                     dataComp : C
                  }).addProperties({
                     click : function() {
                        this.dataComp.reload();
                     }
                  });
                  C._calendar.controlsBar.addMember(C._btnReload);
                  return C._calendar;
               },
               _createFilter : function() {
                  var C = this;
                  C._advFilter = isc.FilterBuilder.create({
                     dataSource : C.dataSource,
                     keyDown : function() {
                        return C.keyDown();
                     }
                  });
                  C._btnAdvFilter = advFiltRun.create({
                     dataComp : C
                  }).addProperties({
                     click : function() {
                        this.dataComp.doFilter();
                     }
                  });
                  C._btnClearFilter = clrFilt.create({
                     dataComp : C
                  }).addProperties({
                     click : function() {
                        this.dataComp.clearFilter();
                     }
                  });
                  return C._advFilter;
               },
               _drawLayout : function() {
                  var C = this;
                  C._detailCanvas.addMember(C._createFilter());
                  C._detailCanvas.addMember(C._createCalendar());
                  C.addTab({
                     tabSelected : function(tabSet, tabNum, tabPane, ID, tab, name) {
                        C.delayCall("focusInside");
                     },
                     title : C.dataSource.title,
                     pane : C._detailCanvas,
                     canClose : false
                  });
               },
               afterFilterFetch : function(data) {

               },
               clearFilter : function() {
                  var C = this;
                  C._advFilter.clearCriteria();
                  C.doFilter();
               },
               doFilter : function() {
                  var C = this;
                  C._calendar.fetchData(C._advFilter.getCriteria(), function(dsResp, data) {
                     C._calendar.getSelectedView().rebuild();
                     C.afterFilterFetch(data);
                  });
               },
               reload : function() {
                  var C = this;
                  if (C._calendar.getSelectedView().isDrawn())
                     C._calendar.getSelectedView().rebuild();
               },
               cancel : function(cbk, tab) {
                  var C = this;
                  var closeFn = function(val) {
                     if (val) {
                        C.resetTabEdit(0, true);
                        C.tabSet.removeTab(tab ? tab : C._myTabName);
                        C.destroy();
                        C = null;
                     }
                     if (cbk)
                        cbk(val);
                  }
                  closeFn(true);
               },
               addRecord : function(initVals) {
                  var C = this;
                  App._addRecord(C, null, false, initVals);
               },
               getDetail : function(event) {
                  var C = this;
                  if (!isA.emptyObject(event)) {
                     if (C._dynamicGridBar)
                        C._showTabBar();
                     var pkey = C.dataSource.getPrimaryKeyFieldName();
                     var recId = event[pkey];
                  } else {
                     return;
                  }
                  App._showDetailByPK(C.dataSource, recId, C, C.type, null, null, null, C);
               },
               focusInside : function() {
                  var C = this;
                  var view = C._calendar.getSelectedView();
                  if (view.getBody())
                     view.focusInRow(0);
               },
               dateIsWorkDaySK : function(testDate) {
                  var rok = testDate.getFullYear();
                  var mesiac = testDate.getMonth();
                  var denMesiaca = testDate.getDate();
                  var testString = mesiac + "," + denMesiaca;
                  //key v tvare month,day
                  var holidaysByDate = [ "0,1",//1.jan.
                  "0,6",//6.jan.
                  "4,1",//1.maj
                  "4,8",//8.maj
                  "6,5",//5.jul
                  "7,29",//29.aug
                  "8,1",//1.sep
                  "8,15",//15.sep
                  "10,1",//1.nov
                  "10,17",//17.nov
                  "11,24",//24.dec
                  "11,25",//25.dec
                  "11,26"//25.dec
                  ];
                  //velka noc podla https://sk.wikipedia.org/wiki/V%C3%BDpo%C4%8Det_d%C3%A1tumu_Ve%C4%BEkej_noci
                  var a = rok % 19;
                  var b = rok % 4;
                  var c = rok % 7;
                  var m = 24;
                  var n = 5;
                  var d = (19 * a + m) % 30;
                  var e = (n + 2 * b + 4 * c + 6 * d) % 7;
                  var marecNedela = 22 + d + e;
                  var aprilNedela = d + e - 9;
                  var VCNedela = marecNedela <= 31 ? DateUtil.createLogicalDate(rok, 2, marecNedela) : (aprilNedela > 25 ? DateUtil
                        .createLogicalDate(rok, 3, aprilNedela - 7) : DateUtil.createLogicalDate(rok, 3, aprilNedela));
                  var VCPiatok = new Date(VCNedela);
                  VCPiatok.setDate(VCNedela.getDate() - 2);
                  var VCPondelok = new Date(VCNedela);
                  VCPondelok.setDate(VCNedela.getDate() + 1);
                  //check date
                  if (holidaysByDate.contains(testString))
                     return false;
                  if (DateUtil.compareLogicalDates(VCPiatok, testDate) == 0 || DateUtil.compareLogicalDates(VCPondelok, testDate) == 0)
                     return false;
                  if (testDate.getDay() == 0 || testDate.getDay() == 6)
                     return false;
                  return true;
               },
               initWidget : function() {
                  var C = this;
                  C.Super("initWidget", arguments);
                  C._detailCanvas = VLayout.create({
                     height : "100%",
                     width : "100%",
                     dataSource : "",
                     overflow : "visible"
                  });
                  C._customCalProps();
                  C._drawLayout();
               }
            });