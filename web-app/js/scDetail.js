//template detail componentu
//pre customizaciu override lubovolne metody
//musis overidnut fciu "drawComponent" postupnostou:
//				1. D._createForm(cols); .... vytvorenie .detail=dynamicForm
//				2.D._createToolBar();	.... vytvorenie toolBar
//				3.D._setValuesByMode();	.... nastavenie podla .mode (override)
//				4.D._drawLayout();		.... vytvorenie layoutu s detail Form + pre asociacie 1:N [optional]
ClassFactory.defineClass('DetailComponentTemplate', 'SmartTabSet').addProperties(
        {
            height : "100%",
            width : "100%",
            overflow : "hidden",
            dataSource : null,
            parentDataSource : null,
            type : "", //normal/agrmany/bref/
            mode : "EDIT_BY_PK", // mode NEW,EDIT_RECORD,EDIT_BY_PK
            initialValues : {}, // inicializacia pre newRecord/edit existujuci
            // record
            tabSet : null, // vstupny tabSet aby vedel zavriet
            _myTabName : null,//tabName tabu v tabSet-e, kde je umiestneny component
            brefField : "",// meno back ref fieldu pre asociacny detail
            brefValue : null, // value back ref fieldu pre asociacny detail
            toTabSet : null,
            _detailCanvas : null,
            //            _tabSet : null, // tabSet detail componentu v pripade asociacnych
            // gridov
            _asocGrids : [],
            _asocLayout : null,
            _pkCrit : {},
            _instanceID : null,
            _canSwitchLayout : true, // moze prepnut layout SECTION/TABSET
            _hasAsocFields : false, // dataSource obsahuje asociacie
            _ownerComp : null,
            _fromGridCom : null, // grid z ktoreho prisiel detail
            _layoutDrawn : false, //bude true po drawLayout
            //EVENTS triggre componentu
            dataSaved : function(isAccept, data) {
                //trigger po save, data=vratene v ds callbacku, 
                //user defined v override komponentu alebo vo form props datasource
                //defaults odstranenie app tabu
                if (isAccept === true) {
                    this.resetTabEdit(0, true);
                    this.tabSet.removeTab(this._myTabName);
                }
                if (isA.Function(this.detail.dataSaved))
                    this.detail.dataSaved(data);
            },
            dataRemoved : function(data) {
                //trigger po save, data=vratene v ds callbacku, 
                //user defined v override komponentu alebo vo form props datasource
                //defaults odstranenie app tabu
                this.resetTabEdit(0, true);
                this.tabSet.removeTab(this._myTabName);
                if (isA.Function(this.detail.dataRemoved))
                    this.detail.dataRemoved(data);
            },
            dataReloaded : function(data) {
                //trigger po reloade, data=vratene v ds callbacku z fetchData, 
                //user defined v override komponentu alebo vo form props datasource
                if (isA.Function(this.detail.dataReloaded))
                    this.detail.dataReloaded(data);
            },
            dataInitialized : function(data) {
                //trigger po inicializacii detail recordu, data=vratene v ds callbacku z fetchData, 
                //user defined v override komponentu alebo vo form props datasource
                if (isA.Function(this.detail.dataInitialized))
                    this.detail.dataInitialized(data);
            },
            afterDrawDetail : function() {
                //trigger observe po draw detail formu
                this._autoHideTabBar();
                //user defined v override komponentu alebo vo form props datasource
                if (isA.Function(this.detail.afterDrawDetail))
                    this.detail.afterDrawDetail();
            },
            keyDown : function() {
                // console.log("detail KEY DOWN:" + isc.Event.getKey());
                var key = isc.EventHandler.getKey();
                var retbul;
                if (((key == "Q") && (isc.EventHandler.ctrlKeyDown())) || (key == "Escape")) {
                    this.cancel();
                    retbul = false;
                };
                if (((key == "R") && (isc.EventHandler.ctrlKeyDown())) || (key == "f5")) {
                    this.reload();
                    retbul = false;
                };
                if (((key == "A") && (isc.EventHandler.ctrlKeyDown())) || (key == "f2")) {
                    if (this.toolBar._btnAccept && !(this.toolBar._btnAccept.isDisabled()))
                        this.accept();
                    retbul = false;
                };
                if (((key == "E") && (isc.EventHandler.ctrlKeyDown())) || (key == "f6")) {
                    if (this.toolBar._btnEdit && !(this.toolBar._btnEdit.isDisabled()))
                        this.edit();
                    retbul = false;
                };
                if (((key == "S") && (isc.EventHandler.ctrlKeyDown())) || (key == "f3")) {
                    if (this.toolBar._btnSave && !(this.toolBar._btnSave.isDisabled()))
                        this.save();
                    retbul = false;
                };
                if (((key == "K") && (isc.EventHandler.ctrlKeyDown())) || (key == "f4")) {
                    if ((this.detail._cloneSupport || this.dataSource._cloneSupport) && this.toolBar._btnClone
                            && !(this.toolBar._btnClone.isDisabled()))
                        this.clone();
                    retbul = false;
                };
                return retbul;
            },
            _handleSmartFileCanvas : function(editable) {
                // var smartFile = this.detail.items.find({
                //     editorType : "SmartFileItem"
                // });
                // if (smartFile) {
                //     smartFile.handleSmartView(editable, this.valuesManager.getValue(smartFile.name));
                // }
                var D = this;
                this.detail.items.filter(function(item){return item.isA("SmartFileItem");}).forEach(
                    function(smartFile){
                        smartFile.handleSmartView(editable, D.valuesManager.getValue(smartFile.name));
                    }
                );
            },
            _hasUploadItem : function() {
                // iba pre save
                for (var f = 0; f < this.detail.items.length; f++) {
                    var item = this.detail.items[f];
                    if (item.isA("UploadItem") || (item.isA("SmartFileItem") && item.canvas.items ? item.canvas.items[0].isA("UploadItem") : false)) {
                        console.log(item.isA("UploadItem") ? item._value : item.canvas.items[0]._value);
                        if (item.isA("UploadItem") ? item._value : item.canvas.items[0]._value) {
                            return true;
                        } else {
                            this._handleSmartFileCanvas(false);// musim ho dat na
                            // readonly inak robi
                            // capaciny
                            return false;
                        }
                    }
                }
                return false;
            },
            componentOnTabID : function() {
                return this.getID();
            },
            focusInside : function() {
                //ak uz bol vytvoreny komponent a nejaky item ma focus, vrat ho tam
                var itm = this.detail.getFocusItem();
                if (itm && (this.showTabBar === false || this.getSelectedTabNumber() == 0)) {
                    //opakovany focus inside
                    this.detail.focusInItem(itm);
                } else {
                    //prvy focus inside
                    if (this.showTabBar === false || this.getSelectedTabNumber() == 0) {
                        //je v master [zalozke/cistom detaile] detailu
                        if (this.detail.canEdit == true) {
                            //edit mod novy alebo edit existujuci=>focus do canEdit&canFocus
                            itm = this.detail.items.find({
                                canFocus : true,
                                canEdit : true
                            }) || this.detail.items.find({
                                canFocus : true,
                                canEdit : null
                            }) || this.detail.items.find({
                                canFocus : null,
                                canEdit : true
                            }) || this.detail.items.find({
                                canFocus : null,
                                canEdit : null
                            });
                        } else {
                            //no edit mod=>staci canFocus
                            itm = this.detail.items.find({
                                canFocus : true
                            }) || this.detail.items.find({
                                canFocus : null
                            });
                        }
                        this.detail.focusInItem(itm);
                    } else {
                        //iny tab v TabSete focus
                        this.Super("focusInside");
                    }
                }
            },
            setCanEdit : function(editable) {
                this.detail.setCanEdit(editable);
                this._handleSmartFileCanvas(editable);
                this.delayCall("focusInside");
                if (editable === true) {
                    this.setTabEdit(0);
                } else {
                    this.resetTabEdit(0);
                }

            },
            edit : function() {
                this.dataSource.setFieldAccess("edit", this.detail);
                this.setCanEdit(true);
                this.toolBar.setIcons("edit");
            },
            // SAVE HasOne
            _saveHasOne : function() {
                for ( var fname in this.dataSource.fields) {
                	var fld = this.dataSource.getField(fname)
                	var item = this.detail.getItem(fname)
                    if (fld.editorType == "DetailHasOneItem") {
                    	item.save(this,item);     
                    }
                }
            },
            // SAVE metod
            _save : function(close) {
            	this._saveHasOne();      
                if (this.valuesManager.valuesHaveChanged()) {
                    var D = this;
                    var operType = this.valuesManager.saveOperationType;

                    var saveCbk = function(resp, data) {
                        if (D.dataSource.handleError(resp)) {
                            var respp = {
                                operationType : operType,
                                data : isA.Array(data) ? data : [ data ]
                            };
                            if (!close)
                                D.toolBar.setIcons("save");
                            if (D._hasUploadItem()) {
                                // musi urobit record z objektu kvoli xpath
                                respp.data = D.dataSource.recordsFromObjects(data);
                                D.dataSource.updateCaches(respp);
                                D._handleSmartFileCanvas(false);// inak sa nesetne
                                // object value
                                D.valuesManager.setValues(data);
                            }
                            if (D.parentDataSource)
                                D.parentDataSource.updateCaches(respp);
                            if (operType == "add") {
                                var fname = D.dataSource.getPrimaryKeyFieldName();
                                var mid = D.valuesManager.getValue(fname);
                                D.tabSet.setTabProperties(D._myTabName, {
                                    name : "_tabDetail_" + D.dataSource.ID + '_' + mid,
                                    title : D.dataSource.title + '[' + D.valuesManager.getValue(D.dataSource.titleField) + ']'
                                });
                                D._myTabName = "_tabDetail_" + D.dataSource.ID + '_' + mid;
                                D.valuesManager.setSaveOperationType("update");
                                D.mode = "EDIT_RECORD";
                                D._pkCrit[D.dataSource.getPrimaryKeyFieldName()] = mid;
                                D._instanceID = mid
                                if (D._asocGrids) {
                                    for (var i = 0; i < D._asocGrids.length; i++) {
                                        D._asocGrids[i].brefValue = D._asocGrids[i].brefValField ? D.valuesManager
                                                .getValue(D._asocGrids[i].brefValField) : D._instanceID;
                                        var rq = {};
                                        rq[D._asocGrids[i].brefField] = D._asocGrids[i].brefValue;
                                        D._asocGrids[i].setRequiredProfile(rq);
                                    }
                                }
                                if (D.showTabBar) {
                                    for (var t = 1; t < D.tabs.length; t++) {
                                        D.enableTab(t);
                                    }
                                }
                                for ( var fname in D.dataSource.fields) {
                                    if (D.dataSource.fields[fname].type == "ListGridItem") 
                                    		D.detail.getField(fname).setCanEdit(D.dataSource.fields[fname].canEdit);                                   	
                                    }                                 
                            }
                            D.setCanEdit(false);
                            //fire dataSaved event
                            D.dataSaved(close, respp.data);
                        }
                    }
                    if (D.valuesManager.validate()) {
                        if (D._hasUploadItem()) {
                            D.dataSource.uploadFileToIframe(D.valuesManager, (operType == "add" ? D.dataSource.addDataURL
                                    : D.dataSource.updateDataURL), saveCbk);
                        } else {
                            D.valuesManager.saveData(saveCbk);
                        }

                    }
                } else {
                    isc.say(isc.i18nMessages['smartsfs.save.nochange'])
                }
            },
            save : function() {
                this._save(false);
            },
            accept : function() {
                this._save(true);
            },
            cancel : function(cbk, tab) {
                var D = this;
                var closeFn = function(val) {
                    if (val) {
                        D.resetTabEdit(0, true);
                        D.tabSet.removeTab(tab ? tab : D._myTabName);
                        D.destroy();
                        D = null;
                    }
                    if (cbk)
                        cbk(val);
                }
                if ((!this.toolBar._btnSave.isDisabled() && this.valuesManager.valuesHaveChanged())||D._hasAnyTabEdit()) {
                    isc.ask(isc.i18nMessages['smartsfs.edit.cancel'], closeFn);
                } else {
                    closeFn(true);
                }
            },
            remove : function() {
                var D = this;
                var closeFn = function(val) {
                    if (val) {
                        D.valuesManager.setSaveOperationType("remove");
                        D.valuesManager.saveData(function(resp, data) {
                            var respp = {
                                operationType : "remove",
                                data : isA.Array(data) ? data : [ data ]
                            };
                            if (D.parentDataSource)
                                D.parentDataSource.updateCaches(respp);
                            D.valuesManager.dataSource.updateCaches(respp);
                            D.dataRemoved(respp.data);
                        });
                    }
                }
                isc.ask(isc.i18nMessages["default.button.delete.confirm.message"], closeFn);
            },
            reload : function(cbk) {
                var D = this;
                var relFn = function(letsGo) {
                    if (letsGo) {
                        if (D.valuesManager.saveOperationType == "add") {
                            D.valuesManager.setValues(D.valuesManager.getOldValues());
                            if (isc.isA.Function(cbk))
                                cbk();
                        } else {
                            D.valuesManager.fetchData(D._pkCrit, function(dsResponse, data) {
                                if (D._asocGrids) {
                                    for (var i = 0; i < D._asocGrids.length; i++) {
                                        D._asocGrids[i].reload();
                                    }
                                }
                                D.toolBar.setIcons("reload");
                                D.setCanEdit(false);
                                //fire user event
                                D.dataReloaded(data);

                                if (isc.isA.Function(cbk))
                                    cbk();
                            });
                        }
                    } else {
                        if (isc.isA.Function(cbk))
                            cbk();
                    }
                };
                if (!this.toolBar._btnSave.isDisabled() && this.valuesManager.valuesHaveChanged()) {
                    isc.ask(isc.i18nMessages["default.reload.confirm.message"], relFn);
                } else {
                    relFn(true);
                }
            },
            addRecord : function(isClone) {
                var G = this;
                switch (this.type) {
                case "bref":
                    this._addBackRef();
                    break;
                case "manyToMany":
                    this._addManyToMany();

                    break;

                default:
                    App._addRecord(G, null, isClone, null, G.toTabSet)

                }
            },
            clone : function() {
                debugger;
                var D = this;
                var DV = D.detail.valuesManager.getValues()
                this.addRecord(true)
            },
            createAsocTab : function(asocField) {
                var D = this;
                App.getDataSource(asocField.optionDataSource, function(getDS) {
                    if (getDS) {
                        // brefValue moze byt aj z valueFieldu asociacie
                        var asocBrefVal = D._instanceID;
                        var asocBrefValFld = D.dataSource.getPrimaryKeyFieldName();
                        if (asocField.valueField) {
                            asocBrefVal = D.valuesManager.getValue(asocField.valueField);
                            asocBrefValFld = asocField.valueField;
                        }
                        var grid = isc.GridComponentAny.create({
                            dataSource : getDS,
                            type : asocField.type,
                            brefField : asocField.foreignKey,
                            brefValue : asocBrefVal,
                            brefValField : asocBrefValFld,
                            //                     tabSet : asocTabSet,
                            tabSet : D,
                            _myTabName : "_asocGrid_" + getDS.ID,
                            initialSort : asocField.initialSort,
                            canFilter : asocField.canFilter,
                            _gridTitle : asocField.title,
                            _ownerComp : D
                        });
                        D._asocGrids.push(grid);
                        if (D._asocLayout == "SECTION") {
                            var sectionName = "_asocGridsection_" + getDS.ID;
                            D._sectionStack.addSection({
                                name : sectionName,
                                title : asocField.title,
                                _titleEdit : "<div style=\"color:" + (App.get.config["smartsfs.tabcolor.edit"] || "red") + ";\">" + asocField.title
                                        + "</div>",
                                _titleNormal : asocField.title,
                                expanded : true,
                                resizeable : true,
                                items : [ grid ]
                            });
                            grid._mySection = D._sectionStack.getSectionHeader(D._sectionStack.getSectionNumber(sectionName));
                            D._sectionStack.collapseSection(sectionName);
                        } else {
                            D.addTab({
                                tabSelected : function(tabSet, tabNum, tabPane, ID, tab, name) {
                                  grid.delayCall("focusInside");
                                },
                                name : "_asocGrid_" + getDS.ID,
                                title : asocField.title,
                                pane : grid,
                                canClose : false,
                                disabled : D.mode == "NEW"
                            });
                        }
                    }
                });
            },
            printPdf : function() {
                if (this.detail.printPdf != undefined && isA.Function(this.detail.printPdf)) {
                    this.detail.printPdf(this);
                } else {
                    var D = this;
                    isc.RPCManager.exportContent(this, {
                        skinName : App.get.config["smartsfs.skin"],
                        pdfName : D.dataSource.ID,
                        exportCSS : "@page {size: A4 landscape; }"
                    });
                }
            },
            switchLayout : function() {
                var D = this;
                switch (D._asocLayout) {
                case "TABSET":
                    var gridAsTabset = App.get.config["smartsfs.tabset.gridTabSet"].toString().toBoolean();
                    D._sectionStack = isc.SectionStack.create(isc.addProperties({},{
                        height : "100%",
                        width : "100%",
                        overflow : "auto",
                        visibilityMode : "multiple"
                    },D.dataSource.getFormProperties(D)["sectionStackProperties"]));
                    if (D.detail.canEdit === true)
                        D.delayCall("setTabEdit", 0);
                    D.updateTab(0, D._sectionStack); // hodi hidden pane
                    D._sectionStack.addSection({
                        name : 'section_detail',
                        title : D.dataSource.title,
                        _titleEdit : "<div style=\"color:" + (App.get.config["smartsfs.tabcolor.edit"] || "red") + ";\">" + D.dataSource.title
                                + "</div>",
                        _titleNormal : D.dataSource.title,
                        expanded : false,
                        resizeable : true,
                        items : [ D._detailCanvas ]
                    });
                    D._mySection = D._sectionStack.getSectionHeader(D._sectionStack.getSectionNumber("section_detail"));

                    for (var i = 0; i < D._asocGrids.length; i++) {
                        D.selectTab("_asocGrid_" + D._asocGrids[i].dataSource.ID);
                        var tbObj = D.getTabObject("_asocGrid_" + D._asocGrids[i].dataSource.ID);
                        D.updateTab(tbObj, null); // pane to null and hidden
                        D.removeTab(tbObj);
                        //                        D._asocGrids[i]._showTabBar();
                        var sectionName = "_asocGridsection_" + D._asocGrids[i].dataSource.ID;
                        if(D._asocGrids[i]._gridTabSet===false){
                           D._asocGrids[i].toTabSet = D._asocGrids[i].toTabSet==D._asocGrids[i].tabSet?D._asocGrids[i]:D._asocGrids[i].toTabSet;
                        }
                        D._asocGrids[i]._gridTabSet=true;
                        D._asocGrids[i]._showTabBar();
                        D._sectionStack.addSection({
                            name : sectionName,
                            title : D._asocGrids[i]._gridTitle,
                            _titleEdit : "<div style=\"color:" + (App.get.config["smartsfs.tabcolor.edit"] || "red") + ";\">"
                                    + D._asocGrids[i]._gridTitle + "</div>",
                            _titleNormal : D._asocGrids[i]._gridTitle,
                            expanded : true,
                            resizeable : true,
                            items : [ D._asocGrids[i] ]
                        });
                        D._asocGrids[i]._mySection = D._sectionStack.getSectionHeader(D._sectionStack.getSectionNumber(sectionName));
                        D._sectionStack.collapseSection("_asocGridsection_" + D._asocGrids[i].dataSource.ID);
                        if(gridAsTabset===false){
                           // presun taby asociacie
                           for (var t = 1; t < D.tabs.length; t++) {
//                              D.selectTab(t);
                              var tb = D.getTabObject(t);
                              if (tb.pane && tb.pane.isA("DetailComponentTemplate")) {
                                 // porovnaj DS
                                 if (tb.pane.dataSource.ID == D._asocGrids[i].dataSource.ID
                                       || (tb.pane.parentDataSource && tb.pane.parentDataSource.ID == D._asocGrids[i].dataSource.ID)) {
                                    tb.pane.tabSet = D._asocGrids[i];
                                    var bkp_pane = tb.pane;
                                    D.updateTab(tb, null); // pane to null and hidden
                                    D.removeTab(tb);
                                    D._asocGrids[i].addTab({
                                       tabSelected : function(tabSet, tabNum, tabPane, ID, tab, name) {
                                          bkp_pane.delayCall("focusInside");
                                       },
                                       name : tb.name,
                                       title : tb.title,
                                       icon : tb.icon,
                                       pane : bkp_pane,
                                       canClose : tb.canClose
                                    });
                                 }
                              }
                           }
                        }
                        if (D._asocGrids[i]._hasAnyTabEdit())
                            D._asocGrids[i]._mySection.setTitle(D._asocGrids[i]._mySection._titleEdit);
                    }

                    D._asocLayout = "SECTION";
                    var cols = D.detail.numCols;
                    D._hideTabBar();
                    D._sectionStack.redraw();
                    D._sectionStack.expandSection(0);
                    break;
                case "SECTION":
                    D._sectionStack.expandSection(D._sectionStack.getSections(), function() {
                        D.updateTab(0, D._detailCanvas);
                        for (var i = 0; i < D._asocGrids.length; i++) {
                            var grid = D._asocGrids[i]; 
                            grid._gridTabSet=App.get.config["smartsfs.tabset.gridTabSet"].toString().toBoolean();
                            if(grid._gridTabSet===false){
                               grid.toTabSet = grid.toTabSet==grid?D:grid.toTabSet;
                            }
                            D.addTab({
                                tabSelected : function(tabSet, tabNum, tabPane, ID, tab, name) {
                                  grid.delayCall("focusInside");
                                },
                                name : grid._myTabName,
                                title : grid._gridTitle,
                                pane : grid,
                                canClose : false,
                                disabled : D.mode == "NEW"
                            });
                            delete D._asocGrids[i]["_mySection"];
                            if(D._asocGrids[i]._gridTabSet===false&&D._asocGrids[i].tabs.length>1){
                               //musim prehodit tabs z gridComp do master detailComp hned za grid tab
                               for (var t = 1; t < D._asocGrids[i].tabs.length; t++) {
                                  var tb=D._asocGrids[i].tabs[t];
                                  tb.pane.tabSet = D;
                                  var bkp_pane = tb.pane;
                                  D._asocGrids[i].updateTab(tb, null); // pane to null and hidden
                                  D._asocGrids[i].removeTab(tb);
                                  D.addTab({
                                     tabSelected : function(tabSet, tabNum, tabPane, ID, tab, name) {
                                        bkp_pane.delayCall("focusInside");
                                     },
                                     name : tb.name,
                                     title : tb.title,
                                     icon : tb.icon,
                                     pane : bkp_pane,
                                     canClose : tb.canClose
                                  },D.getTabNumber(D._asocGrids[i]._myTabName)+1);
                               }
                            }
                            if (D._asocGrids[i]._hasAnyTabEdit())
                               D.delayCall("setTabEdit", [ D._asocGrids[i]._myTabName ]);
                        }
                        delete D["_mySection"];
                        D._asocLayout = "TABSET";
                        D._showTabBar();
                        D.selectTab(0);
                        D.redraw();
                        D._detailCanvas.resizeTo(null, "100%");
                        D._sectionStack.destroy();
                        D._sectionStack = null;
                    });
                    break;
                }
            },
            // standardny form s urcenym poctom stlpcov layoutu
            // vytvori .detail a vlozi ako clena .valuesManager
            // props formu su doplnene o dataSource.formProperties
            _createForm : function(columns) {
                var D = this;
                columns = columns || 2;
                var addProps = {};
                var cw = [ "15%" ];
                for (var c = 1; c < columns; c++) {
                    cw.add("*");
                }
                var formProps = {
                    numCols : columns,
                    height : "100%",
                    colWidths : cw,
                    width : "100%",
                    overflow : "auto",
                    border : App.get.config["smartsfs.detailBorder"],
                    padding : 10,
                    dataSource : D.dataSource,
                    canEdit : false,
                    formTabset : D.toTabSet,                    
                    _ownerComp : D._ownerComp,
                    _parentComp : D,
                    focusInside : function() {
                        D.focusInside();
                    }
                };
                if (D.dataSource.formProperties != null) {
                    addProps = D.dataSource.getFormProperties(D);
                }
                isc.addProperties(formProps, addProps);
                D.detail = isc.DynamicForm.create(formProps);
                D.valuesManager.addMember(D.detail);
                D.observe(D.detail, "draw", "observer.afterDrawDetail()");
            },
            // vytvori a vlozi do layoutu toolBar
            // musi byt prvy clen layoutu, t.j. prvy krok
            _createToolBar : function() {
                var D = this;
                D.toolBar = DetailToolBarAny.create({
                    dataComp : D
                });
                //            D.addMember(D.toolBar);
            },
            // metoda pre nastavenie spravania formulara po otvoreni podla "mode"
            // pokracuj cez callback
            // @precondition:
            // 1.nastavene .initialValues s ID editovaneho zaznamu a
            // 2.nastaveny .dataSource
            // ak nie je NEW - nastav _instanceID (ID zaznamu), _pkCrit (kriteria
            // pre nacitanie podla PK)
            _setValuesByMode : function(cbk) {
                var D = this;
                if (D.mode != "NEW") {
                    D._instanceID = D.initialValues[D.dataSource.getPrimaryKeyFieldName()];
                    D._pkCrit[D.dataSource.getPrimaryKeyFieldName()] = D.initialValues[D.dataSource.getPrimaryKeyFieldName()];
                }
                switch (D.mode) {
                case "NEW":
                    D.delayCall("setCanEdit", [ true ]);
                    if (D.dataSource.initValues)
                        isc.addProperties(D.initialValues, D.dataSource.initValues);
                    D.dataSource.setFieldAccess("add", D.detail);
                    D.valuesManager.editNewRecord(D.initialValues);
                    D.toolBar.setIcons("add");
                    D.dataInitialized(D.initialValues);
                    cbk();
                    break;
                case "EDIT_BY_PK":
                    D.valuesManager.fetchData(D._pkCrit, function(dsResp, data) {
                        D.toolBar.setIcons("reload");
                        D.dataInitialized(data);
                        cbk();
                    });
                    break;
                case "EDIT_RECORD":
                    D.valuesManager.editRecord(D.initialValues);
                    D.toolBar.setIcons("reload");
                    D.dataInitialized(D.initialValues);
                    cbk();
                    break;
                default:
                    cbk();
                    break;
                }
            },
            // vymaluje LAYOUT
            // zmeni layout na asociacny (tabset)
            // ak ma .dataSource definovane asociacne fieldy 1:N
            // ak nema, maluj iba .detail (form)
            // kontrola role a fcie canCreateTab(detailcomponent) fieldu (napis do
            // formItemProps)
            // default layout = TABSET, inak podla ._asocLayout [TABSET,SECTION]
            // @precondition:
            // * znamy .dataSource
            // * vytvoreny .detail form
            // pre SECTION vytvori ._sectionStack
            // pre TABSET vytvori ._tabSet
            _drawLayout : function() {
                var D = this;
                D._detailCanvas.addMember(D.toolBar);
                D._detailCanvas.addMember(D.detail);
                switch (D._asocLayout) {
                case "SECTION":
                    if (!D._sectionStack) {
                        D._sectionStack = isc.SectionStack.create(isc.addProperties({},{
                           height : "100%",
                           width : "100%",
                           overflow : "auto",
                           visibilityMode : "multiple"
                       },D.dataSource.getFormProperties(D)["sectionStackProperties"]));

                        D._sectionStack.addSection({
                            name : 'section_detail',
                            title : D.dataSource.title,
                            _titleEdit : "<div style=\"color:" + (App.get.config["smartsfs.tabcolor.edit"] || "red") + ";\">" + D.dataSource.title
                                    + "</div>",
                            _titleNormal : D.dataSource.title,
                            expanded : true,
                            resizeable : true,
                            items : [ D._detailCanvas ]
                        });
                        D._mySection = D._sectionStack.getSectionHeader(D._sectionStack.getSectionNumber("section_detail"));
                        D.addTab({
                            tabSelected : function(tabSet, tabNum, tabPane, ID, tab, name) {
                                D.delayCall("focusInside");
                            },
                            title : D.dataSource.title,
                            pane : D._sectionStack,
                            canClose : false
                        });
                    }
                    break;
                default:
                    D._asocLayout = "TABSET";
                    D.addTab({
                        tabSelected : function(tabSet, tabNum, tabPane, ID, tab, name) {
                            D.delayCall("focusInside");
                        },
                        title : D.dataSource.title,
                        pane : D._detailCanvas,
                        canClose : false
                    });
                    break;
                }

                for ( var fname in D.dataSource.fields) {
                    if (D.dataSource.fields[fname].type == "agrmany" || D.dataSource.fields[fname].type == "bref"
                            || D.dataSource.fields[fname].type == "manyToMany") {

                        // ak nema pravo videt pokracuj dalsim fieldom
                        if (D.dataSource.fields[fname].viewRequiresRole && !App.get.user.hasAnyRole(D.dataSource.fields[fname].viewRequiresRole))
                            continue;
                        if (D.dataSource.fields[fname]["canCreateTab"] && isA.Function(D.dataSource.fields[fname]["canCreateTab"])) {
                            if (D.dataSource.fields[fname].canCreateTab(D) == false)
                                continue;
                        }
                        D._hasAsocFields = true; // ma asoc field

                        D.createAsocTab(D.dataSource.fields[fname]);
                    }
                }
                if (D._canSwitchLayout && D._hasAsocFields)
                    D.toolBar.addLayoutSwitch();
                D._layoutDrawn = true;
                D.delayCall("focusInside");
            },
            // funkcia vykreslenia komponentu
            // OVERRIDE for customize component
            drawComponent : function() {},
            initWidget : function() {
                this.Super("initWidget", arguments);
                this.valuesManager = SmartSFSValuesManager.create({
                    autoSynchronize : true,
                    dataSource : this.dataSource
                });
                this.toTabSet = this.toTabSet?this.toTabSet:this
                var D = this
                D._asocGrids = [];
                D._asocLayout = null;
                if(D.dataSource.getFormProperties(D)["asocLayout"]) D._asocLayout=D.dataSource.getFormProperties(D)["asocLayout"];
                D._pkCrit = {};
                D._instanceID = null;
                D._detailCanvas = VLayout.create({
                    height : "100%",
                    width : "100%",
                    dataSource : "",
                    overflow : "visible"
                });

                D.dataSource.setFieldAccess();
                //            D._dataCanvas = isc.VLayout.create({
                //                width : "100%",
                //                height : "100%",
                //                overflow : "auto",
                //                border : App.get.config["smartsfs.detailBorder"]
                //             });
                //            D._dataCanvas.hide();
                D.drawComponent();
            }
        });

