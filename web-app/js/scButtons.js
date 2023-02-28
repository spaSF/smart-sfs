isc.ClassFactory.defineClass('BtnIcon', 'IconButton').addProperties({
	showIcon : true,
	showButtonTitle : false,
	iconWidth : 30,
	iconHeight : 30
});

// Grid Buttons
isc.ClassFactory.defineClass('advFilt', 'BtnIcon').addProperties({
	title : 'Advanced Filter',
	// prompt : 'Prepnúť štandardné/rozšírené kritéria',
	icon : '[SKIN]/actions/search.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.toggleFilter.prompt"];
	},
	click : function() {
		if (this.dataComp.advFilter.isVisible()) {
			this.dataComp.advFilter.clearCriteria();
			this.dataComp.advFilter.hide();
			this.dataComp.getMember(1).getMember(1).hide();
			this.dataComp.getMember(1).getMember(2).show(); // ikona obycajny
			// filter -
			// btnFilter
			this.dataComp.grid.setShowFilterEditor(true);
		} else {
			this.dataComp.advFilter.show();
			this.dataComp.getMember(1).getMember(1).show();
			this.dataComp.getMember(1).getMember(2).hide(); // ikona obycajny
			// filter -
			// btnFilter
			this.dataComp.grid.setShowFilterEditor(false);
			this.dataComp.grid.setFilterEditorCriteria(null);
		}
	}
});

isc.ClassFactory.defineClass('advFiltRun', 'BtnIcon').addProperties({
	title : 'Advanced Filter',
	prompt : 'Advanced Filtruj',
	icon : '[SKIN]/actions/filter.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.doFilter.prompt"];
	},
	click : function() {
		if (this.dataComp.advFilter.isVisible()) {
			this.dataComp.grid.filterData(this.dataComp.advFilter.getCriteria());
		}
	}
});

isc.ClassFactory.defineClass('btnFilter', 'BtnIcon').addProperties({
	title : 'Filter',
	prompt : 'Filtruj',
	icon : '[SKIN]/actions/filter.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.doFilter.prompt"];
	},
	click : function() {
		this.dataComp.grid.filterData(this.dataComp.grid.getFilterEditorCriteria());
	}
});

isc.ClassFactory.defineClass('btnRel', 'BtnIcon').addProperties({
	id : 'btnRel',
	title : 'Reload',
	prompt : 'Reload',
	icon : '[SKIN]/actions/refresh.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.reload.prompt"];
	},
	click : function() {
		this.dataComp.invalidateCache();
	}

});

isc.ClassFactory.defineClass('clrFilt', 'BtnIcon').addProperties({
	id : 'clrFilt',
	title : 'Clear Filter',
	// prompt : 'Clear Filter',
	icon : '[SKIN]/custom/clear_filter.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.clearFilter.prompt"];
	},
	click : function() {
		if (this.dataComp.hasOwnProperty('advFilter')) {
			this.dataComp.advFilter.clearCriteria();
		}
		this.dataComp.grid.setFilterEditorCriteria(null);
		this.dataComp.grid.filterData();
	}
});

isc.ClassFactory.defineClass('btnDetail', 'BtnIcon').addProperties({
	id : 'btnDetail',
	title : 'Detail',
	prompt : 'Detail',
	icon : '[SKIN]/actions/view.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.showdetail.prompt"];
	},
	click : function() {
		this.dataComp.parentElement.mode = "detail";
		this.dataComp.parentElement.getDetail(false);
	}
});

// Detail Filters
isc.ClassFactory.defineClass('btnCancel', 'BtnIcon').addProperties({
	id : 'btnCancel',
	title : 'Cancel',
	prompt : 'Cancel',
	name : "cancel",
	icon : '[SKIN]/custom/cancel.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.cancel.prompt"];
	},
	click : function() {
		this.dataComp.cancel();
	}
});

