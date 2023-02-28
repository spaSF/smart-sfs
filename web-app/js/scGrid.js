isc.ClassFactory.defineClass('GridComponentAny', 'SmartTabSet').addProperties(
        {
            height : "100%",
            width : "100%",
            dataSource : "",
            overflow : "hidden",
            mode : null,
            _ownerComp : null,// pre asoc grid je to detail comp
            type : "",// posuva type do detailu,normal/agrmany/bref/...
            brefField : null,// meno back ref fieldu pre asociacne gridy
            brefValue : null, // value back ref fieldu pre asociacne gridy
            parentTabSet : null,// nadradeny tabset
            tabSet : null,// tabset, pod ktorym je grid - required
            _myTabName : null,// tab z tabSet, v ktorom je priradeny tento  komponent
            _gridCanvas : null,// VLayout canvas komponentu
            initialSort : [], // prednastaveny multisort
            canFilter : true, // umozni zakazat filter
            doAutoFetch : true, // auto fetch data
            toTabSet : null,
            _requiredProfile : {}, // profil pre asociacne gridy,object AdvancedCriteria vyrobi sa v init podla brefField a brefValue
            _userSettSupport : false,
            _recordsDropped : function(dropRecords, dropIndex) {
                // this je grid!!
                var G = this;
                if (G.reorderIndexField) {
                    if(!dropRecords[0][G.reorderIndexField])dropRecords[0][G.reorderIndexField]=1
                    var fromIndex = dropRecords[0][G.reorderIndexField] - 1 > dropIndex ? dropIndex : dropRecords[0][G.reorderIndexField] - 1;
                    var idxTitle = G.dataSource.getField(G.reorderIndexField).title;
                    isc.ask(isc.i18nMessages["smartsfs.reorder.confirm"].messageArgs(idxTitle), function(confirmed) {
                        if (confirmed) {
                            for (var idx = fromIndex; idx < G.getTotalRows(); idx++) {
                                var updatedRecord = G.getRecord(idx);
                                updatedRecord[G.reorderIndexField] = idx + 1;
                                G.updateData(updatedRecord);
                            }
                        }
                        G.sort(G.reorderIndexField);
                    });
                }
            },
            // EVENTS
            afterReloadFetch : function() {
                if (isA.Function(this.grid.afterReloadFetch))
                    this.grid.afterReloadFetch();
            },
            afterFilterFetch : function() {
                if (isA.Function(this.grid.afterFilterFetch))
                    this.grid.afterFilterFetch();
            },
            afterClearFilter : function() {
                if (isA.Function(this.grid.afterClearFilter))
                    this.grid.afterClearFilter();
            },
            afterInitFetch : function() {
                if (isA.Function(this.grid.afterInitFetch))
                    this.grid.afterInitFetch();
            },
            keyDown : function() {
                var key = isc.EventHandler.getKey();
                var retbul;
                var G = this;
                if (((key == "Q") && (isc.EventHandler.ctrlKeyDown())) || (key == "Escape")) {
                    G.cancel(function(closed, G) {
                        retbul = !closed;
                        // ked je grid v tabe asociaci, escape
                        // zavre detail component
                        if (!closed && G._ownerComp.isA("DetailComponentTemplate")) {
                            G._ownerComp.cancel(function(dClosed) {
                                retbul = !dClosed;
                            });
                        }
                    });
                };
                if (((key == "A") && (isc.EventHandler.ctrlKeyDown()))) {
                    if (this.hasOwnProperty('advFilter') && this.advFilter.isVisible() == true) {
                        this.advFilter.clearCriteria();
                    };
                    this.grid.setFilterEditorCriteria(null);
                    this.grid.filterData();
                    retbul = false;
                };
                if (((key == "F") && (isc.EventHandler.ctrlKeyDown())) || (key == "f4")) {
                    if (this.hasOwnProperty('advFilter') && this.advFilter.isVisible() == true) {
                        this.doFilter("advanced");
                    } else {
                        this.doFilter("normal");
                    };
                    retbul = false;
                };
                if (((key == "R") && (isc.EventHandler.ctrlKeyDown())) || (key == "f5")) {
                    this.reload();
                    retbul = false;
                };
                if (((key == "D") && (isc.EventHandler.ctrlKeyDown())) || (key == "f6")) {
                    this.getDetail();
                    retbul = false;
                };
                if (((key == "I") && (isc.EventHandler.ctrlKeyDown())) || (key == "f7")) {
                    if (this.toolBar._btnAdd && !(this.toolBar._btnAdd.isDisabled()))
                        this.addRecord();
                    retbul = false;
                };
                if (((key == "E") && (isc.EventHandler.ctrlKeyDown())) || (key == "f8")) {
                    this.exportData("xls");
                    retbul = false;
                };
                if (((key == "P") && (isc.EventHandler.ctrlKeyDown())) || (key == "f9")) {
                    if (this.toolBar._btnPdf && !(this.toolBar._btnPdf.isDisabled()))
                        this.printPdf();
                    retbul = false;
                }
                if (((key == "K") && (isc.EventHandler.ctrlKeyDown())) || (key == "f4")) {
                    if ((this.grid._cloneSupport || this.dataSource._cloneSupport) && this.toolBar._btnClone
                            && !(this.toolBar._btnClone.isDisabled()))
                        this.clone();
                    retbul = false;
                }
                return retbul == false ? retbul : this.tabSet.keyDown();
            },
            componentOnTabID : function() {
                return this.getID();
            },
            focusInside : function() {
                //                if (this.tabSet.getTabPane(this.tabSet.getSelectedTab()).getID() != this.componentOnTabID())
                //                    return;
                if (this.getSelectedTabNumber() == 0) {
                    //selected tab = data grid view
                    if (this.canFilter && !isc.Browser.isHandset) {
                        this.grid.focusInFilterEditor()
                    } else if (this.grid.bodies)
                        this.grid.focusInRow(0);
                } else {
                    //selected any other tab => go TabSet.focus
                    this.Super("focusInside");
                }
            },
            changeData : function(pk) {
                this.dataSource.fetchRecord(pk);
            },
            cancel : function(cbk, tab) {
                var G = this;
                var curTab = tab ? tab : G.tabSet.getTab(G._myTabName);
                var closeMe = function(doClose){
                   if(doClose===true){
                      G.resetTabEdit(0, true);
                      G.tabSet.removeTab(curTab);
                   }
                };
                if (curTab.canClose == true){
                    if(G._hasAnyTabEdit()){
                       isc.ask(isc.i18nMessages['smartsfs.edit.cancel'], closeMe);
                    }else{
                       closeMe(true);
                    }
                }
                if (cbk)
                    cbk(curTab.canClose, G);
            },
            setRequiredProfile : function(criteria) {
                if (criteria) {
                    this._requiredProfile = criteria._constructor == "AdvancedCriteria" ? criteria : this.dataSource.convertDataSourceCriteria(
                            criteria, "exactCase");
                    if (this.grid.isDrawn())
                        this.clearFilter();
                }
            },
            /**
             * remove required profile fields from user criteria
             * 
             * @param crit
             * @returns clean criteria
             */
            remReqProfileFromCrit : function(crit) {
                var advCrit = crit._constructor == "AdvancedCriteria" ? crit : this.dataSource.convertDataSourceCriteria(crit, "exactCase");
                if (this._requiredProfile && Object.getOwnPropertyNames(this._requiredProfile).length) {
                    var reqFields = this._requiredProfile.criteria.getProperty("fieldName");
                    var rem = [];
                    for (var field = 0; field < reqFields.length; field++) {
                        rem = advCrit.criteria.findAll("fieldName", reqFields[field]);
                        if (rem != null && rem.length > 0) {
                            advCrit.criteria.removeList(rem);
                        }
                    }
                }
                return advCrit;
            },
            getCriteria : function(filterType) {
                var crit = {};
                var undef;
                switch (filterType) {
                case "advanced":
                    crit = this.advFilter.getCriteria();
                    break;
                case "normal":
                    crit = this.grid.getFilterEditorCriteria();
                    break;
                default:
                    crit = this.grid.getFilterEditorCriteria();
                    if (!crit) {
                        crit = this.advFilter.getCriteria();
                        if (crit.criteria.length == 0)
                            crit = {};
                    }
                }
                if (this._requiredProfile && Object.getOwnPropertyNames(this._requiredProfile).length) {
                    var advProfile = this._requiredProfile._constructor == "AdvancedCriteria" ? this._requiredProfile : this.dataSource
                            .convertDataSourceCriteria(this._requiredProfile, "exactCase");
                    var addProfile = true;
                    if (crit.hasOwnProperty("criteria")) {
                        crit = this.remReqProfileFromCrit(crit);
                        for (var i = 0; i < crit.criteria.length; i++) {
                            if (crit.criteria[i].fieldName == this.brefField) {
                                addProfile = false;
                                break;
                            }
                        }
                    }
                    if (addProfile) {
                        crit = DataSource.combineCriteria(advProfile, crit);
                        // if (crit && crit.operator == "and") {
                        // // v poho, iba pridam
                        // crit.criteria.push(advProfile.criteria[0]);
                        // } else {
                        // // musim pridat master podmienku and
                        // var moveCrit = {};
                        // if (crit) {
                        // moveCrit = {
                        // operator : crit.operator,
                        // criteria : crit.criteria
                        // };
                        // }
                        // crit = {
                        // criteria : [ advProfile.criteria[0], moveCrit
                        // ],
                        // operator : "and"
                        // };
                        // }
                    }
                }
                return crit;

            },
            doFilter : function(filterType) {
                var G = this;
                G.grid.filterData(this.getCriteria(filterType), function(dsResp, data) {
                    G.afterFilterFetch();
                });
            },
            clearFilter : function() {
                var G = this;
                this.advFilter.clearCriteria();
                this.grid.setFilterEditorCriteria({});
                // this.grid.clearCriteria();
                // vycisti operator icons
                if (!this.advFilter.isVisible()) {
                    for (var f = 0; f < this.grid.fields.length; f++) {
                        var field = this.grid.fields[f];
                        if (!(field.operator == undefined || field.operator == null))
                            this.grid.setFieldProperties(field.name, {
                                operator : null
                            });
                    }
                }
                if (G.grid.doAutoFetch === false) {
                    // nerob auto fetch=clear filter vycisti grid
                    G.grid.setData([]);
                    G.afterClearFilter();
                } else {
                    if (this.dataSource.convertDSCriteria(this._requiredProfile).criteria.length > 0) {
                        // if
                        // (this._userSettSupport&&this.toolBar._btnUserSetting.usCriteria)
                        // {
                        if (this.toolBar._btnUserSetting.usCriteria) {
                            this.grid.filterData(DataSource.combineCriteria(this.dataSource.convertDSCriteria(this._requiredProfile), this
                                    .remReqProfileFromCrit(this.toolBar._btnUserSetting.getUSCriteria())), function(dsResp, data) {
                                G.afterClearFilter();
                            });
                        } else {
                            this.grid.filterData(this._requiredProfile, function(dsResp, data) {
                                G.afterClearFilter();
                            })
                        }
                    } else {
                        // this.grid.filterData(this._userSettSupport?this.toolBar._btnUserSetting.getUSCriteria():null,function(dsResp,data){G.afterClearFilter();});
                        this.grid.filterData(this.toolBar._btnUserSetting.getUSCriteria(), function(dsResp, data) {
                            G.afterClearFilter();
                        });
                    }
                }
            },
            _addBackRef : function() {
                var G = this;
                // var reqProf = this._requiredProfile;
                // treba zistit ci ide o agregaciu
                var setRec = function(resSelectedData) {
                    if (resSelectedData) {
                        // zapis nove data
                        for (var i = 0; i < resSelectedData.length; i++) {
                            // updatni referenciu
                            if (G.brefValue) {
                                resSelectedData[i][G.brefField] = G.brefValue;
                                G.grid.addData(resSelectedData[i], null, {
                                    operationType : "update"
                                });
                            }
                        }
                    }
                    // if (reqProf.criteria.length > 0 &&
                    // reqProf.criteria[0].operator
                    // == "notEqual") reqProf.criteria[0].operator =
                    // "equals";
                };
                // vyvolaj dialog
                // if (reqProf.criteria.length > 0 &&
                // reqProf.criteria[0].operator
                // ==
                // "equals") reqProf.criteria[0].operator = "notEqual";

                var crit = {
                    _constructor : "AdvancedCriteria",
                    operator : "and",
                    criteria : [ {
                        operator : "or",
                        criteria : [ {
                            fieldName : G.brefField,
                            operator : "notEqual",
                            value : G.brefValue
                        }, {
                            fieldName : G.brefField,
                            operator : "isNull"
                        } ]
                    } ]
                };

                var doDialog = isc.listGridDialog.create({
                    title : this.dataSource.pluralTitle, // +
                    // isc.i18nMessages["smartsfs.sc.filterBuilder_addButtonPrompt"].messageArgs(""),
                    dataSource : this.dataSource,
                    brefField : G.brefField,
                    brefValue : G.brefValue,
                    _ownerComp : G._ownerComp,
                    _reqProfile : crit,
                    _resData : setRec
                });
            },
            remove : function() {
                var G = this;
                if (this.type == "manyToMany") {
                    // vyhod asociaciu - staci removeData, DS je special
                    // so special
                    // action
                    // pre remove
                    // updatni referenciu
                    if (G.brefValue) {
                        var record = G.grid.getSelectedRecord();
                        if (record == null) {
                            isc.warn(isc.i18nMessages["default.noRowSelected.prompt"]);
                        } else {
                            var params = {};
                            params[G.brefField] = G.brefValue;
                            G.dataSource.removeData(record, null, {
                                params : params
                            });
                        }
                    }
                }
                if (this.type == "bref") {
                    // var setRec = function(resSelectedData) {
                    var resSelectedData = G.grid.getSelectedRecords();
                    if (resSelectedData) {
                        // zapis nove data
                        for (var i = 0; i < resSelectedData.length; i++) {
                            // updatni referenciu
                            if (G.brefValue) {
                                resSelectedData[i][G.brefField] = null;
                                G.grid.removeData(resSelectedData[i], null, {
                                    operationType : "update"
                                });
                            }
                        }
                    } else
                        isc.warn(isc.i18nMessages["default.noRowSelected.prompt"]);
                }
            },
            _addManyToMany : function() {
                // many to many maju specialny DS s URL operaciami v
                // master
                // controlleri,
                // brefField je ID mastra
                var G = this;
                var setRec = function(resSelectedData) {
                    if (resSelectedData) {
                        // zapis nove data
                        for (var i = 0; i < resSelectedData.length; i++) {
                            if (G.brefValue) {
                                var record = resSelectedData[i];
                                var params = {};
                                // brefField je special osetreny iba v
                                // controlleri
                                params[G.brefField] = G.brefValue;
                                G.dataSource.addData(record, null, {
                                    params : params
                                });
                                if (i+1 == resSelectedData.length)
                                		G.delayCall("reload",null,500);                              
                            }
                        }
                    }
                };
                // vyvolaj dialog
                var crit = {
                    _constructor : "AdvancedCriteria",
                    operator : "and",
                    criteria : []
                };
                App.getDataSource(G.dataSource.detailFormDS, function(DS) {
                    // kriteria na primary key - musi byt ten isty ako v
                    // special
                    // manyToMany
                    // datasource
                    var pkField = DS.getPrimaryKeyFieldName();
                    for (var r = 0; r < G.grid.data.getLength(); r++) {
                        crit.criteria.push({
                            fieldName : pkField,
                            operator : "notEqual",
                            value : G.grid.data.get(r)[pkField]
                        });
                    }

                    // kedze ide o asoc ent, musim tam poslat druhu
                    // stranu asociacie
                    // preto this.dataSource.detailFormDS
                    var doDialog = isc.listGridDialog.create({
                        title : DS.pluralTitle,
                        dataSource : DS,
                        brefField : null,
                        brefValue : null,
                        _ownerComp : G._ownerComp,
                        _reqProfile : crit,
                        _resData : setRec
                    });
                });

            },
            addRecord : function(isClone) {
                var G = this;
                switch (this.type) {
                
                case "bref":                	
                    if (G._dynamicGridBar)
                        G._showTabBar();
                    this._addBackRef();
                    break;
                    
                case "manyToMany":
                    this._addManyToMany();
                    break;

                default:           	
                    if (G._dynamicGridBar)
                        G._showTabBar();
                    App._addRecord(G, null, isClone, null, G.toTabSet)
                    break;
                }

            },
            clone : function() {
                debugger;
                var record = this.grid.getSelectedRecord();
                this.addRecord(true)
            },
            getDetail : function() {
                var G = this;
                var req = {};
                var dtlComp;
                var gridDS = this.dataSource;
                if (this.grid.getSelectedRecord()) {
                    if (G._dynamicGridBar)
                        G._showTabBar();
                    var pkey = this.dataSource.getPrimaryKeyFieldName();
                    var recId = this.grid.getSelectedRecord()[pkey];
                    req[pkey] = recId;
                } else {
                    return;
                }

                App._showDetailByPK(this.dataSource, recId, G.toTabSet, G.type, G.brefField, G.brefValue, G._ownerComp, G);
                //						App._showDetailByPK(this.dataSource, recId,
                //								this.tabSet, G.type, G.brefField, G.brefValue,
                //								G._ownerComp, G);

            },
            reload : function() {
                var G = this;
                if (this.grid.initialSort && this.grid.initialSort.length > 0)
                    this.grid.setSort(this.grid.initialSort);
                if (this.grid.isDrawn())
                    this.grid.refreshData(function() {
                        G.toolBar.setIcons();
                        G.afterReloadFetch();
                    });
            },
            importData : function(importAs) {
                var G = this;
                if (importAs == "csv") {
                    SmartSource.performCustomOperation('csvImport', G, {});
                }
            },
            exportData : function(exportAs) {
                var G = this;
                if (exportAs == "xls" && isA.Function(this.grid.printXls)) {
                    this.grid.printXls(this);
                } else {
                    if (exportAs == "csv" && isA.Function(this.grid.printCsv)) {
                        this.grid.printCsv(this);
                    } else {
                        if (exportAs == "xls") {
                            SmartSource.performCustomOperation('xlsExport', G, {});
                        } else {
                            if (exportAs == "csv") {
                                SmartSource.performCustomOperation('csvExport', G, {});
                            } else {
                                this.grid.invalidateCache();
                                this.grid.filterData(this.getCriteria(), function() {
                                    G.grid.exportClientData({
                                        exportAs : exportAs,
                                        exportFilename : G.dataSource.ID
                                    });
                                }, {
                                    endRow : App.get.config["sc.xlsexport.size"] ? App.get.config["sc.xlsexport.size"] : 1000
                                });
                            }
                        }
                    }
                }
            },
            printPdf : function() {
                if (this.grid.printPdf != undefined && isA.Function(this.grid.printPdf)) {
                    this.grid.printPdf(this);
                } else {
                	var tg = this.grid
                    isc.RPCManager.exportContent(this.grid, {
                        skinName : "EnterpriseBlue",
                        pdfName : this.dataSource.ID,
                        exportCSS : "@page {size: A4 landscape; }"
                    });
                }
            },
            /**
             * setGrid - vytvorenie gridu komponentu, moze byt overriden v custom komponente musi obsahovat priradenie objektu gridu do this.grid
             * property
             */
            setGrid : function() {
                var G = this;
                // pridane properties gridu z datasource
                var addProps = {};
                if (G.dataSource.gridProperties != null) {
                    var props = isA.String(G.dataSource.gridProperties) ? isc.JSON.decode(G.dataSource.gridProperties) : G.dataSource.gridProperties;
                    for ( var propkey in props) {
                        addProps[propkey] = App._evalPropertyValue(props[propkey]);
                    }
                }
                if (addProps["doAutoFetch"] == undefined)
                    addProps.doAutoFetch = this.doAutoFetch;
                var gridProps = {
                    height : "100%",
                    width : "100%",
                    canEdit : false,
                    overflow : "auto",
                    mode : G.mode,
//                    autoFitWidthApproach : "both",
                    rowEndEditAction : 'same', // none stop same
                    listEndEditAction : 'done', // none stop same
                    autoFitFieldWidths : true,
                    alternateRecordStyles : true,
                    autoFetchData : false,
                    showFilterEditor : G.canFilter ? true : false,
                    allowFilterExpressions : true,
                    canAddFormulaFields : true,
                    canAddSummaryFields : true,
                    canReorderRecords : addProps.reorderIndexField == null ? false : true,
                    // override aby presiel cez doFilter aj na enter
                    // vo filter row
                    filterEditorSubmit : function(crit) {
                        G.doFilter();
                        return false;
                    },
                    filterEditorProperties : {
                        editorKeyDown : function() {
                            return G.keyDown();
                        }
                    },
                    filterLocalData : false,
                    fetchDelay : 500,
                    dataSource : G.dataSource,
                    recordDoubleClick : function() {
                        G.getDetail();
                    },
                    _afterDrawGrid : function(cback) {
                        if (this.isDrawn()) {
                            //                            G._autoHideTabBar();
                            if (this.doAutoFetch === true) {
                                this.fetchData(G._requiredProfile, function() {
                                    // hide brefField
                                    if (G.type != "normal" && G.grid.getField(G.brefField))
                                        G.grid.hideField(G.brefField);
                                    G.toolBar.setIcons();
                                    // user setting
                                    // G._userSettSupport===true?G.toolBar._btnUserSetting.usdf.setDefault():null;
                                    G.toolBar._btnUserSetting.usdf.setDefault();

                                    if (isc.Browser.isHandset) {
                                    	G.grid.focusInRow(0)
                                    } else {
                                    	G.grid.focusInFilterEditor();
                                    }
                                    if (isc.isA.Function(cback))
                                        cback();
                                    G.afterInitFetch();
                                });
                            } else {
                                if (G.type != "normal" && G.grid.getField(G.brefField))
                                    G.grid.hideField(G.brefField);
                                G.toolBar.setIcons();
                                G.toolBar._btnUserSetting.usdf.setDefault();
                                if (isc.Browser.isHandset) {
                                	G.grid.focusInRow(0)
                                } else {
                                	G.grid.focusInFilterEditor();
                                }
                                if (isc.isA.Function(cback))
                                    cback();
                            }
                        }
                    },
                    afterDrawGrid : function() {
                        this._afterDrawGrid();
                    },
                    initialSort : G.initialSort,
                    _ownerComp : G._ownerComp,
                    _parentComp : G
                };
                isc.addProperties(gridProps, addProps);
                G.grid = isc.ListGrid.create(gridProps);
                G.grid.observe(G.grid, "draw", "observer.afterDrawGrid()");

                // reorder prototyp fcia do gridu
                if (G.grid.reorderIndexField != null) {
                    G.grid.recordsDropped = G._recordsDropped;
                }

            },
            /**
             * nastav required profil - default podla bRef + datasource.customProfile musi obsahovat vytvorenie property this._requiredProfile
             */
            initRequiredProfile : function() {
                var G = this;
                var undef;

                if (G.type != "normal") {
                    var crit = {};
                    crit[G.brefField] = G.brefValue == null ? "-1" : G.brefValue;
                    G._requiredProfile = G.dataSource.convertDataSourceCriteria(crit, "exactCase")
                }
                if (G.dataSource.customProfile != undef && G.dataSource.customProfile != null) {
                    var _customProfile = {}
                    if (isA.Function(G.dataSource.customProfile)) {
                        _customProfile = G.dataSource.customProfile(G);
                    } else {
                        _customProfile = G.dataSource.customProfile;
                    }
                    _customProfile = _customProfile._constructor == "AdvancedCriteria" ? _customProfile : G.dataSource.convertDataSourceCriteria(
                            _customProfile, "exactCase");
                    if (G._requiredProfile && Object.getOwnPropertyNames(G._requiredProfile).length) {
                        G._requiredProfile = DataSource.combineCriteria(G._requiredProfile, _customProfile);
                    } else
                        G._requiredProfile = _customProfile;
                }

            },
            /**
             * vytvor default advanced filter builder pri override musis vytvorit property this.advFilter
             */
            setAdvFilter : function() {
                var G = this;
                G.advFilter = isc.FilterBuilder.create({
                    dataSource : G.dataSource,
                    keyDown : function() {
                        G.keyDown();
                    }
                });
                G.advFilter.hide();

            },
            /**
             * vytvor default tool bar pri override musis vytvorit property this.toolBar
             */
            setToolBar : function() {
                var G = this;
                G.toolBar = GridToolBarAny.create({
                    dataComp : G
                });
            },
            /**
             * zaradi clenov do layoutu komponentu v poradi advFilter,toolBar,grid
             */
            setMembers : function() {
                var G = this;
                G.valuesManager = SmartSFSValuesManager.create({
                    autoSynchronize : true,
                    dataSource : G.dataSource
                });
                G.valuesManager.addMember(G.grid);

                G._gridCanvas.addMember(G.advFilter);
                G._gridCanvas.addMember(G.toolBar);
                G._gridCanvas.addMember(G.grid);
                G.addTab({
                    tabSelected : function(tabSet, tabNum, tabPane, ID, tab, name) {
                        G.delayCall("focusInside");
                    },
                    pane : G._gridCanvas,
                    canClose : false,
                    title : isc.i18nMessages["default.grid.tabtitle"] + " " + G.dataSource.pluralTitle
                });

            },
            initWidget : function() {
                this.Super("initWidget", arguments);
                var G = this;
                G.toTabSet = G.toTabSet?G.toTabSet:(G._gridTabSet?G:G.tabSet);
                G._userSettSupport = App.get.config["smartsfs.userSetting.supported"].toString().toBoolean()
                        || (isc.Browser.isHandset && App.get.config["smartsfs.userSetting.handset.supported"].toString().toBoolean()) || false;
                G._gridCanvas = VLayout.create({
                    height : "100%",
                    width : "100%",
                    dataSource : "",
                    overflow : "hidden"
                });
                if (G.dataSource) {
                    G.initRequiredProfile();
                    G.setAdvFilter();
                    G.setToolBar();
                    G.setGrid();
                    G.setMembers();
                } else {
                    isc.say("NEDOSIEL DATASOURCE!!!!");
                }
            }
        });

