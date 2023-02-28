isc.ClassFactory.defineClass("SmartTabSet", "TabSet").addProperties({
    ownerTabSet : null,// nadradeny tabset
    _dynamicGridBar : false,
    _editTabIcon : "[SKIN]/actions/exclamation.png",
    _closeAll : function() {
        var T = this;
        var hasClose = 0;
        for (var i = 0; i < T.tabs.length; i++) {
            if (T.getTab(i).canClose == true) {
                hasClose++;
            }
        }
        for (var i = 0; i < T.tabs.length; i++) {
            if (T.getTab(i).canClose == true) {
                T.selectTab(i);
                T.getTab(i).pane.cancel(function(closed) {
                    if (closed) {
                        // ak zavrel znovu zavri ostatne
                        hasClose--;
                        T._closeAll();
                    }
                }, T.getTab(i));
            }
        }
    },
    _closeOthers : function(currTab) {
        var T = this;
        var hasClose = 0;
        for (var i = 0; i < T.tabs.length; i++) {
            if (T.getTab(i).canClose == true && currTab.pane.ID != T.getTab(i).pane.ID) {
                hasClose++;
            }
        }
        for (var i = 0; i < T.tabs.length; i++) {
            if (T.getTab(i).canClose == true && currTab.pane.ID != T.getTab(i).pane.ID) {
                T.selectTab(i);
                T.getTab(i).pane.cancel(function(closed) {
                    if (closed)
                        hasClose--;
                    if (hasClose == 0) {
                        // secky zavrene
                        T.selectTab(currTab);
                    } else if (closed) {
                        // ak zavrel znovu zavri ostatne
                        T._closeOthers(currTab);
                    }
                }, T.getTab(i));
            }
        }
    },
    _closeRight : function(currTab) {
        var T = this;
        var doitFrom = null;
        var hasClose = 0;
        for (var i = 0; i < T.tabs.length; i++) {
            if (doitFrom != null)
                hasClose++;
            if (currTab.pane.ID == T.getTab(i).pane.ID) {
                doitFrom = i + 1;
            }
        }

        for (var i = doitFrom; i < T.tabs.length; i++) {
            if (T.getTab(i).canClose == true) {
                T.selectTab(i);
                T.getTab(i).pane.cancel(function(closed) {
                    if (closed)
                        hasClose--;
                    if (hasClose == 0) {
                        // secky zavrene
                        T.selectTab(currTab);
                    } else if (closed) {
                        // ak zavrel znovu zavri ostatne
                        T._closeRight(currTab);
                    }
                }, T.getTab(i));
            }
        }
    },
    tabSelected : function(tabNum, tabPane, ID, tab, name) {
        // debugger;
        if (tabPane.focusInside)
            tabPane.delayCall("focusInside");
    },
    focusInside : function() {
        var tabPane = this.getTabPane(this.getSelectedTab());
        if (tabPane && tabPane.focusInside) {
            tabPane.delayCall("focusInside");
        }
    },
    tabBarProperties : {
        closeTabKeys : [ {
            keyName : "Escape"
        }, {
            ctrlKey : true,
            keyName : "Q"
        } ]
    },
    keyDown : function() {
        var T = this;
        var key = isc.EventHandler.getKey();
        var retbul;
        if ((key == "Arrow_Right") && (isc.EventHandler.altKeyDown()) && !isc.EventHandler.shiftKeyDown()) {
            var curTab = T.getTabNumber(T.getSelectedTab());
            if (curTab < T.tabs.length - 1) {
                T.selectTab(curTab + 1);
            }
            retbul = false;
        }
        if ((key == "Arrow_Left") && (isc.EventHandler.altKeyDown()) && !isc.EventHandler.shiftKeyDown()) {
            var curTab = T.getTabNumber(T.getSelectedTab());
            if (curTab > 0) {
                T.selectTab(curTab - 1);
            }
            retbul = false;
        }
        return retbul;
    },
    /**
     * hide TabBar, ake je TabSet drawn POZOR! show/hide hodi exception ak tam vojde shrinkElementOnHide = true
     */
    _hideTabBar : function() {
        if (this.isDrawn()) {
            this.showTabBar = false;
            this.shrinkElementOnHide = true;
            if (this.isVisible()) {
                this.tabBar.hide();
                this.redraw();
            }
        }
    },
    /**
     * show TabBar + redraw ak je drawn a visible
     */
    _showTabBar : function() {
        if (this.isA("GridComponentAny")&&this._gridTabSet===false)return;
        if (this.showTabBar == false) {
            this.showTabBar = true;
            this.shrinkElementOnHide = false;
            if (this.isVisible() && this.isDrawn()) {
                this.tabBar.show();
                this.redraw();
            }
        }
    },
    _delayAutoHideTabBar : function() {
        this.delayCall("_autoHideTabBar");
    },
    /**
     * autoHide tabBar pre DetailComponent a GridComponent
     */
    _autoHideTabBar : function() {
        if (this.isA("GridComponentAny")) {
            // ak je posledny tab okrem gridoveho setni hide tabbar
            if ((this._dynamicGridBar && this.tabs.getLength() == 1)||this._gridTabSet===false)
                this._hideTabBar();
        }
        if (this.isA("DetailComponentTemplate")) {
            // ak je posledny tab okrem gridoveho setni hide tabbar
            if (this._layoutDrawn == true & !this._hasAsocFields || this._asocLayout == "SECTION")
                this._hideTabBar();
        }
    },
    /**
     * set tabEdit modu + rekurz nahor
     */
    setTabEdit : function(tab) {
        var T = this.getTabObject(tab || this.getSelectedTab()) || {};
        if (this.showTabBar == true || (T._titleEdit)) {
            this.setTabTitle(T, T._titleEdit);
            this.setTabIcon(T, this._editTabIcon);
            if(this._mySection!=undefined){
                this._mySection.setTitle(this._mySection._titleEdit);
            }
            if(this.isA("DetailComponentTemplate")&&this._gridTabSet===false){
               try{
                  this._fromGridCom._mySection.setTitle(this._mySection._titleEdit);
               } catch (e) {
                  isc.logWarn("detail comp bez ownera");
               }
            }
        }
        if (this.tabSet && this.tabSet.isA("SmartTabSet")) {
            this.tabSet.setTabEdit(this._myTabName || this.tabSet.getSelectedTab());
        }
    },
    /**
     * reset tabEdit modu + rekurz nahor
     */
    resetTabEdit : function(tab, closing) {
        var T = this.getTabObject(tab || this.getSelectedTab()) || {};
        if (this.showTabBar == true || (T._titleNormal)) {
            this.setTabTitle(T, T._titleNormal);
            this.setTabIcon(T, (T.canClose === true ? "[SKIN]/TabSet/close.png" : null));
            if(this._mySection!=undefined){
                this._mySection.setTitle(this._mySection._titleNormal);
            }
        }
        var _close = closing || false;
        if(!this._hasAnyTabEdit() || _close === true){
            if (this.tabSet && this.tabSet.isA("SmartTabSet")) {
                this.tabSet.resetTabEdit(this._myTabName || this.tabSet.getSelectedTab());
            }
        }
    },
    /**
     * najdi tab v edit mode
     */
    _hasAnyTabEdit : function() {
        var et = this.tabs.findAll("icon", this._editTabIcon);
        var etEx = et ? et.getLength() : 0;
        if (etEx == 0 & this.isA("DetailComponentTemplate") & this._asocLayout == "SECTION") {
            //kukni sekcie, ci neni niekde editTab
            if (this._asocGrids.some(function(grid) {
                return grid._hasAnyTabEdit()
            })) {
                etEx = 1
            };
        }
        return etEx > 0;
    },
    isTabInEditMode : function(tab){
       return tab.icon==this._editTabIcon;
    },
    closeClick : function(tab) {
        tab.pane.cancel(null, tab);
    },
    /**
     * override TabSet.hide s volanim showTabBar aby nehodil hide exception
     */
    hide : function() {
        this._showTabBar();
        return this.Super("hide", arguments);
    },
    /**
     * override TabSet.removeTab - kontrola dynamickeho tabsetu s hide tabBar
     */
    removeTab : function() {
        this._delayAutoHideTabBar();
        return this.Super("removeTab", arguments);
    },
    initWidget : function() {
        this.Super("initWidget", arguments);
        var T = this;
        T.observe(T, "show", "observer._autoHideTabBar()");
        T.origAddTab = T.addTab;
        T.addTab = function(tab, position) {
            tab.contextMenu = isc.Menu.create({
                autoDraw : false,
                showShadow : true,
                shadowDepth : 10,
                data : [ {
                    title : isc.i18nMessages["smartsfs.tabset.closeAll"],
                    click : function() {
                        T._closeAll();
                    }
                }, {
                    title : isc.i18nMessages["smartsfs.tabset.closeOthers"],
                    click : function() {
                        T._closeOthers(tab);
                    }
                }, {
                    title : isc.i18nMessages["smartsfs.tabset.closeRight"],
                    click : function() {
                        T._closeRight(tab);
                    }
                } ]
            });
            if(T.isTabInEditMode(tab)){
               tab._titleNormal = (new DOMParser).parseFromString(tab.title, "text/html").documentElement.textContent;
            }else{
               tab._titleNormal = tab.title;
            }
            tab._titleEdit = "<div style=\"color:" + (App.get.config["smartsfs.tabcolor.edit"] || "red") + ";\">" + tab._titleNormal + "</div>";
            T.origAddTab(tab, position);
        }
        T._dynamicGridBar = App.get.config["smartsfs.tabset.dynamicGridTabs"].toString().toBoolean();
        T._gridTabSet = App.get.config["smartsfs.tabset.gridTabSet"].toString().toBoolean();
        T._editTabIcon = App.get.config["smartsfs.tabset.editTabIcon"] || "[SKIN]/actions/exclamation.png";
    }
});