isc.ClassFactory.defineClass('btnSave', 'BtnIcon').addProperties({
	id : 'btnSave',
	title : 'Save',
	prompt : 'Save',
	name : "save",
	disabled : true,
	icon : '[SKIN]/custom/save.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.save.prompt"];
	},
	click : function() {
		this.dataComp.save();
	}
});

isc.ClassFactory.defineClass('btnAdd', 'BtnIcon').addProperties({
	id : 'btnAdd',
	title : 'Add',
	// prompt : ,
	name : "add",
	icon : '[SKIN]/actions/add.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.create.prompt"].messageArgs("");
	},
	click : function() {
		this.dataComp.getDetail(true);
	}
});

isc.ClassFactory.defineClass('btnRem', 'BtnIcon').addProperties({
	id : 'btnRem',
	title : 'Remove',
	prompt : 'Remove',
	name : "remove",
	icon : '[SKIN]/actions/remove.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.remove.prompt"].messageArgs("");
	},
	click : function() {
		this.dataComp.remove();
	}
});

isc.ClassFactory.defineClass('btnEdit', 'BtnIcon').addProperties({
	id : 'btnEdit',
	title : 'Edit',
	prompt : 'Edit',
	name : "edit",
	icon : '[SKIN]/actions/edit.png',
	minWidth : 24,
	showDisabledIcon : true,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.edit.prompt"].messageArgs("");
	},
	click : function() {
		// this.dataComp.setCanEdit(true);
		// for (var f = 0; f < this.dataComp.items.length; f++) {
		// if (this.dataComp.items[f].hasOwnProperty("canEdit")
		// && this.dataComp.items[f].canEdit != false) {
		// this.dataComp.focusInItem(this.dataComp.items[f]);
		// break;
		// }
		// }
		// this.setDisabled(true);
		this.dataComp.edit();
	}
});

isc.ClassFactory.defineClass('btnAccept', 'BtnIcon').addProperties({
	id : 'btnAccept',
	title : 'Accept',
	prompt : 'Accept',
	name : "accept",
	disabled : true,
	icon : '[SKIN]/custom/ok.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.accept.prompt"].messageArgs("");
	},
	click : function() {
		this.dataComp.accept();
	}
});

isc.ClassFactory.defineClass('btnDetailRel', 'BtnIcon').addProperties({
	id : 'btnDetailRel',
	title : 'Reload',
	prompt : 'Reload',
	name : "reload",
	icon : '[SKIN]/actions/refresh.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.reload.prompt"];
	},
	click : function() {
		// this.dataComp.valuesManager.resetValues();
		this.dataComp.reload();
	}
});

isc.ClassFactory.defineClass('btnShowFilter', 'BtnIcon').addProperties({
	title : 'Set filter',
	prompt : 'Show filter',
	icon : '[SKIN]/custom/setfilter_Disabled.png',
	dataComp : null,
	minWidth : 24,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.showfilter.prompt"];
	},
	click : function() {
		if (this.dataComp.grid.showFilterEditor) {
			this.setIcon('[SKIN]/custom/setfilter_Disabled.png');
			this.dataComp.showFilter('Disabled');
		} else {
			this.setIcon('[SKIN]/custom/setfilter.png');
			this.dataComp.showFilter('Enabled');
		}

	}
});

isc.ClassFactory.defineClass('btnCloneRec', 'BtnIcon').addProperties({
	id : 'btnDetailRel',
	title : 'Clone record',
	prompt : 'Clone record',
	name : "copyrec",
	icon : '[SKIN]/custom/copy_paste.png',
	minWidth : 24,
	dataComp : null,
	initWidget : function() {
		this.Super("initWidget", arguments);
		this.prompt = isc.i18nMessages["smartsfs.buttons.cloneec.prompt"];
	},
	click : function() {
		// this.dataComp.valuesManager.resetValues();
		this.dataComp.clone();
	}
});

