isc.ClassFactory.defineClass("SmartTabSet","TabSet").addProperties({ownerTabSet:null,_dynamicGridBar:!1,_editTabIcon:"[SKIN]/actions/exclamation.png",_closeAll:function(){for(var a=this,b=0,c=0;c<a.tabs.length;c++)1==a.getTab(c).canClose&&b++;for(c=0;c<a.tabs.length;c++)1==a.getTab(c).canClose&&(a.selectTab(c),a.getTab(c).pane.cancel(function(c){c&&(b--,a._closeAll())},a.getTab(c)))},_closeOthers:function(a){for(var b=this,c=0,d=0;d<b.tabs.length;d++)1==b.getTab(d).canClose&&a.pane.ID!=b.getTab(d).pane.ID&&
c++;for(d=0;d<b.tabs.length;d++)1==b.getTab(d).canClose&&a.pane.ID!=b.getTab(d).pane.ID&&(b.selectTab(d),b.getTab(d).pane.cancel(function(d){d&&c--;0==c?b.selectTab(a):d&&b._closeOthers(a)},b.getTab(d)))},_closeRight:function(a){for(var b=this,c=null,d=0,e=0;e<b.tabs.length;e++)null!=c&&d++,a.pane.ID==b.getTab(e).pane.ID&&(c=e+1);for(e=c;e<b.tabs.length;e++)1==b.getTab(e).canClose&&(b.selectTab(e),b.getTab(e).pane.cancel(function(c){c&&d--;0==d?b.selectTab(a):c&&b._closeRight(a)},b.getTab(e)))},tabSelected:function(a,
b,c,d,e){b.focusInside&&b.delayCall("focusInside")},focusInside:function(){var a=this.getTabPane(this.getSelectedTab());a&&a.focusInside&&a.delayCall("focusInside")},tabBarProperties:{closeTabKeys:[{keyName:"Escape"},{ctrlKey:!0,keyName:"Q"}]},keyDown:function(){var a=isc.EventHandler.getKey(),b;"Arrow_Right"==a&&isc.EventHandler.altKeyDown()&&!isc.EventHandler.shiftKeyDown()&&(b=this.getTabNumber(this.getSelectedTab()),b<this.tabs.length-1&&this.selectTab(b+1),b=!1);"Arrow_Left"==a&&isc.EventHandler.altKeyDown()&&
!isc.EventHandler.shiftKeyDown()&&(b=this.getTabNumber(this.getSelectedTab()),0<b&&this.selectTab(b-1),b=!1);return b},_hideTabBar:function(){this.isDrawn()&&(this.showTabBar=!1,this.shrinkElementOnHide=!0,this.isVisible()&&(this.tabBar.hide(),this.redraw()))},_showTabBar:function(){this.isA("GridComponentAny")&&!1===this._gridTabSet||0!=this.showTabBar||(this.showTabBar=!0,this.shrinkElementOnHide=!1,this.isVisible()&&this.isDrawn()&&(this.tabBar.show(),this.redraw()))},_delayAutoHideTabBar:function(){this.delayCall("_autoHideTabBar")},
_autoHideTabBar:function(){this.isA("GridComponentAny")&&(this._dynamicGridBar&&1==this.tabs.getLength()||!1===this._gridTabSet)&&this._hideTabBar();this.isA("DetailComponentTemplate")&&(1==this._layoutDrawn&!this._hasAsocFields||"SECTION"==this._asocLayout)&&this._hideTabBar()},setTabEdit:function(a){a=this.getTabObject(a||this.getSelectedTab())||{};if(1==this.showTabBar||a._titleEdit)if(this.setTabTitle(a,a._titleEdit),this.setTabIcon(a,this._editTabIcon),void 0!=this._mySection&&this._mySection.setTitle(this._mySection._titleEdit),
this.isA("DetailComponentTemplate")&&!1===this._gridTabSet)try{this._fromGridCom._mySection.setTitle(this._mySection._titleEdit)}catch(b){isc.logWarn("detail comp bez ownera")}this.tabSet&&this.tabSet.isA("SmartTabSet")&&this.tabSet.setTabEdit(this._myTabName||this.tabSet.getSelectedTab())},resetTabEdit:function(a,b){var c=this.getTabObject(a||this.getSelectedTab())||{};if(1==this.showTabBar||c._titleNormal)this.setTabTitle(c,c._titleNormal),this.setTabIcon(c,!0===c.canClose?"[SKIN]/TabSet/close.png":
null),void 0!=this._mySection&&this._mySection.setTitle(this._mySection._titleNormal);c=b||!1;this._hasAnyTabEdit()&&!0!==c||this.tabSet&&this.tabSet.isA("SmartTabSet")&&this.tabSet.resetTabEdit(this._myTabName||this.tabSet.getSelectedTab())},_hasAnyTabEdit:function(){var a=this.tabs.findAll("icon",this._editTabIcon),a=a?a.getLength():0;0==a&this.isA("DetailComponentTemplate")&"SECTION"==this._asocLayout&&this._asocGrids.some(function(a){return a._hasAnyTabEdit()})&&(a=1);return 0<a},isTabInEditMode:function(a){return a.icon==
this._editTabIcon},closeClick:function(a){a.pane.cancel(null,a)},hide:function(){this._showTabBar();return this.Super("hide",arguments)},removeTab:function(){this._delayAutoHideTabBar();return this.Super("removeTab",arguments)},initWidget:function(){this.Super("initWidget",arguments);var a=this;a.observe(a,"show","observer._autoHideTabBar()");a.origAddTab=a.addTab;a.addTab=function(b,c){b.contextMenu=isc.Menu.create({autoDraw:!1,showShadow:!0,shadowDepth:10,data:[{title:isc.i18nMessages["smartsfs.tabset.closeAll"],
click:function(){a._closeAll()}},{title:isc.i18nMessages["smartsfs.tabset.closeOthers"],click:function(){a._closeOthers(b)}},{title:isc.i18nMessages["smartsfs.tabset.closeRight"],click:function(){a._closeRight(b)}}]});a.isTabInEditMode(b)?b._titleNormal=(new DOMParser).parseFromString(b.title,"text/html").documentElement.textContent:b._titleNormal=b.title;b._titleEdit='<div style="color:'+(App.get.config["smartsfs.tabcolor.edit"]||"red")+';">'+b._titleNormal+"</div>";a.origAddTab(b,c)};a._dynamicGridBar=
App.get.config["smartsfs.tabset.dynamicGridTabs"].toString().toBoolean();a._gridTabSet=App.get.config["smartsfs.tabset.gridTabSet"].toString().toBoolean();a._editTabIcon=App.get.config["smartsfs.tabset.editTabIcon"]||"[SKIN]/actions/exclamation.png"}});