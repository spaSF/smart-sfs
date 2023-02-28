/**
 * hlavny sc class s layoutom a metodami na handle datasources
 */
isc.ClassFactory.defineClass("App", "VLayout").addClassProperties({
    appRootUrl : contextRoot, // var contextRoot je v
    // index.gsp
    navDS : 'MenuItem',// navigation tree DS
    userDataSource : 'User',
    dsRequestUrl : contextRoot + '/SmartSource/loadDS.json',// url
    loginRequestUrl : contextRoot + '/j_spring_security_check',
    logoutRequestUrl : contextRoot + '/logout',
    userRequestUrl : contextRoot + '/user/loadUser.json',
    localeRequestUrl : contextRoot + '/Localization/loadLocale.json',
    hasRoleUrl : contextRoot + '/user/hasRole.json',
    userChangePwdUrl : contextRoot + '/user/updatePassword.json',
    smartFileDownloadUrl : contextRoot + '/SmartFile/downloadFile',
    helpFileUrl : contextRoot + '/help/help.htm',
    locale : null,
    // pre
    // DS
    // controller
    layoutProperties : {
        height : "100%",
        width : "99%"
    },
    getDataSource : function(id, onGet) {    	
        var existDS;
        existDS = SmartDataSource.get(id);
        if (existDS) {
        	console.log('getDataSource(' + id + ")");
            if (onGet)
                onGet(existDS);
            return existDS;
        } else {
            this.loadDataSource(id, function(ds) {
                if (onGet)
                    onGet(ds);
                existDS = ds
                return existDS;
            });
        }
    },
    loadDataSource : function(id, onLoad) {
        console.log('loadDataSource(' + id + ")");
        this.dataRequest(this.dsRequestUrl, {
            ID : id
        }, function(resp, data, req) {
            if (resp.httpResponseCode == 403) {
                // handle denied dsRequestUrl
                isc.warn(resp.httpResponseText);
                if (onLoad)
                    onLoad(null);
            } else {
                var dsData = isc.JSON.decode(data); // isc.JSON.decode(data); //
                // eval(data);
                if (dsData.response.data.length > 0) {
                    App.registerDataSources(dsData.response.data, function(ds) {
                        if (onLoad)
                            onLoad(ds);
                    });
                } else {
                    if (dsData.response.status == 0 && onLoad)
                        onLoad(null);
                }
            }
        }, true, false);
    },
    dataRequest : function(actUrl, data, cbk, handleE, eval, reqProps) {
        if (!data)
            data = {};
        if (handleE == undefined)
            handleE = false;
        if (eval == undefined)
            eval = true;
        var request = isc.addProperties({
            params : data,
            actionURL : actUrl,
            willHandleError : handleE,
            sendNoQueue : true,
            evalResult : eval,
            callback : cbk
        }, reqProps);
        try {
            isc.RPCManager.sendRequest(request);
        } catch (e) {
            return e
        }
    },
    _evalPropertyValue : function(value) {
        var retval = value;
        try {

            if (isA.String(value)) {

                if (value.indexOf(":") > -1 && value.indexOf("{") == 0) {
                    retval = isc.JSON.decode(value)
                    for ( var prop in retval) {
                        if (retval.hasOwnProperty(prop)) {
                            retval[prop] = App._evalPropertyValue(retval[prop]);
                        }
                    }
                } else if (value.indexOf("function") == 0) {
                    retval = eval("(" + value + ")");
                } else if (value.indexOf("i18nMessages") != -1) {
                    retval = eval(value);
                }
            } else if (isA.Array(value)) {
                for (var i = 0; i < value.length; i++) {
                    var item = value[i];
                    if (isA.Object(item)) {

                        for ( var propkey in item) {
                            if (item.hasOwnProperty(propkey))
                                item[propkey] = App._evalPropertyValue(item[propkey]);
                        }
                    } else {
                        item = App._evalPropertyValue(item);
                    }
                    retval[i] = item;
                }
            }
        } catch (e) {
            retval = value;
        }
        return retval;
    },
    registerDataSources : function(data, onRegister) {
        // always an array
        var next = [], ret = [], ds;
        if (!isc.isAn.Array(data))
            data = [ data ];
        if (data)
            for (var i = 0; i < data.length; i++) {
                var dsc = data[i];
                //			if (dsc.hasOwnProperty("gridProperties") && dsc["gridProperties"]) {
                //				var props = isc.JSON.decode(dsc.gridProperties);
                //				for ( var propkey in props) {
                //					dsc[propkey] = props[propkey];
                //				}
                //			}
                if (dsc["customProfile"])
                    dsc.customProfile = isc.JSON.decode(dsc.customProfile);
                if (dsc["initValues"])
                    dsc.initValues = isc.JSON.decode(dsc.initValues);
                for ( var prop in dsc) {
                    if (dsc.hasOwnProperty(prop) && typeof (dsc[prop]) == "string") {
                        if (prop == "gridProperties" || prop == "formProperties") {} else if (prop == "dsProperties") {
                            var props = isc.JSON.decode(dsc.dsProperties);
                            for ( var propkey in props) {
                                dsc[propkey] = App._evalPropertyValue(props[propkey]);
                            }
                        } else if (dsc[prop].indexOf("i18nMessages") != -1) {
                            dsc[prop] = eval(dsc[prop]) // nahradi hodnotu z lokalizacie
                            // isc.i18nMessages
                        } else if (dsc[prop].indexOf("function(") != -1) {
                            dsc[prop] = eval("(" + dsc[prop] + ")");
                        }
                    }
                }
                if (dsc.fields)
                    for (var fname = 0; fname < dsc.fields.length; fname++) {
                        if (dsc.fields[fname].canSave == false)
                            dsc.fields[fname].canFocus = false;
                        if (dsc.fields[fname].validators) {
                            dsc.fields[fname].validators = App._evalPropertyValue(isc.JSON.decode(dsc.fields[fname].validators));
                        }
                        if (dsc.fields[fname].formItemProps) {
                            dsc.fields[fname].formItemProps = isc.JSON.decode(dsc.fields[fname].formItemProps);
                            var props = dsc.fields[fname].formItemProps
                            for ( var propkey in props) {
                                dsc.fields[fname][propkey] = App._evalPropertyValue(props[propkey]);
                                //						if (isA.String(dsc.fields[fname][propkey])) {
                                //
                                //							if (dsc.fields[fname][propkey].indexOf("function") != -1) {
                                //								dsc.fields[fname][propkey] = eval("(" + props[propkey] + ")");
                                //							} else if (dsc.fields[fname][propkey].indexOf("i18nMessages") != -1) {
                                //								dsc.fields[fname][propkey] = eval(dsc.fields[fname][propkey])
                                //							}
                                //						}
                            }
                            //					delete dsc.fields[fname].formItemProps
                        }
                        if (dsc.fields[fname].valueMap) {
                            var vmap = dsc.fields[fname].valueMap;
                            if (isA.String(vmap)) {
                                if (vmap.indexOf(":") > -1 && vmap.indexOf("{") > -1) {
                                    dsc.fields[fname].valueMap = App._evalPropertyValue(vmap);
                                } else
                                    dsc.fields[fname].valueMap = vmap.split(",");
                            }
                        }
                        // lokalizacia - messages
                        for ( var prop in dsc.fields[fname]) {
                            if (dsc.fields[fname].hasOwnProperty(prop) && typeof (dsc.fields[fname][prop]) == "string") {
                                if (dsc.fields[fname][prop].indexOf("i18nMessages") != -1) {
                                    dsc.fields[fname][prop] = eval(dsc.fields[fname][prop]) // nahradi
                                    // hodnotu
                                    // z
                                    // lokalizacie
                                    // isc.i18nMessages
                                }
                            }
                        }

                    }
                // lokalizacia operations
                if (dsc.operations && isAn.Array(dsc.operations))
                    for (var o = 0; o < dsc.operations.length; o++) {
                        var oper = dsc.operations[o];
                        for ( var prop in oper) {
                            if (oper.hasOwnProperty(prop) && typeof (oper[prop]) == "string") {
                                if (oper[prop].indexOf("i18nMessages") != -1) {
                                    try {
                                        oper[prop] = eval(oper[prop]) // nahradi hodnotu z
                                        // lokalizacie
                                        // isc.i18nMessages
                                    } catch (e) {
                                        // fackoff
                                    }
                                }
                                if (prop == "canPerform" && oper[prop].indexOf("function") != -1) {
                                    oper[prop] = eval("(" + oper[prop] + ")");
                                }
                            }
                        }
                        if (oper.operationParams)
                            for ( var par in oper.operationParams) {
                                var param = oper.operationParams[par];
                                if (param.formItemProps) {
                                    var props = isc.JSON.decode(param.formItemProps);
                                    for ( var propkey in props) {
                                        param[propkey] = App._evalPropertyValue(props[propkey]);
                                    }
                                    delete param.formItemProps;
                                }
                                var vmap = param.valueMap;
                                if (isA.String(vmap)) {
                                    if (vmap.indexOf(":") > -1 && vmap.indexOf("{") > -1) {
                                        param.valueMap = isc.JSON.decode(vmap);
                                    } else
                                        param.valueMap = vmap.split(",");
                                }
                                if (param.optionDataSource) {
                                    var opt = param.optionDataSource;
                                    var optDS = SmartDataSource.get(opt);
                                    if (!optDS && !next.contains(opt)) {
                                        next.push(opt);
                                    }
                                }
                                for ( var prop in param) {
                                    if (param.hasOwnProperty(prop) && typeof (param[prop]) == "string") {
                                        param[prop] = App._evalPropertyValue(param[prop])
                                    }
                                }

                            }

                    }
                ds = SmartDataSource.create(dsc);
                ds.setAccess();
                console.log(ds);
                ret.push(ds);
                isc.ClassFactory.addGlobalID(ds);
                // SmartDataSource.registerDataSource(ds);
                if (!App.dsMeta) {
                    App.dsMeta = {};
                }
                App.dsMeta[ds.id] = ds.ID;
            }
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].inheritsFrom) {
                var inh = ret[i].inheritsFrom;
                var inhDS = SmartDataSource.get(inh);
                if (!inhDS && !next.contains(inh)) {
                    next.push(inh);
                }
            }
            if (ret[i].detailFormDS) {
                var df = ret[i].detailFormDS;
                var dfDS = SmartDataSource.get(inh);
                if (!dfDS && !next.contains(df)) {
                    next.push(df);
                }
            }
            if (ret[i].fields)
                for ( var fname in ret[i].fields) {
                    var fld = ret[i].fields[fname];
                    if (fld.optionDataSource) {
                        var opt = fld.optionDataSource;
                        var optDS = SmartDataSource.get(opt);
                        if (!optDS && !next.contains(opt)) {
                            next.push(opt);
                        }
                    } else if (fld.foreignKey && fld.foreignKey.indexOf(".") > -1) {
                        var fk = fld.foreignKey.split(".")[0];
                        var fkDS = SmartDataSource.get(fk);
                        if (!fkDS && !next.contains(fk)) {
                            next.push(fk);
                        }
                    }
                }
        }

        if (next.length > 0) { // load more ?
            for (var n = 0; n < next.length; n++) {
                if (SmartDataSource.get(next[n]))
                    next.removeAt(n);
            }
            if (next.length > 0) {
                App.loadDataSource(next, function(xx) {
                    //					if (ret.length) {
                    onRegister(ds);
                    //					}
                });
            } else
                onRegister(ds); //if (ret.length)
        } else {
            //			if (ret.length) {
            onRegister(ds);
            //			}
        }
    },
    getHelp : function() {
        var hlp = isc.HelpLayout.create({
            homeTitle : isc.i18nMessages["smartsfs.buttons.obsah.label"],
            closeTitle : isc.i18nMessages["smartsfs.buttons.exit.label"],
            helpPath : App.helpFileUrl
        });
        return hlp;
    },
    _findParentSmartClass : function(iscObject, smartClass) {
        var curObject = iscObject;
        var fParent = null;
        try {
            while (!curObject.isA(smartClass)) {
                try {
                    curObject = curObject.parentElement
                } catch (e) {
                    break;
                }
            }
        } catch (e) {
            console.log('undefined parentElement');
        }
        if (curObject != undefined && curObject.isA(smartClass))
            return curObject;
        return null;
    },
    _findParentTabSet : function(iscObject) {
        var curObject = iscObject;
        var tabSet = null;
        while (!curObject.hasOwnProperty("tabSet")) {
            try {
                curObject = curObject.parentElement
            } catch (e) {
                break;
            }
        }
        if (curObject.hasOwnProperty("tabSet"))
            return curObject.tabSet;
        return null;
    },
    /**
     * expandovaci komponent - detail z gridu
     * 
     * @dataSource = grid.dataSource
     * @record = ziska v getExpansionComponent
     * @grid = ListGrid
     * @compHeight = musi byt vyska v px
     * @type = typ gridu
     * @brefField = backref
     */
    _createExpandRecordComp : function(dataSource, record, grid, compHeight, type, brefField, reqPK) {
        type = type || "normal";
        var req = reqPK || {};
        var dtlComp;
        var detailDS = DataSource.get(dataSource.detailFormDS) || dataSource;
        if (!reqPK) {
            var pkey = detailDS.getPrimaryKeyFieldName();
            req[pkey] = record[pkey];
        }
        //@override focusInside
        var expandoFocusInside = function() {
            if (this.detail.canEdit == true && (this._tabSet == null || this._tabSet.getSelectedTabNumber() == 0)) {
                for (var f = 0; f < this.detail.items.length; f++) {
                    if (this.detail.items[f].hasOwnProperty("canEdit") && this.detail.items[f].canEdit != false) {
                        this.detail.focusInItem(this.detail.items[f]);
                        break;
                    }
                }
            } else {
                if (this._tabSet) {
                    if (this._tabSet.getSelectedTabNumber() == 0) {
                        var itm = this.detail.items.find({
                            canFocus : true
                        });
                        this.detail.focusInItem(itm);
                    } else {
                        this._tabSet.getTabPane(this._tabSet.getSelectedTab()).focusInside();
                    }
                } else {
                    var itm = this.detail.items.find({
                        canFocus : true
                    });
                    this.detail.focusInItem(itm);
                }
            }
        };
        //@override detailcomp event method
        expandoDataSaved = function(isAccept, data) {
            //trigger po save, data=vratene v ds callbacku, 
            //user defined v override komponentu alebo vo form props datasource
            //defaults odstranenie app tabu
            if (isAccept === true && grid) {
                grid.collapseRecord(record);
                grid.focusInRow(grid.getFocusRow());
            }
            if (isA.Function(this.detail.dataSaved))
                this.detail.dataSaved(data);
        };
        var expandoAccept
        if (dataSource.detailFormDS) {
            dtlComp = App._customCompDetail(dataSource, detailDS, {
                dataSource : detailDS,
                initialValues : req,
                parentDataSource : dataSource,
                mode : "EDIT_BY_PK",
                brefField : brefField,
                brefValue : record[brefField],
                type : type,
                cancel : function() {
                    if (grid) {
                        grid.collapseRecord(record);
                        grid.focusInRow(grid.getFocusRow());
                    }
                },
                height : compHeight || grid.getHeight() || 350,
                _canSwitchLayout : false,
                _ownerComp : grid._ownerComp,
                focusInside : expandoFocusInside,
                dataSaved : expandoDataSaved,
                padding : 5
            }) || DetailFormComponentAny.create({
                dataSource : detailDS,
                initialValues : req,
                parentDataSource : dataSource,
                mode : "EDIT_BY_PK",
                brefField : brefField,
                brefValue : record[brefField],
                type : type,
                cancel : function() {
                    if (grid) {
                        grid.collapseRecord(record);
                        grid.focusInRow(grid.getFocusRow());
                    }
                },
                height : compHeight || grid.getHeight() || 350,
                _canSwitchLayout : false,
                _ownerComp : grid._ownerComp,
                focusInside : expandoFocusInside,
                dataSaved : expandoDataSaved,
                padding : 5
            });
        } else {
            dtlComp = App._customCompDetail(dataSource, detailDS, {
                dataSource : detailDS,
                type : type,
                initialValues : record,
                mode : "EDIT_RECORD",
                brefField : brefField,
                brefValue : record[brefField],
                type : type,
                cancel : function() {
                    if (grid) {
                        grid.collapseRecord(record);
                        grid.focusInRow(grid.getFocusRow());
                    }
                },
                height : compHeight || grid.getHeight() || 350,
                _canSwitchLayout : false,
                _ownerComp : grid._ownerComp,
                focusInside : expandoFocusInside,
                dataSaved : expandoDataSaved,
                padding : 5
            });
            if (!dtlComp) {
                if (dataSource.detailFormUri) {
                    req["brefField"] = brefField;
                    req["brefValue"] = record[brefField];
                    req["type"] = type;
                    req["mode"] = "EDIT_BY_PK";
                    req["dataSource"] = detailDS.ID;
                    dtlComp = isc.HTMLPane.create({
                        contentsURL : contextRoot + dataSource.detailFormUri,
                        contentsURLParams : req,
                        dataSource : detailDS,
                        cancel : function() {
                            if (grid) {
                                grid.collapseRecord(record);
                                grid.focusInRow(grid.getFocusRow());
                            }
                        },
                        height : compHeight || grid.getHeight() || 350,
                        _canSwitchLayout : false,
                        _ownerComp : grid._ownerComp,
                        focusInside : expandoFocusInside,
                        dataSaved : expandoDataSaved,
                        padding : 5
                    });
                } else {
                    // ak nema detail datasource
                    dtlComp = DetailFormComponentAny.create({
                        dataSource : detailDS,
                        type : type,
                        initialValues : record,
                        mode : "EDIT_RECORD",
                        brefField : brefField,
                        brefValue : record[brefField],
                        type : type,
                        cancel : function() {
                            if (grid) {
                                grid.collapseRecord(record);
                                grid.focusInRow(grid.getFocusRow());
                            }
                        },
                        height : compHeight || grid.getHeight() || 350,
                        _canSwitchLayout : false,
                        _ownerComp : grid._ownerComp,
                        focusInside : expandoFocusInside,
                        dataSaved : expandoDataSaved,
                        padding : 5
                    });
                }
            }
        }
        dtlComp.delayCall("focusInside");
        return dtlComp;
    },
    /**
     * _customCompDetail - vytvorenie detail komponentu definovaneho v CustomComponents parentDataSource = datasource gridu, resp. ten, kde je
     * customcomp v detailFormUri dataSource = objekt isc datasource detailu compProps = objekt s component properties
     * 
     * @return detail komponent
     * @author MKR
     */
    _customCompDetail : function(parentDataSource, dataSource, compProps, cbk) {
        var component = parentDataSource.detailFormUri;
        if (!dataSource.isA("DataSource")) {
            isc.logWarn("custom detail iba s nacitanym dataSource " + dataSource);
            return null;
        }
        //je to metoda CustomComponents classu
        if (isA.Function(CustomComponents[component])) {
            return CustomComponents.invokeDetailCompMethod(component, compProps);
        } else
            return null;
    },
    _showDetailByPK : function(dataSource, pkValue, tabSet, type, brefField, brefValue, ownerComp, fromGridCom) {
        type = type || "normal";
        var req = {};
        var dtlComp = {};
        if (!dataSource.detailFormDS && dataSource.canEdit === false && fromGridCom) {
            var rec = fromGridCom.grid.getSelectedRecord()
            var tabID = "_tabDetail_" + dataSource.ID + "_" + pkValue;
            dtlComp = App._customCompDetail(dataSource, dataSource, {
                dataSource : dataSource,
                type : type,
                initialValues : rec,
                mode : "EDIT_RECORD",
                brefField : brefField,
                brefValue : brefValue,
                type : type,
                tabSet : tabSet,
                _myTabName : tabID,
                _ownerComp : ownerComp,
                _fromGridCom : fromGridCom
            }) || DetailFormComponentAny.create({
                dataSource : dataSource,
                type : type,
                initialValues : rec,
                mode : "EDIT_RECORD",
                brefField : brefField,
                brefValue : brefValue,
                type : type,
                tabSet : tabSet,
                _myTabName : tabID,
                _ownerComp : ownerComp,
                _fromGridCom : fromGridCom
            });
            // TODO do title daj title field datasource namiesto id
            var tabTitle = dtlComp.dataSource.title + ' [' + rec[dataSource.titleField] + ']'
            if (!tabSet.getTab(tabID)) {
                var myTabNum = tabSet.getSelectedTabNumber();
                tabSet.addTab({
                    name : tabID,
                    title : tabTitle,
                    canClose : true,
                    pane : dtlComp
                }, (myTabNum + 1));
            }
            tabSet.selectTab(tabID);
        } else {
            var detailDSid = dataSource.detailFormDS || dataSource.ID;
            if (!(pkValue == null || pkValue == undefined)) {
                App.getDataSource(detailDSid, function(detailDS) {
                    if (detailDS) {
                        detailDS.fetchRecord(pkValue, function(result) {
                            if (!result.data || result.data == null)
                                return;
                            var record = result.data[0];
                            var pkey = detailDS.getPrimaryKeyFieldName();
                            req[pkey] = pkValue;
                            var tabID = "_tabDetail_" + detailDS.ID + "_" + pkValue;
                            if (dataSource.detailFormDS) {
                                dtlComp = App._customCompDetail(dataSource, detailDS, {
                                    dataSource : detailDS,
                                    initialValues : req,
                                    parentDataSource : dataSource,
                                    mode : "EDIT_BY_PK",
                                    brefField : brefField,
                                    brefValue : brefValue,
                                    type : type,
                                    tabSet : tabSet,
                                    _myTabName : tabID,
                                    _ownerComp : ownerComp,
                                    _fromGridCom : fromGridCom
                                }) || DetailFormComponentAny.create({
                                    dataSource : detailDS,
                                    initialValues : req,
                                    parentDataSource : dataSource,
                                    mode : "EDIT_BY_PK",
                                    brefField : brefField,
                                    brefValue : brefValue,
                                    type : type,
                                    tabSet : tabSet,
                                    _myTabName : tabID,
                                    _ownerComp : ownerComp,
                                    _fromGridCom : fromGridCom
                                });
                            } else {
                                dtlComp = App._customCompDetail(dataSource, detailDS, {
                                    dataSource : detailDS,
                                    type : type,
                                    initialValues : record,
                                    mode : "EDIT_RECORD",
                                    brefField : brefField,
                                    brefValue : brefValue,
                                    type : type,
                                    tabSet : tabSet,
                                    _myTabName : tabID,
                                    _ownerComp : ownerComp,
                                    _fromGridCom : fromGridCom
                                });
                                if (!dtlComp) {
                                    if (dataSource.detailFormUri) {
                                        if (dataSource.detailFormUri.indexOf("/") > -1) {
                                            //je to uri lebo ma slash
                                            req["brefField"] = brefField;
                                            req["brefValue"] = brefValue;
                                            req["type"] = type;
                                            req["tabSet"] = tabSet.ID;
                                            req["mode"] = "EDIT_BY_PK";
                                            req["dataSource"] = detailDS.ID;
                                            dtlComp = isc.HTMLPane.create({
                                                contentsURL : contextRoot + dataSource.detailFormUri,
                                                contentsURLParams : req,
                                                dataSource : detailDS,
                                                _myTabName : tabID,
                                                _ownerComp : ownerComp,
                                                _fromGridCom : fromGridCom
                                            });
                                        }
                                    } else {
                                        // ak nema detail datasource
                                        dtlComp = DetailFormComponentAny.create({
                                            dataSource : detailDS,
                                            type : type,
                                            initialValues : record,
                                            mode : "EDIT_RECORD",
                                            brefField : brefField,
                                            brefValue : brefValue,
                                            type : type,
                                            tabSet : tabSet,
                                            _myTabName : tabID,
                                            _ownerComp : ownerComp,
                                            _fromGridCom : fromGridCom
                                        });
                                    }
                                }
                            }
                            // TODO do title daj title field datasource namiesto id
                            var tabTitle = dtlComp.dataSource.title + ' [' + record[dataSource.titleField] + ']'
                            if (!tabSet.getTab(tabID)) {
                                var myTabNum = tabSet.getSelectedTabNumber();
                                tabSet.addTab({
                                    name : tabID,
                                    title : tabTitle,
                                    canClose : true,
                                    pane : dtlComp
                                }, (myTabNum + 1));
                            }
                            tabSet.selectTab(tabID);
                        });
                    }
                });
            }
        }

    },
    _addRecord : function(comp, item, clone, initValsProps, tabSet) {
        var C = comp;
        var I = item;
        if (!I || I == undefined)
            I = C;
        var req = {};
        if (C.brefField)
            req[C.brefField] = C.brefValue;
        if(initValsProps)
           isc.addProperties(req,initValsProps);
        var dtlComp;
        var tabName = "_tabDetail_" + I.dataSource.ID + "_new" + isc.timeStamp();
        if (I.dataSource.detailFormDS) {
            App.getDataSource(I.dataSource.detailFormDS, function(getDS) {
                if (getDS) {
                    tabName = "_tabDetail_" + getDS.ID + "_new" + isc.timeStamp();
                    if (getDS.initValues)
                        isc.addProperties(req, getDS.initValues);
                    dtlComp = App._customCompDetail(I.dataSource, getDS, {
                        dataSource : getDS,
                        initialValues : req,
                        parentDataSource : I.dataSource,
                        mode : "NEW",
                        type : C.type,
                        tabSet : tabSet?tabSet:C,
                        _myTabName : tabName,
                        _ownerComp : I._ownerComp,
                        _fromGridCom : I
                    }) || DetailFormComponentAny.create({
                        dataSource : getDS,
                        initialValues : req,
                        parentDataSource : I.dataSource,
                        mode : "NEW",
                        type : C.type,
                        tabSet : tabSet?tabSet:C,
                        _myTabName : tabName,
                        _ownerComp : C._ownerComp,
                        _fromGridCom : I
                    });
                }
            });
        } else {
            dtlComp = App._customCompDetail(I.dataSource, I.dataSource, {
                dataSource : I.dataSource,
                type : C.type,
                initialValues : req,
                mode : "NEW",
                tabSet : tabSet?tabSet:C,
                _myTabName : tabName,
                _ownerComp : I._ownerComp,
                _fromGridCom : I

            });
            if (!dtlComp) {
                if (I.dataSource.detailFormUri) {
                    req["type"] = O.type;
                    req["tabSet"] = tabSet?tabSet.ID:O.tabSet.ID;
                    req["mode"] = "NEW";
                    dtlComp = isc.HTMLPane.create({
                        contentsURL : contextRoot + I.dataSource.detailFormUri,
                        contentsURLParams : req,
                        dataSource : I.dataSource,
                        _myTabName : tabName,
                        _ownerComp : I._ownerComp,
                        _fromGridCom : I
                    });
                } else {
                    // ak nema detail datasource
                    if (I.dataSource.initValues)
                        isc.addProperties(req, I.dataSource.initValues);
                    dtlComp = DetailFormComponentAny.create({
                        dataSource : I.dataSource,
                        initialValues : req,
                        mode : "NEW",
                        type : C.type,
                        tabSet : tabSet?tabSet:C,
                        _myTabName : tabName,
                        _ownerComp : I._ownerComp,
                        _fromGridCom : I

                    });
                }
            }
        }
        if (clone) {
            var initVals
            if (C.isA("GridComponentAny"))
                initVals = C.grid.getSelectedRecord();
            if (C.isA("DetailComponentTemplate"))
                initVals = C.detail.valuesManager.getValues();
            if (initVals) {
                dtlComp.detail.valuesManager.setValues(initVals)
                var vals = dtlComp.detail.valuesManager.getValues();
                vals.id = null
                vals.createdBy = null
                vals.dateCreated = null
                vals.updatedBy = null
                vals.lastUpdated = null
                vals.version = null
                dtlComp.detail.valuesManager.setValues(vals)
            }
        }
        // var myTabNum = C.tabSet.getSelectedTabNumber();
        var toTabSet = C
        if (tabSet?tabSet:toTabSet != toTabSet) toTabSet = tabSet
        var myTabNum = toTabSet.getSelectedTabNumber();
        if (C.isA("DetailComponentTemplate")) {
           dtlComp.tabSet = C.tabSet;
           toTabSet.tabSet.addTab({
               name : tabName,
               title : dtlComp.dataSource.title + ' [' + isc.i18nMessages["default.new.label"].messageArgs("") + ']',
               canClose : true,
               pane : dtlComp
           }, (myTabNum + 1));
           toTabSet.tabSet.selectTab(tabName);
        } else {
        	toTabSet.addTab({
              name : tabName,
              title : dtlComp.dataSource.title + ' [' + isc.i18nMessages["default.new.label"].messageArgs("") + ']',
              canClose : true,
              pane : dtlComp
          }, (myTabNum + 1));
          toTabSet.selectTab(tabName);
        }
    },
    _convertObjToArray : function(obj) {
        if (isA.Array(obj))
            return obj;
        var newArray = [];
        for (var key = 0; key < Object.keys(obj).length; key++) {
            var member = Object.keys(obj)[key];
            newArray.add(obj[Object.keys(obj)[key]]);
        }
        return newArray;
    }
}).addProperties({
    height : "99%",
    width : "100%",
    splitPane : null,
    keyDown : function() {
        // console.log("App KEY DOWN:" + isc.Event.getKey());
        switch (isc.Event.getKey()) {
        case "f10":
            App.get.splitPane.navigationPane.focus();
            return false;
            break;
        case "f5":
            return false;
            break;
        default:
            return;
        }
    },
    initWidget : function() {
        this.Super("initWidget", arguments);
        // singleton
        App.get = this;
    },
    loadUser : function(creds, cbk, relogin, cbk2) {
        var R = this;
        // lokalizacia aby aj prvy krat bol podla browsera
        Lokalizacia.setLocale(R.locale, function(locale, auth) {
            var useOTP = R.config["smartsfs.security.useOTP"].toString().toBoolean();
            R.locale = locale;
            if (creds == undefined || creds == null) {
                creds = {};
                if (auth !== undefined && auth != null && auth.hasOwnProperty("enabled")) {
                    // je na servri identifikovany user
                    if (auth.enabled == true)
                        R.user = SmartUser.create(auth);
                }
            } else {
                // presiel cez login formular
                creds.j_username = creds.username;
                creds.j_password = creds.password;
                if (relogin && !auth) {
                    // aby znova zbehol login, mozem ho vyprazdnit, bo uz presiel cez
                    // login
                    R.user = undefined;
                }
            }
            if (R.user != undefined && R.user.enabled) {
                document.title = isc.i18nMessages["default.application.title"];
                if (cbk)
                    cbk(true);
                if (useOTP && R.user.hasAnyRole("ROLE_PRE_AUTH")) {
                    isc.showOTPDialog(R.user.firstOTPLogin, relogin, cbk2);
                } else if (!(relogin == true))
                    R.createAppLayout();
                else if (cbk2)
                    cbk2();
            } else {
                creds.ajax = true;
                App.dataRequest(App.loginRequestUrl, creds, function(resp, data, req) {
                    if (data) {
                        var ret = data; // isc.JSON.decode(data);
                        if (ret.success) {
                            // overeny -> nacti
                            App.dataRequest(App.userRequestUrl, {
                                username : ret.username
                            }, function(resp, data) {
                                var ret = data;// isc.JSON.decode(data);
                                R.user = SmartUser.create(ret.response.data);
                                Lokalizacia.setLocale(R.user.lang, function(locale) {
                                    R.locale = locale;
                                    document.title = isc.i18nMessages["default.application.title"];
                                    if (cbk)
                                        cbk(true);

                                    if (useOTP) {
                                        isc.showOTPDialog(ret.response.data.firstOTPLogin.toString().toBoolean(), relogin, cbk2);
                                    } else {
                                        if (!(relogin == true))
                                            R.createAppLayout();
                                        else if (cbk2)
                                            cbk2();
                                    }
                                });
                            });
                        } else {
                            if (ret.error == isc.i18nMessages["springSecurity.errors.login.passwordExpired"]) {
                                isc.warn(isc.i18nMessages["springSecurity.errors.login.passwordExpired"], function() {
                                    if (cbk)
                                        cbk(true);
                                    SmartUser.changePasswordDialog({
                                        canClose : false,
                                        expired : true,
                                        expiredUser : creds.j_username
                                    });
                                });
                            } else {
                                if (cbk)
                                    cbk(false, ret.error);
                                else
                                    R.loginUser(relogin, cbk2);
                            }
                        }
                    }
                }, true);
            }
        });
    },
    loginUser : function(relogin, cbk) {
        // show login form
        var props = {
            formFields : isc.LoginDialog.getPrototype().formDefaultFields
        };
        if (relogin) {
            props.usernameItemProperties = {
                disabled : true
            };
        }
        var ld = isc.showLoginDialog(function(data, retFn) {
            App.get.loadUser(data, retFn, relogin, cbk);
        }, props);
        //destroy login dialog po uspesnom prihlaseni
        ld.observe(App.get, "userLoginSucces", "observer.destroy()");
        if (relogin) {
            ld.loginForm.getItem('usernameItem').setValue(App.get.user.username);
            ld.loginForm.getItem('passwordItem').focusInItem();
        }
    },
    userLoginSucces : function() {
        console.log('user logged in');
    },
    logoutUser : function() {
        // App.dataRequest(App.logoutRequestUrl, {ajax:true}, function(resp, data,
        // req) {
        // App.get.loginUser(false);
        // },false,false);
        var logoutUrl = window.location.origin
        if (!logoutUrl)
            logoutUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        logoutUrl = logoutUrl + App.logoutRequestUrl
        window.location.href = logoutUrl
    },
    createLoginMenu : function() {
        var changePasswSupported = App.get.config["smartsfs.changePassword.supported"].toString().toBoolean();
        var menuItems = [];
        menuItems.push({
            title : isc.i18nMessages["springSecurity.logout.button"],
            click : function() {
                App.get.logoutUser();
            }
        });
        if (changePasswSupported || App.get.user.hasAnyRole("ROLE_SUPER")) {
            menuItems.push({
                title : isc.i18nMessages["springSecurity.expired.header"],
                click : function() {
                    SmartUser.changePasswordDialog({});
                }
            });
        }
        menuItems.push({
            title : isc.i18nMessages["user.myaccount.title"],
            click : function() {
                App.getDataSource(App.userDataSource, function(userDS) {
                    App._showDetailByPK(userDS, App.get.user.id, SmartTabSet.getById("appTabSet"));
                });
            }
        });
        return isc.Menu.create({
            showIcons : false,
            defaultWidth : 100,
            data : menuItems
        });
    },
    createNavPane : function(callBack) {
        App.getDataSource(App.navDS, function(menuDS) {
            if (menuDS) {
                var navigationPane = isc.TreeGrid.create({
                    dataSource : menuDS,
                    autoFetchData : true,
                    loadDataOnDemand : false,
                    // showHeader : isc.Browser.isDesktop,
                    showHeader : false,
                    showDropIcons : false,
                    canSort : false,
                    sortField : "position",
                    dataProperties : {
                        openProperty : "isOpen"
                    },
                    nodeClick : function(grid, node, recnum) {
                        if (node.isFolder) {
                            this.toggleFolder(node);
                        } else {
                            var tabID = "_tabGrid_" + node.id;
                            if (appTabSet.getTab(tabID)) {
                                appTabSet.selectTab(tabID);
                            } else {
                                if (node.uri) {
                                    var req = {};
                                    req["type"] = "normal";
                                    req["tabSet"] = appTabSet.ID;
                                    req["dataSource"] = node.gridDS
                                    var comp = isc.HTMLPane.create({
                                        contentsURL : contextRoot + node.uri,
                                        contentsURLParams : req,
                                        autoDraw : true,
                                        _myTabName : tabID
                                    });
                                    appTabSet.addTab({
                                        title : node.title,
                                        canClose : true,
                                        // ID : tabID,
                                        name : tabID,
                                        pane : comp
                                    });
                                    appTabSet.selectTab(tabID);
                                    App.get.splitPane.showDetailPane();
                                } else {
                                    if (node.customCompFn) {
                                        CustomComponents.invokeCompMethod(node.customCompFn, appTabSet, "normal", node.gridDS, function(comp, tabDS) {
                                            if (comp) {
                                                comp._myTabName = tabID;
                                                appTabSet.addTab({
                                                    title : tabDS.pluralTitle,
                                                    canClose : true,
                                                    // ID : tabID,
                                                    name : tabID,
                                                    pane : comp
                                                });
                                                appTabSet.selectTab(tabID);
                                                App.get.splitPane.showDetailPane();
                                            }
                                        });
                                    } else if (node.gridDS) {
                                        App.getDataSource(node.gridDS, function(tabDS) {
                                            if (tabDS) {
                                                var tabGrid = GridComponentAny.create({
                                                    dataSource : tabDS,
                                                    tabSet : appTabSet,
                                                    _myTabName : tabID,
                                                    type : "normal"
                                                });
                                                appTabSet.addTab({
                                                    title : tabDS.pluralTitle,
                                                    canClose : true,
                                                    // ID : tabID,
                                                    name : tabID,
                                                    pane : tabGrid
                                                });
                                                appTabSet.selectTab(tabID);
                                            }
                                            App.get.splitPane.showDetailPane();
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
                callBack(navigationPane);
            }
        });
    },
    createHomePane : function() {
        return isc.HTMLPane.create({
            // contents:isc.i18nMessages["smartsfs.homepage.contents"]
            contentsURL : App.appRootUrl + '/home'
        })
    },
    createAppLayout : function() {
        console.log(App.get.user);
        //user uspesne prihlaseny - ak isiel cez login dialog a zavolanie urobi destroy logindialogu
        App.get.userLoginSucces();
        App.userDataSource = App.get.config["smartsfs.datasources.user"] || App.userDataSource;
        App.navDS = App.get.config["smartsfs.datasources.menu"] || App.navDS;
        App.smartSource = App.getDataSource("SmartSource") || App.smartSource;
        // App.getDataSource("SmartSource");//globalne operacie su na SmartSource DS
        if (App.get.config["smartsfs.userSetting.supported"].toString().toBoolean())
            App.getDataSource("SmartUserSettings");//globalne potrebny DS
        var ms = [];
        this.splitPane = isc.SplitPane.create({
            autoDraw : false,
            navigationTitle : isc.i18nMessages["default.application.title"],
            showLeftButton : false,
            showRightButton : true,
            paneChanged : function(pane) {
                if (isc.Browser.isHandset) {
                    if (pane == "detail") {
                        this.navigationBar.rightButton.hide();
                    } else {
                        this.navigationBar.rightButton.show();
                    }
                }
            }
        });

        var loginMenu = App.get.createLoginMenu();

        this.splitPane.setDetailToolButtons([ isc.Label.create({
            contents : isc.i18nMessages["springSecurity.logged.label"],
            wrap : false,
            padding : 5
        }), isc.MenuButton.create({
            title : " <b>" + App.get.user.titlename + "</b>",
            menu : loginMenu,
            autoFit : true
        }) ]);

        // hlp button create
        if (typeof App.getHelp == "function" && App.helpFileUrl) {
            var A = this;
            var btnHelp = isc.BtnIcon.create({
                icon : '[SKIN]/custom/help.png',
                title : 'Help',
                prompt : isc.i18nMessages["smartsfs.buttons.help.label"],
                minWidth : 24,
                margin : 15,
                click : function() {
                    if (this.fillScreenWindow == null) {
                        this.fillScreenWindow = isc.HelpWindow.create({
                            title : isc.i18nMessages["smartsfs.buttons.help.label"]
                        })
                        this.fillScreenWindow.addMember(App.getHelp())
                    }
                    this.fillScreenWindow.show();
                    this.fillScreenWindow.bringToFront();
                    this.fillScreenWindow.focus();
                }
            });
            this.splitPane.detailToolButtons.push(btnHelp)
        }

        var detailPane = isc.SmartTabSet.create({
            ID : "appTabSet",
            tabBarPosition : "top",
            autoDraw : false,
            canCloseTabs : true,
            destroyPanes : true
        });
        App.get.createNavPane(function(navigationPane) {
            App.get.splitPane.setNavigationPane(navigationPane);
            if (isc.Browser.isHandset) {
                App.get.splitPane.navigationBar.rightButton.addProperties({
                    click : function() {
                        App.get.splitPane.showDetailPane();
                    },
                    icon : '[SKIN]/NavigationBar/back_arrow~2_rtl.png'
                });
            }

            App.get.splitPane.setDetailPane(detailPane);
            if (isc.Browser.isHandset)
                isc.Page.updateViewport(1, null, null, true);
            if (!isc.Browser.isHandset)
                ms.push(Header.create());
            ms.push(App.get.splitPane);
            if (!isc.Browser.isHandset)
                ms.push(Foother.create());
            appTabSet.addTab({
                title : isc.i18nMessages["default.home.label"],
                canClose : false,
                icon:"[SKIN]/custom/house.png",
                pane : App.get.createHomePane()
            });

            App.get.splitPane.showNavigationPane();
            App.get.setMembers(ms);
            App.get.draw();

        });
    }
});

isc.ClassFactory.defineClass("Header", "HLayout").addProperties({
    height : 37,
    width : '100%',
    overflow : 'hiden',
    leaveScrollbarGap : false,
    disabled : true,
    members : [ isc.HTMLPane.create({
        overflow : 'hidden',
        contents : function() {
            return App.get.config["smartsfs.header.contents"];
        }
    }) ]
});

isc.ClassFactory.defineClass("Foother", "HLayout").addProperties({
    height : 15,
    width : '100%',
    overflow : 'hiden',
    disabled : true,
    members : [ isc.HTMLPane.create({
        overflow : 'hidden',
        contents : function() {
            return App.get.config["smartsfs.foother.contents"];
        }
    }) ]
});

//Help
isc.ClassFactory.defineClass("HelpWindow", "Window").addProperties({
    ID : "helpWindow",
    placement : "nearOrigin",
    canDragResize : true,
    redrawOnResize : true,
    keepInParentRect : true,
    //autoCenter: true,
    canFocus : true,
    showMinimizeButton : true,
    showMaximizeButton : true,
    animateMinimize : true,
    bodyColor : "#829CC0",
    width : "35%",
    height : "92%",
    right : 0,
    left : "65%",
    top : "8%",
    headerIconDefaults : {
        src : '[SKIN]/custom/help.png',
        width : 16,
        height : 16
    },
    keyDown : function() {
        var key = isc.EventHandler.getKey();
        if (((key == "Q") && (isc.EventHandler.ctrlKeyDown())) || (key == "Escape")) {
            this.close();
        }
    },
    initWidget : function() {
        this.Super("initWidget", arguments);
        if (isc.Browser.isHandset) {
            this.setWidth("100%");
            this.placement = "fillScreen";
        }
    }
});

isc.ClassFactory.defineClass("HelpLayout", "VLayout").addProperties({
    width : "100%",
    height : "99%",
    homeTitle : "Obsah",
    closeTitle : "Zatvoriť",
    helpPath : contextRoot + '/help/help.htm',
    btbHome : function() {
        var H = this;
        return isc.IButton.create({
            title : H.homeTitle,
            autoFit : true,
            icon : '[SKIN]/custom/house.png',
            showIcon : true,
            click : function() {
                hlpPane.setContentsURL(H.helpPath)
                this.topElement.focus()
            }
        });
    },
    btnExit : function() {
        var H = this;
        return isc.IButton.create({
            title : H.closeTitle,
            autoFit : true,
            icon : '[SKIN]/custom/cancel.png',
            showIcon : true,
            click : function() {
                this.topElement.close()
            }
        });
    },
    hlpStack : function() {
        var H = this;
        return isc.HStack.create({
            height : 30,
            layoutMargin : 10,
            membersMargin : 10,
            membersWidth : 300,
            showEdges : true,
            initWidget : function() {
                this.Super("initWidget", arguments);
                this.addMember(H.btbHome());
                this.addMember(H.btnExit());
            }
        });
    },
    hlpPage : function() {
        var H = this;
        return isc.HTMLPane.create({
            ID : "hlpPane",
            showEdges : false,
            canFocus : false,
            backgroundColor : "white",
            contentsURL : H.helpPath,
            contentsType : "page"
        });
    },
    initWidget : function() {
        this.Super("initWidget", arguments);
        this.addMember(this.hlpStack());
        this.addMember(this.hlpPage());
    }
});