// ToolStrip
isc.ClassFactory.defineClass('GridToolBarAny', 'VLayout').addProperties(
        {
            height : 30,
            overflow : "visible",
            dataComp : null,
            _tsUserSetting : null,
            _opers : [],
            _handleSize : function() {
                var chkExists = 0;
                var btnCount = 0;
                for (var i = 0; this._toolStrip.members.length > i; i++) {
                    if (this._toolStrip.members[i].baseStyle == "iconButton" && this._toolStrip.members[i].visibility != "hidden") {
                        btnCount++;
                    }
                }
                if (this._btnUserSetting) {
                    if (App.get.splitPane.detailToolStrip.getVisibleWidth() < (494 - ((9 - btnCount) * 24)) && this._btnUserSetting) {
                        for (var i = 0; this.members.length > i; i++) {
                            if (this.members[i] == this._tsUserSetting)
                                chkExists = 1
                        }
                        if (chkExists == 0) {
                            this._tsUserSetting = isc.ToolStrip.create({});
                            this._tsUserSetting.addMember(this._btnUserSetting);
                            this._toolStrip.removeMember(this._btnUserSetting);
                            this._btnUserSetting.usdf.getField("name").setWidth(
                                    this._btnUserSetting.usdf.getField("name").getVisibleWidth() - ((9 - btnCount) * 24));
                            this.addMember(this._tsUserSetting);
                        }
                    } else {
                        for (var i = 0; this._toolStrip.members.length > i; i++) {
                            if (this._toolStrip.members[i] == this._btnUserSetting)
                                chkExists = 1
                        }
                        if (chkExists == 0) {
                            this._btnUserSetting.usdf.getField("name").setWidth(182);
                            this._toolStrip.addMember(this._btnUserSetting);
                            this.removeMember(this._tsUserSetting);
                        }
                    }
                }
            },
            _setDisabledOpers : function(disabled) {
                for (var o = 0; o < this._opers.length; o++) {
                    var oper = this._opers[o];
                    oper.setDisabled(disabled ? true : !oper._canPerform(this.dataComp));
                }
            },
            setIcons : function() {
                if (this._btnAdd)
                    this._btnAdd.setDisabled(!(this.dataComp.dataSource._isCreateAble && this.dataComp.dataSource.isCreateAble(this.dataComp)));
                if (this._btnRemove)
                    this._btnRemove.setDisabled(!(this.dataComp.dataSource._isRemoveAble && this.dataComp.dataSource.isRemoveAble(this.dataComp)));
                this._setDisabledOpers(false);
            },
            initWidget : function() {
                this.Super("initWidget", arguments);
                var T = this;
                if (this.dataComp) {
                    this._toolStrip = isc.ToolStrip.create();

                    if (this.dataComp.type == "normal") {
                        this._btnCancel = btnCancel.create({
                            dataComp : this.dataComp
                        });
                        this._toolStrip.addMember(this._btnCancel);
                    }

                    if (this.dataComp.canFilter != false) {
                        this._btnFilter = btnFilter.create({
                            dataComp : this.dataComp
                        }).addProperties({
                            click : function() {
                                this.dataComp.doFilter("normal");
                            }
                        });
                        // advanced filter
                        if (this.dataComp.advFilter) {
                            this._btnAdvFilter = advFiltRun.create({
                                dataComp : this.dataComp
                            }).addProperties({
                                click : function() {
                                    this.dataComp.doFilter("advanced");
                                }
                            });
                            this._btnSwitchFilter = advFilt.create({
                                dataComp : this.dataComp
                            }).addProperties({
                                click : function() {
                                    if (this.dataComp.advFilter.isVisible()) {
                                        this.dataComp.advFilter.clearCriteria();
                                        this.dataComp.advFilter.hide();
                                        T._btnAdvFilter.hide();
                                        T._btnFilter.show();
                                        this.dataComp.grid.setShowFilterEditor(true);
                                    } else {
                                        this.dataComp.advFilter.show();
                                        T._btnAdvFilter.show();
                                        T._btnFilter.hide();
                                        this.dataComp.grid.setShowFilterEditor(false);
                                        this.dataComp.grid.setFilterEditorCriteria(null);
                                    }
                                }
                            });
                            this._toolStrip.addMember(this._btnSwitchFilter);
                            this._toolStrip.addMember(this._btnAdvFilter);
                            this.dataComp.advFilter.hide();
                            this._btnAdvFilter.hide();
                        }
                        // standard filter
                        this._toolStrip.addMember(this._btnFilter);
                        // clear filter
                        this._btnClearFilter = clrFilt.create({
                            dataComp : this.dataComp
                        }).addProperties({
                            click : function() {
                                this.dataComp.clearFilter();
                            }
                        });
                        this._toolStrip.addMember(this._btnClearFilter);
                        this._toolStrip.addMember(ToolStripSeparator.create());
                    }

                    // detail
                    this._btnDetail = btnDetail.create({
                        dataComp : this.dataComp
                    }).addProperties({
                        click : function() {
                            this.dataComp.getDetail();
                        }
                    });
                    this._toolStrip.addMember(this._btnDetail);
                    if (this.dataComp.dataSource.canEdit != false) {
                        // neni readOnly datasource
                        // add
                        this._btnAdd = btnAdd.create({
                            dataComp : this.dataComp
                        }).addProperties({
                            click : function() {
                                this.dataComp.addRecord();
                            },
                            disabled : !(this.dataComp.dataSource._isCreateAble)
                        });
                        this._toolStrip.addMember(this._btnAdd);
                        if (this.dataComp.type == "manyToMany" || this.dataComp.type == "bref") {
                            this._btnRemove = btnRem.create({
                                dataComp : this.dataComp
                            }).addProperties({
                                disabled : !(this.dataComp.dataSource._isRemoveAble)
                            });
                            this._toolStrip.addMember(this._btnRemove);
                        }
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
                            if (this.dataComp.dataSource.gridProperties != null) {
                                var props = isA.String(this.dataComp.dataSource.gridProperties) ? isc.JSON
                                        .decode(this.dataComp.dataSource.gridProperties) : this.dataComp.dataSource.gridProperties;
                                for ( var propkey in props) {
                                    var pp = props._cloneSupport
                                    if (props._cloneSupport)
                                        this._btnClone.show()
                                }
                            }
                        }
                        this._toolStrip.addMember(ToolStripSeparator.create());
                    }
                    // reload
                    this._btnRel = btnRel.create({
                        dataComp : this.dataComp
                    }).addProperties({
                        click : function() {
                            this.dataComp.reload();
                        }
                    });
                    this._toolStrip.addMember(this._btnRel);
                    this._toolStrip.addMember(ToolStripSeparator.create());
                    // export
                    this._btnXls = BtnIcon.create({
                        title : 'Export XLS',
                        prompt : isc.i18nMessages["smartsfs.buttons.xls.prompt"],
                        icon : '[SKIN]/custom/excel.png',
                        dataComp : this.dataComp,
                        click : function() {
                            this.dataComp.exportData("xls");
                        }
                    });
                    this._toolStrip.addMember(this._btnXls);
                    this._btnCsv = BtnIcon.create({
                        title : 'Export CSV',
                        prompt : isc.i18nMessages["smartsfs.buttons.csv.prompt"],
                        icon : '[SKIN]/custom/csv.png',
                        dataComp : this.dataComp,
                        click : function() {
                            this.dataComp.exportData("csv");
                        }
                    });
                    this._toolStrip.addMember(this._btnCsv);
                    this._btnCsvIn = BtnIcon.create({
                        title : 'Import CSV',
                        prompt : isc.i18nMessages["smartsfs.buttons.csvIn.prompt"],
                        icon : '[SKIN]/custom/csv_in.png',
                        dataComp : this.dataComp,
                        click : function() {
                            this.dataComp.importData("csv");
                        }
                    });
                    if (App.get.config["smartsfs.csvImport.support"].toString().toBoolean() && !(this.dataComp.dataSource.csvImport == false)
                            || this.dataComp.dataSource.csvImport == true)
                        this._toolStrip.addMember(this._btnCsvIn);

                    if (this.dataComp.dataSource.hasPrint == undefined || this.dataComp.dataSource.hasPrint == true) {
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
                    }
                    
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
                    this._opers = [];
                    if (this.dataComp.dataSource.operations.length > 0) {
                        this.dataComp.dataSource.operations = this.dataComp.dataSource.operations.sortByProperty("position", true);
                        for (var o = 0; o < this.dataComp.dataSource.operations.length; o++) {
                            var oper = this.dataComp.dataSource.operations[o];
                            if (oper.placeOn.name == "GRID" && this.dataComp.dataSource.canPerformOperation(oper.id)) {
                                var opBtn = IButton.create({
                                    prompt : oper.prompt,
                                    title : oper.title,
                                    autoFit : true,
                                    snapToGrid : true,
                                    showButtonTitle : true,
                                    showClippedTitleOnHover : true,
                                    icon : oper.icon,
                                    dataComp : this.dataComp,
                                    _canPerform : oper.canPerform || function() {
                                        return this.dataComp.dataSource.canPerformOperation(this._operationId);
                                    },
                                    _operationId : oper.id,
                                    click : function() {
                                        this.dataComp.dataSource.performCustomOperation(this._operationId, this.dataComp, this.dataComp.grid
                                                .getSelectedRecord());
                                    }
                                });
                                this._opers.push(opBtn);
                            }
                        }
                        if (this._opers.length > 0) {
                            this._operStack = isc.ToolStrip.create({
                                maxSize : 0,
                                dataComp : this.dataComp,
                                _handleSize : function(setMax) {
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

                    // user settings
                    if (isc.Browser.isHandset) {
                        // if
                        // (App.get.config["smartsfs.userSetting.handset.supported"].toString()=="true")
                        // {
                        this._btnUserSetting = btnUserSetting.create({
                            dataComp : this.dataComp
                        });
                        this._toolStrip.addMember(isc.LayoutSpacer.create({
                            defaultWidth : "100%"
                        }));
                        this._toolStrip.addMember(this._btnUserSetting);
                        if (!App.get.config["smartsfs.userSetting.handset.supported"].toString().toBoolean()) {
                            this._btnUserSetting.hide();
                        }
                    } else {
                        // if
                        // (App.get.config["smartsfs.userSetting.supported"].toString()=="true")
                        // {
                        this._btnUserSetting = btnUserSetting.create({
                            dataComp : this.dataComp
                        });
                        this._toolStrip.addMember(isc.LayoutSpacer.create({
                            defaultWidth : "100%"
                        }));
                        this._toolStrip.addMember(this._btnUserSetting);
                        if (!App.get.config["smartsfs.userSetting.supported"].toString().toBoolean()) {
                            this._btnUserSetting.hide();
                        }
                    }

                    // this._toolStrip.addMember(this._btnUserSetting);

                    this.addMember(this._toolStrip);

                    if (isc.Browser.isHandset) {
                        if (App.get.config["smartsfs.userSetting.handset.supported"].toString().toBoolean()) {
                            this.observe(this.dataComp, "resized", "observer._handleSize()");
                            this.delayCall("_handleSize");
                        }
                    } else {
                        if (App.get.config["smartsfs.userSetting.supported"].toString().toBoolean()) {
                            this.observe(this.dataComp, "resized", "observer._handleSize()");
                            this.delayCall("_handleSize");
                        }
                    }

                }
            }
        });

isc.ClassFactory.defineClass('listGridDialog', 'Window').addProperties(
        {
            // height : "40%",
            width : "50%",
            isModal : true,
            showModalMask : true,
            autoCenter : true,
            autoDraw : true,
            autoSize : true,
            canDragResize : true,
            showFooter : true,
            showMinimizeButton : false,
            canDragReposition : true,
            canDragResize : true,
            dataSource : "",
            // selectionType : "", // multiple/simple
            selectionAppearance : "checkbox", // rowStyle
            _reqProfile : {},
            brefField : null,
            brefValue : null,
            _resData : function(result) {},
            keyDown : function() {
                // console.log("detail KEY DOWN:" + isc.Event.getKey());
                var key = isc.EventHandler.getKey();
                var retbul;
                if (((key == "Q") && (isc.EventHandler.ctrlKeyDown())) || (key == "Escape")) {
                    this.cancel();
                    retbul = false;
                }
                if (((key == "A") && (isc.EventHandler.ctrlKeyDown())) || (key == "f2")) {
                    this.accept();
                    retbul = false;
                }
                return retbul;
            },
            getCriteria : function() {
                var crit = this.grid.getFilterEditorCriteria();
                if (this._reqProfile && Object.getOwnPropertyNames(this._reqProfile).length) {
                    var advProfile = this._reqProfile._constructor == "AdvancedCriteria" ? this._reqProfile : this.dataSource
                            .convertDataSourceCriteria(this._reqProfile, "exactCase");
                    var addProfile = true;
                    if (crit.hasOwnProperty("criteria")) {
                        for (var i = 0; i < crit.criteria.length; i++) {
                            if (crit.criteria[i].fieldName == this.brefField) {
                                addProfile = false;
                                break;
                            }
                        }
                    }
                    if (addProfile) {
                        if (crit && crit.operator == "and") {
                            // v poho, iba pridam
                            crit.criteria.push(advProfile.criteria[0]);
                        } else {
                            // musim pridat master podmienku and
                            var moveCrit = {};
                            if (crit) {
                                moveCrit = {
                                    operator : crit.operator,
                                    criteria : crit.criteria
                                };
                            }
                            crit = {
                                operator : "and",
                                cireria : [ advProfile.citeria[0], moveCrit ]
                            };
                        }
                    }
                }
                return crit;

            },
            doFilter : function() {
                this.grid.filterData(this.getCriteria());
            },
            cancel : function() {
                this.close();
                return this._resData(null);
            },
            accept : function(cbk) {
                var D = this;
                var resData = this.grid.getSelectedRecords();
                var closeFn = function(val) {
                    if (!D.brefValue)
                        D.close();
                    if (val) {
                        if (D.brefValue)
                            D.close();
                        return D._resData(resData);
                    }
                };
                if (resData.length > 0) {
                    if (D.brefField != null && D.selectionType != "single") {
                        var fval;
                        for (var i = 0; i < resData.length; i++) {
                            var fval = resData[i][D.brefField];
                            if (fval)
                                break;
                        }
                        if (fval)
                            isc.ask(isc.i18nMessages['dialog.listgrid.accept'].messageArgs(this.title, D.brefField, fval), closeFn);
                        else
                            closeFn(true);
                    } else {
                        closeFn(true);
                    }
                } else {
                    closeFn(false);
                }
            },
            showFilter : function(status) {
                if (status == "Disabled") {
                    this.grid.setProperty("showFilterEditor", false);
                } else {
                    this.grid.setProperty("showFilterEditor", true);
                }
            },
            initWidget : function() {
                this.Super("initWidget", arguments);
                var G = this;
                if (this.dataSource) {
                    // filter
                    this.advFilter = isc.FilterBuilder.create({
                        dataSource : this.dataSource
                    });
                    this.advFilter.hide();
                    this.addMember(this.advFilter);
                    // layout
                    this.layout = isc.VLayout.create({
                        height : "100%",
                        width : "100%",
                        managePercentBreadth : true,
                        minMemberSize : 175
                    });
                    // grid
                    this.grid = isc.ListGrid.create({
                        height : "100%",
                        width : "100%",
                        autoFitWidthApproach : "both",
                        autoFitFieldWidths : true,
                        alternateRecordStyles : true,
                        showFilterEditor : false,
                        allowFilterExpressions : true,
                        // override aby presiel cez doFilter aj na enter
                        // vo filter row
                        filterEditorSubmit : function(crit) {
                            G.doFilter();
                            return false;
                        },
                        autoFetchData : false,
                        canEdit : false,
                        dataSource : this.dataSource,
                        selectionAppearance : G.selectionAppearance,
                        selectionType : G.selectionType,
                        recordDoubleClick : function() {
                            if (G.selectionType == "single")
                                G.accept();
                        },
                        _parentComp : G
                    });
                    if (this.selectionType == 'simple') {
                        this.grid.setProperty("selectionAppearance", 'rowStyle');
                        this.grid.setProperty("selectionType", this.selectionType);
                    };
                    // toolbar
                    this.toolbar = isc.ToolStrip.create({
                        height : 30,
                        dataComp : G,
                        initWidget : function() {
                            this.Super("initWidget", arguments);
                            this._btnCancel = btnCancel.create({
                                dataComp : this.dataComp
                            });
                            this.addMember(this._btnCancel);
                            this._btnAccept = btnAccept.create({
                                dataComp : this.dataComp
                            });
                            this.addMember(this._btnAccept);
                            this._btnAccept.setDisabled(false);
                            this._showFilter = btnShowFilter.create({
                                dataComp : this.dataComp
                            });
                            this.addMember(this._showFilter);
                        }
                    });
                    if (G.dataSource.customProfile != undefined && G.dataSource.customProfile != null) {
                        var _customProfile = {}
                        if (isA.Function(G.dataSource.customProfile)) {
                            _customProfile = G.dataSource.customProfile(G);
                        } else {
                            _customProfile = G.dataSource.customProfile;
                        }
                        _customProfile = _customProfile._constructor == "AdvancedCriteria" ? _customProfile : G.dataSource.convertDataSourceCriteria(
                                _customProfile, "exactCase");
                        if (G._reqProfile && Object.getOwnPropertyNames(G._reqProfile).length) {
                            G._reqProfile = DataSource.combineCriteria(G._reqProfile, _customProfile);
                        } else
                            G._reqProfile = _customProfile;
                    }

                    this.layout.addMember(G.toolbar);
                    this.layout.addMember(G.grid);
                    this.grid.fetchData(G._reqProfile, function() {
                        G.grid.focus();
                    });
                    this.addItem(G.layout);
                }
            }
        });