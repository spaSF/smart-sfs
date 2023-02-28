isc.ClassFactory.defineClass("SmartUser").addClassProperties(
      {
         changePasswordDialog : function(params) {
            var flds = [];
            if (params["username"]) {
               flds.add({
                  name : "username",
                  title : isc.i18nMessages["springSecurity.login.username.label"],
                  value : params.username,
                  canEdit : false,
                  disabled : true,
                  canFocus : false
               });
            } else {
               flds.add({
                  name : "password",
                  title : isc.i18nMessages["springSecurity.login.password.label"],
                  type : "password",
                  required : true,
                  canFocus : true
               });
            }
            flds.add({
               name : "password_new",
               title : isc.i18nMessages["springSecurity.expired.newpsw"],
               type : "password",
               required : true,
               canFocus : true
            });
            flds.add({
               name : "password_new_2",
               title : isc.i18nMessages["springSecurity.expired.newpsw2"],
               type : "password",
               required : true,
               canFocus : true,
               validators : [ {
                  type : "matchesField",
                  otherField : "password_new",
                  errorMessage : isc.i18nMessages["springSecurity.expired.errors.notMatch"]
               } ]
            });
            flds.add({
               name : "spacer",
               editorType : "RowSpacerItem"
            });
            var relogin=true;
            if(params["expired"]){
               //aby nastavil username ale urobil applayout
               relogin="false";
               flds.add({
                  name:"expired",
                  type:"boolean",
                  value:true,
                  defaultValue:true,
                  visible:false
               });
               flds.add({
                  name:"expiredUser",
                  type:"text",
                  value:params["expiredUser"],
                  visible:false
               });
               App.get.user=SmartUser.create({username:params["expiredUser"]});
            }
            var wind = {};
            flds.add({
               name : "executeBtn",
               type : "button",
               canFocus : true,
               colSpan : 2,
               canEdit : null,
               title : isc.i18nMessages["springSecurity.expired.header"],
               autoFit : true,
               showButtonTitle : true,
               icon : "[SKIN]/custom/change_password.png",
               click : function() {
                  if (this.form.validate()) {
                     var bt = this;
                     App.dataRequest(App.userChangePwdUrl, this.form.getValues(), function(response, data) {
                        var resp = data.response;
                        switch (resp.status) {
                           case -1:
                              isc.warn(resp.data);
                              break;
                           case -4:
                              if (resp["errors"]) {
                                 bt.form.setErrors(resp.errors, true);// set
                                                                        // and
                                 // show
                              } else {
                                 isc.warn(resp.data);
                              }
                              break;
                           default:
                              if (resp.status < 0) {
                                 isc.warn(response.httpResponseText || resp.data)
                              } else {
                                 // success-relogin ak bol aktualny
                                 if (!params["username"] || params["username"] == App.get.user.username) {
                                    App.get.loginUser(relogin);
                                 } else
                                    isc.say(isc.i18nMessages["smartsfs.operation.success.default.message"]
                                          .messageArgs(isc.i18nMessages["springSecurity.expired.header"]));
                              }
                              wind.close();
                              wind.markForDestroy();
                              break;
                        }
                     }, true);
                  }
               }
            });
            var form = isc.DynamicForm.create({
               autoFocus : true,
               wrapItemTitles : false,
               padding : 10,
               fields : flds
            });
            wind = isc.Window.create({
               isModal : true,
               headerIconDefaults : {
                  width : 16,
                  height : 14,
                  src : "[SKIN]/custom/change_password_mini.png"
               },
               showModalMask : true,
               autoCenter : true,
               autoSize : true,
               canDragResize : true,
               showFooter : true,
               showMinimizeButton : false,
               canDragReposition : true,
               canDragResize : true,
               showCloseButton : params["canClose"] != undefined ? params["canClose"] : true,
               title : isc.i18nMessages["springSecurity.expired.header"],
               items : [ form ],
               autoDraw : true
            });

         }
      }).addProperties({
   id : null,
   username : "",
   enabled : false,
   accountExpired : true,
   accountLocked : true,
   passwordExpired : true,
   name : "",
   surname : "",
   titlename : "",
   email : "",
   lang : "",
   country : "",
   authorities : [],
   hasAnyRole : function(roles) {
      if (this.authorities.length > 0) {
         var splitRoles = roles.split(",");
         for (var r = 0; r < splitRoles.length; r++) {
            if (this.authorities.indexOf(splitRoles[r]) > -1)
               return true
         }
         return false;
      } else {
         return false;
      }
   },
   init : function(args) {
      this.Super("init", arguments);
      if (this.lang != null && !isc.isA.String(this.lang) && this.lang.hasOwnProperty("id")) {
         this.lang = this.lang.id;
      }
      if (isc.isA.Array(this.authorities)) {
         this.authorities = this.authorities.map(function(obj) {
            return obj.hasOwnProperty("authority") ? obj.authority : obj;
         });
      }
      delete this["password"];
      delete this["class"];
      delete this["version"];
      if (this.name == null && this.surname == null) {
         this.titlename = this.username;
      } else {
         this.titlename = (this.name != null ? (this.name + " ") : "") + this.surname;
      }
   }
});