// Standardny detail
isc.ClassFactory.defineClass('DetailFormComponentAny', 'DetailComponentTemplate').addProperties({
    drawComponent : function() {
        var D = this;
        D.minHeight = App.get.config["smartsfs.detail.minHeight"] || 10
        if (isc.Browser.isDesktop) {
            var cols = Object.keys(D.dataSource.fields).length > 15 ? 4 : 2;
            var hght = 50 * Object.keys(D.dataSource.fields).length / cols;
        } else
            cols = 2;

        D._createForm(cols);
        D._createToolBar();
        D._setValuesByMode(function() {
            D._drawLayout();
        });

        // D._drawLayout();

    }
});

// ToolStrip
isc.ClassFactory.defineClass('DetailToolBarAny', 'VLayout').addProperties(
        {
            height : 30,
            overflow : "visible",
            dataComp : null,
            _opers : [],
            _setDisabledOpers : function(disabled) {
                for (var o = 0; o < this._opers.length; o++) {
                    var oper = this._opers[o];
                    oper.setDisabled(disabled ? true : !oper._canPerform(this.dataComp));
                }
            },
            // name: "DetailToolBar",
            setIcons : function(mode) {
                switch (mode) {
                case "edit":
                    this._btnEdit.setDisabled(true);
                    this._btnSave.setDisabled(false);
                    this._btnAccept.setDisabled(false);
                    this._setDisabledOpers(true);
                    break;
                case "add":
                    this._btnEdit.setDisabled(true);
                    this._btnSave.setDisabled(false);
                    this._btnAccept.setDisabled(false);
                    this._btnRem.setDisabled(true);
                    this._btnClone.setDisabled(true);
                    this._setDisabledOpers(true);
                    break;
                case "save":
                    this._btnEdit.setDisabled(!(this.dataComp.dataSource._isEditAble && this.dataComp.dataSource.isEditAble(this.dataComp)));
                    this._btnSave.setDisabled(true);
                    this._btnAccept.setDisabled(true);
                    this._btnRem.setDisabled(!(this.dataComp.dataSource._isRemoveAble && this.dataComp.dataSource.isRemoveAble(this.dataComp)));
                    this._setDisabledOpers(false);
                    break;
                case "reload":
                    this._btnEdit.setDisabled(!(this.dataComp.dataSource._isEditAble && this.dataComp.dataSource.isEditAble(this.dataComp)));
                    this._btnSave.setDisabled(true);
                    this._btnAccept.setDisabled(true);
                    this._btnRem.setDisabled(!(this.dataComp.dataSource._isRemoveAble && this.dataComp.dataSource.isRemoveAble(this.dataComp)));
                    this._setDisabledOpers(false);
                    break;

                default:
                    break;
                }
            },
            addLayoutSwitch : function() {
                if (this.dataComp._asocLayout != null) {
                    this._toolStrip.addMember(isc.LayoutSpacer.create({
                        defaultWidth : "60%"
                    }));
                    this._switchLayout = BtnIcon.create({
                        prompt : isc.i18nMessages["smartsfs.buttons.switch.prompt"],
                        title : isc.i18nMessages["smartsfs.buttons.switch.prompt"],
                        showButtonTitle : false,
                        icon : '[SKIN]/FileBrowser/upOneLevel.png',
                        dataComp : this.dataComp,
                        click : function() {
                            this.dataComp.switchLayout();
                        }
                    });
                    if (!isc.Browser.isHandset) {
                    	this._switchLayout.showButtonTitle = true
                    	this._switchLayout.width = this._switchLayout.title.length * 7 + 11
                    }
                    this._toolStrip.addMember(this._switchLayout);
                }
            },
            initWidget : function() {
                this.Super("initWidget", arguments);
                var T = this;
                if (this.dataComp) {
                    this._toolStrip = isc.ToolStrip.create();
                    this._btnCancel = btnCancel.create({
                        dataComp : this.dataComp
                    });
                    this._toolStrip.addMember(this._btnCancel);
                    this._toolStrip.addMember(ToolStripSeparator.create());
                    this._btnAccept = btnAccept.create({
                        dataComp : this.dataComp
                    });
                    this._toolStrip.addMember(this._btnAccept);
                    this._btnSave = btnSave.create({
                        dataComp : this.dataComp
                    });
                    this._toolStrip.addMember(this._btnSave);
                    this._btnEdit = btnEdit.create({
                        dataComp : this.dataComp
                    }).addProperties({
                        disabled : !this.dataComp.dataSource._isEditAble
                    });
                    this._toolStrip.addMember(this._btnEdit);
                    this._btnRem = btnRem.create({
                        dataComp : this.dataComp
                    }).addProperties({
                        disabled : !this.dataComp.dataSource._isRemoveAble
                    });;
                    this._toolStrip.addMember(this._btnRem);
                    this._btnClone = btnCloneRec.create({
                        dataComp : this.dataComp
                    }).addProperties({
                        disabled : !this.dataComp.dataSource._isCreateAble
                    });
                    this._toolStrip.addMember(this._btnClone);
                    this._btnClone.hide()
                    if (this.dataComp.dataSource._cloneSupport) {
                        this._btnClone.show()
                    } else {
                        if (this.dataComp.dataSource.formProperties != null) {
                            var props = this.dataComp.dataSource.getFormProperties(this.dataComp);
                            if (props._cloneSupport)
                                    this._btnClone.show();
                        }
                    }
                    this._toolStrip.addMember(ToolStripSeparator.create());
                    this._btnRel = btnDetailRel.create({
                        dataComp : this.dataComp
                    });
                    this._toolStrip.addMember(this._btnRel);
                    this._toolStrip.addMember(ToolStripSeparator.create());
                    if (this.dataComp.dataSource.hasPdfReport == undefined || this.dataComp.dataSource.hasPdfReport == true) {
                        this._btnPdf = BtnIcon.create({
                            title : 'PDF',
                            prompt : isc.i18nMessages["smartsfs.buttons.pdf.prompt"],
                            icon : '[SKIN]/custom/pdf.png',
                            dataComp : this.dataComp,
                            click : function() {
                                this.dataComp.printPdf();
                            }
                        });
                        this._toolStrip.addMember(this._btnPdf);
                    }
                    this._btnPrint = BtnIcon.create({
                        title : 'Print',
                        prompt : isc.i18nMessages["smartsfs.buttons.print.prompt"],
                        icon : '[SKIN]/actions/print.png',
                        dataComp : this.dataComp,
                        click : function() {
                            this.dataComp.showPrintPreview();
                        }
                    });
                    this._toolStrip.addMember(this._btnPrint);

                    this._opers = [];
                    if (this.dataComp.dataSource.operations.length > 0) {
                        this.dataComp.dataSource.operations = this.dataComp.dataSource.operations.sortByProperty("position", true);
                        for (var o = 0; o < this.dataComp.dataSource.operations.length; o++) {
                            var oper = this.dataComp.dataSource.operations[o];
                            if (oper.placeOn.name == "DETAIL" && this.dataComp.dataSource.canPerformOperation(oper.id)) {
                                var opBtn = IButton.create({
                                    prompt : oper.prompt,
                                    title : oper.title,
                                    showClippedTitleOnHover : true,
                                    autoFit : true,
                                    snapToGrid : true,
                                    showButtonTitle : true,
                                    icon : oper.icon,
                                    dataComp : this.dataComp,
                                    _operationId : oper.id,
                                    _canPerform : oper.canPerform || function() {
                                        return this.dataComp.dataSource.canPerformOperation(this._operationId)
                                    },
                                    click : function() {
                                        this.dataComp.dataSource.performCustomOperation(this._operationId, this.dataComp, this.dataComp.valuesManager
                                                .getValues());
                                    }
                                });
                                this._opers.push(opBtn);
                            }
                        }
                        if (this._opers.length > 0) {
                            this._operStack = isc.ToolStrip.create({
                                maxSize : 0,
                                dataComp : T.dataComp,
                                maxResizeCount : 0, // #27233
                                _handleSize : function(setMax) {
                                	// #27233 toto je tu pretoze chrome sa zacykli a stale prekresluje az zdochne
                                	this.maxResizeCount = this.maxResizeCount + 1
                                	if (this.maxResizeCount > 100) {
                                        for (var m = 0; m < this.members.length; m++) {
                                            var btn = this.members[m];
                                            btn.setAutoFit(true);
                                        }
                                		return;
                                	}
                                	// #27233 po tialto
                                    var operSize = 0;
                                    var perc = 100 / this.members.length;
                                    var percSize = perc.toString().split(".")[0] + "%";
                                    for (var m = 0; m < this.members.length; m++) {
                                        var btn = this.members[m];
                                        operSize = operSize + btn.getVisibleWidth();
                                    }
                                    if (setMax == true)
                                        this.maxSize = operSize;
                                    if (operSize > this.dataComp.getVisibleWidth()) {
                                        for (var m = 0; m < this.members.length; m++) {
                                            var btn = this.members[m];
                                            btn.setWidth(percSize);
                                            btn.setAutoFit(false);
                                        }
                                    } else if (this.maxSize < this.dataComp.getVisibleWidth()) {
                                        for (var m = 0; m < this.members.length; m++) {
                                            var btn = this.members[m];
                                            btn.setWidth(btn.defaultWidth);
                                            btn.setAutoFit(true);
                                        }
                                    }
                                }
                            });
                            this._operStack.addMembers(this._opers);
                            this.addMember(this._operStack);
                            this._operStack.observe(T, "resized", "observer._handleSize()");
                            this._operStack.delayCall("_handleSize", [ true ]);
                        }
                    }
                    this.addMember(this._toolStrip);

                }
            }
        });