isc.ClassFactory.defineClass('btnUserSetting', 'HLayout').addProperties({
	dataComp : null,
	usCriteria : null,
	usFilter : function() {
		return {
				_constructor : "AdvancedCriteria",
				operator : "and",
				criteria : [ 
				    { fieldName : "name", operator : "notNull" }, 
					{ fieldName : "appCase", operator : "equals", value : "grid" }, 
					{ fieldName : "appObject", operator : "equals", value : this.dataComp.dataSource.name }
				]
			};	
	},
	sysFilter : function() {
		return {
			_constructor : "AdvancedCriteria",
			operator : "and",
			criteria : [ 
			            { fieldName : "name", operator : "isNull" }, 
			            { fieldName : "appObject", operator : "equals", value : this.dataComp.dataSource.name }
			]
		};	
	},
	getUSDefData : function (data) {
		App.getDataSource("SmartUserSettings", function(ds) {
			ds.fetchData(this.sysFilter(), function(d) {
				if (d.data.length > 0) {
					for (var i=0;i<d.data.length;i++) {
						data = d.data[i];
					}
				}
			})
		});
	},
	getUSCriteria : function(){
		return this.usCriteria;
	},
	initWidget : function() {
		this.Super("initWidget", arguments);
		//musim najprv ziskat datasource aby v combe uz bol
//		App.getDataSource("SmartUserSettings", function(settingDS) {});
		var C = this;
		this.usdf = isc.DynamicForm.create({ 
			 	_handleSize : function() {		 		
			 		//debugger;		
			 		if (App.get.splitPane.detailToolStrip.getVisibleWidth() - 12 > 500) {
			 			this.getField("name").setWidth(150);
			 			this.setWidth(209);
			 			C.setWidth(257);
			 		} else {		 			
				 		if (C.dataComp.toolBar && C.dataComp.toolBar.members.length > 0 && C.dataComp.toolBar.members[0].memberSizes) {
				 			var glen = App.get.splitPane.detailToolStrip.getVisibleWidth() - 12;	
				 			var blen = 0;			 			
				 			var ms = C.dataComp.toolBar.members[0].memberSizes.length;
				 			//for (var i = 0; i < C.dataComp.toolBar.members[0].memberSizes.length; i++) {
				 			//	blen = blen + C.dataComp.toolBar.members[0].memberSizes[i];
				 			//}
				 			blen = C.dataComp.toolBar.getVisibleWidth();
				 			if (blen > glen) { // && glen > 379) {
				 				var rozdiel = blen - glen;
				 				if (rozdiel > 0) {			 				
					 				this.getField("name").setWidth(this.getField("name").getVisibleWidth() - rozdiel);
					 				this.setWidth(this.getVisibleWidth() - rozdiel);
					 				C.setWidth(C.getVisibleWidth() - rozdiel);
				 				}
				 			}
				 		}
			 		}
			 	},
      	        initialCriteria : this.usFilter(),
				usssave : function() {
					//debugger;
					var val = this.getField ("name").getValue();			
					if ((val && val != "0") || App.get.user.hasAnyRole("ROLE_SUPER"))  {
						var plRec = this.getField ("name").getSelectedRecord();			
						var F = this;
						App.getDataSource("SmartUserSettings", function(settingDS) { 
							var props = [{fields: C.dataComp.grid.fields}];
							props.push({groupByField: C.dataComp.grid.groupByField});
							props.push({currentGroupState: C.dataComp.grid.currentGroupState});							
							props.push({sortFieldNum: C.dataComp.grid.sortFieldNum});
							props.push({sortField: C.dataComp.grid.sortField});							
							props.push({sortDirection: C.dataComp.grid.sortDirection});
							props.push({showGridSummary: C.dataComp.grid.showGridSummary});
							props.push({showGroupSummary: C.dataComp.grid.showGroupSummary});
							props.push({initialCriteria: C.dataComp.grid.initialCriteria});	
							props.push({visibleAdvFilter: C.dataComp.advFilter.isVisible()});	
							var MJsonGridF = isc.JSON.encode(props,{prettyPrint : false});
							var fld = {};
							if (plRec || !val) {
								if (!val) {
									App.getDataSource("SmartUserSettings", function(ds) {
										ds.fetchData(C.sysFilter(), function(d) {
											if (d.data.length > 0) {
												for (var i=0;i<d.data.length;i++) {
													plRec = d.data[i];
													fld = {id: plRec.id, useDefault : false, settingObject : MJsonGridF }
													ds.updateData(fld, function(resp, data, req) {
														settingDS.updateCaches({operationType: "update", data: isA.Array(data) ? data : [ data ]});
														isc.say(isc.i18nMessages["smartsfs.userSetting.saved"].messageArgs(plRec?plRec.name:fld.name));
													});
												}
											} else {
												fld = {appCase : "grid", appObject : C.dataComp.dataSource.ID, name : "", user : App.get.user.id, useDefault : false, settingObject : MJsonGridF }
												settingDS.addData(fld, function(resp, data, req) {
													settingDS.updateCaches({operationType: "add", data: isA.Array(data) ? data : [ data ]});
													C.usdf.getField ("name").fetchData();
													isc.say(isc.i18nMessages["smartsfs.userSetting.saved"].messageArgs(plRec?plRec.name:fld.name));
												});
											}
										})
									});
								} else {
									fld = {id: plRec.id, useDefault : false, settingObject : MJsonGridF }
									settingDS.updateData(fld, function(resp, data, req) {
										settingDS.updateCaches({operationType: "update", data: isA.Array(data) ? data : [ data ]});
										isc.say(isc.i18nMessages["smartsfs.userSetting.saved"].messageArgs(plRec?plRec.name:fld.name));
									});
								}
							} else {
								//var val = this.getField ("name").getValue();
								if (!val) val = "";
								fld = {appCase : "grid", appObject : C.dataComp.dataSource.ID, name : val, user : App.get.user.id, useDefault : false, settingObject : MJsonGridF }
								settingDS.addData(fld, function(resp, data, req) {
									settingDS.updateCaches({operationType: "add", data: isA.Array(data) ? data : [ data ]});
									C.usdf.getField ("name").fetchData();
									isc.say(isc.i18nMessages["smartsfs.userSetting.saved"].messageArgs(plRec?plRec.name:fld.name));
//									settingDS.fetchData(C.usFilter, function(){
//											C.usdf.getField ("name").setValue(data[0].id);
//										});
								});	
							}
    		           }); 
					}								
				},
				usremove : function() {
					var val = this.getField ("name").getValue();							
					if ((val && val != "0") || App.get.user.hasAnyRole("ROLE_SUPER")) {
						var plRec = this.getField ("name").getSelectedRecord();
						if (!val || plRec) {
							if (!val) {
								App.getDataSource("SmartUserSettings", function(ds) {
									ds.fetchData(C.sysFilter(), function(d) {
										if (d.data.length > 0) {
											for (var i=0;i<d.data.length;i++) {
												plRec = d.data[i];
												fld = fld = {id: plRec.id};
												ds.removeData(fld, function(resp, data, req) {
													ds.updateCaches({operationType: "remove", data: isA.Array(data) ? data : [ data ]});
													ds.fetchData (C.usFilter, function(){
														C.usdf.getField ("name").setValue(0);	
														C.usdf.setDefault(true);
													});	
												});
											}
										}
									})
								});
							} else {
								var fld = {id: plRec.id};
								App.getDataSource("SmartUserSettings", function(settingDS) {
									settingDS.removeData(fld, function(resp, data, req) {
										settingDS.updateCaches({operationType: "remove", data: isA.Array(data) ? data : [ data ]});
										settingDS.fetchData (C.usFilter, function(){
											C.usdf.getField ("name").setValue(0);
											C.usdf.setDefault(true);
										});
									});
								});
							}
						}
					}
				},
				setDefault : function(change) {
					//debugger;
//					C.dataComp.grid.clearCriteria();
//            		C.dataComp.advFilter.clearCriteria();
					App.getDataSource("SmartUserSettings", function(settingDS) { 
						settingDS.fetchData(C.sysFilter(), function(data){
							if (data.data.length > 0) {
								for (var i=0;i<data.data.length;i++) {
		 			            	C.dataComp.grid.clearCriteria();
		 			            	C.dataComp.advFilter.clearCriteria();
			 			            	if (data.data[i].id) {
											var props = []
											props = isc.JSON.decode(data.data[i].settingObject);
											for (var j = 0; j < props.length; j++) {
												for (var propname in props[j]) {
													C.dataComp.grid.setProperty(propname, props[j][propname]);													
												}
											}
											C.dataComp.grid.initialCriteria=DataSource.combineCriteria(C.dataComp._requiredProfile,C.dataComp.remReqProfileFromCrit(C.dataComp.grid.initialCriteria));
											C.usCriteria = C.dataComp.grid.initialCriteria;
			 			            	}
		 			            	}
		 			            	C.usdf.reload();
		 			            	C.dataComp.grid.markForRedraw("sysUSS");
							} else {
								if(change===true){
									if(C.dataComp.canFilter!=false) C.dataComp.grid.setShowFilterEditor(false);
									C.dataComp.grid.setDataSource(C.dataComp.dataSource);
									if(C.dataComp.canFilter!=false) C.dataComp.grid.setShowFilterEditor(true);
									C.usCriteria = null;
									C.dataComp.clearFilter();
		 			            	C.dataComp.grid.markForRedraw("defaultUSS");
								}
//			            		App.getDataSource(C.dataComp.dataSource, function(ds) {
//				            			var prop = ds.fields ? Array.prototype.slice.apply( ds.fields ) : ds.fields;
//					            			C.dataComp.grid.setProperty("fields", prop);
//					            			C.dataComp.grid.setProperty("groupByField", ds.groupByField);
//					            			C.dataComp.grid.setProperty("currentGroupState", ds.currentGroupState);
//					            			C.dataComp.grid.setProperty("sortFieldNum", ds.sortFieldNum);						
//					            			C.dataComp.grid.setProperty("sortField", ds.sortField);
//					            			C.dataComp.grid.setProperty("sortDirection", ds.sortDirection);
//					            			C.dataComp.grid.setProperty("showGridSummary", ds.showGridSummary);
//					            			C.dataComp.grid.setProperty("showGroupSummary", ds.showGroupSummary);
//					            			prop = ds.initialCriteria ? Array.prototype.slice.apply( ds.initialCriteria ) : ds.initialCriteria;
//					            			C.dataComp.grid.setProperty("initialCriteria", prop);	
//					            			C.dataComp.grid.setProperty("visibleAdvFilter", false);
//					         			    if((C.dataComp.initialSort) && (C.dataComp.grid.initialSort.length>0)) {
//					         			    	C.dataComp.grid.setSort(C.dataComp.grid.initialSort);
//					         			    } else {
//					         			    	C.dataComp.grid.setSortState(null);
//					         			    }
//				            		});
									
//				            		C.dataComp.advFilter.hide();
//				            		C.dataComp.toolBar._btnAdvFilter.hide();
//				            		C.dataComp.toolBar._btnFilter.show();
//				            		C.dataComp.grid.setShowFilterEditor(true);								
							}
						});
					});           		
//	            	C.dataComp.grid.markForRedraw("defaultUSS");
				},
				reload : function() {
		            	C.dataComp.grid.setGroupByFieldSummaries(C.dataComp.grid.groupByField); 
			            	C.dataComp.grid.setGroupState(C.dataComp.grid.currentGroupState); 
						if (C.dataComp.grid.sortField) {
							C.dataComp.grid.setSort({property:C.dataComp.grid.sortField, direction:C.dataComp.grid.sortDirection});
						} else {
							C.dataComp.grid.setSortState(null);
						};
						if (C.dataComp.grid.visibleAdvFilter) {
							C.dataComp.advFilter.show();
							C.dataComp.toolBar._btnAdvFilter.show();
							C.dataComp.toolBar._btnFilter.hide();
							C.dataComp.grid.setShowFilterEditor(false);
							C.dataComp.advFilter.setCriteria(C.dataComp.grid.initialCriteria ? C.dataComp.grid.initialCriteria : null);	
							C.dataComp.doFilter("advanced");
						} else {
							C.dataComp.advFilter.hide();
							C.dataComp.toolBar._btnAdvFilter.hide();
							C.dataComp.toolBar._btnFilter.show();
							C.dataComp.grid.setShowFilterEditor(true);
							C.dataComp.grid.setCriteria(C.dataComp.grid.initialCriteria ? C.dataComp.grid.initialCriteria : null);	
						}
						C.dataComp.reload();
				},
	 			fields : [{name: "name", title: isc.i18nMessages["smartsfs.userSetting.buttons.label"], // autoFetchData: true,
	 			        	prompt : isc.i18nMessages["smartsfs.userSetting.buttons.prompt"], 
	 			        	editorType: "comboBox", valueField:"id",  displayField: "name",  width : 182, 
	 			        	optionDataSource: "SmartUserSettings", pickListCriteria: this.usFilter(), 
	 			        	addUnknownValues: true, 
	 			        	allowEmptyValue: true, 
	 			        	specialValues : {0:""},
	 			        	pickListProperties : {showHeader : false, showCellContextMenus : true},
	 			            pickListFields: [{ name:"id", hidden:true},
	 			                            { name:"name" },
	 			                            { name:"settingObject", hidden:true }],
	 			            changed: function(form, item, value) {
	 			            	if (item.getSelectedRecord()) {
		 			            	C.dataComp.grid.clearCriteria();
		 			            	C.dataComp.advFilter.clearCriteria();
		 			            	if (value != "0") {
			 			            	if (item.getSelectedRecord().id) {
											var props = []
											props = isc.JSON.decode(item.getSelectedRecord().settingObject);
											for (var j = 0; j < props.length; j++) {
												for (var propname in props[j]) {
													C.dataComp.grid.setProperty(propname, props[j][propname]);
												}
											}
											C.dataComp.grid.initialCriteria=DataSource.combineCriteria(C.dataComp._requiredProfile,C.dataComp.remReqProfileFromCrit(C.dataComp.grid.initialCriteria))
											C.usCriteria = C.dataComp.grid.initialCriteria;
			 			            	}
		 			            	} else {
		 			            		C.usdf.setDefault(true);
		 			            	}	
		 			            	form.reload();
			              		}
	 			            },
	 			           icons: [{
		 			            src: '[SKIN]/custom/save.png',
		 			            name : "usave",
		 			            prompt: isc.i18nMessages["smartsfs.buttons.save.prompt"],
		 			            click: function() { C.usdf.usssave(); }
	 			         	},
		 						{ src: '[SKIN]/actions/remove.png',
		 			        	name : "uremove",
		 			        	prompt: isc.i18nMessages["smartsfs.buttons.remove.prompt"].messageArgs(""),
		 			            click: function() { C.usdf.usremove(); }
	 						}] 
	 			         }
	 			],
	 			initWidget : function() {
	 				this.Super("initWidget", arguments);
	 				//this.observe(App.get.splitPane.detailToolStrip,"resized","observer._handleSize()");
					//this.delayCall("_handleSize");				
	 			}
	 		});	
		this.addMember(this.usdf);	
	}
});

