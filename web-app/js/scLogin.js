isc.ClassFactory.defineClass('SmartOTPLoginDialog', 'LoginDialog').addProperties({
   autoDraw : true,
   // autoSize : true,
   firstLogin : false,
   relogin : false,
   usernameItemProperties : {
      visible : false
   },
   items : [ "autoChild:headerHelp", "autoChild:headerImage", "autoChild:timerBar", "autoChild:loginForm" ],
   headerImageDefaults : {
      _constructor : isc.Img,
      width : "100%",
      imageType : "normal",
      imageWidth : 0, // 230,
      imageHeight : 0, // 100,
      visibility : "hidden"
   // src : contextRoot + "/tmp/loginQR.png"
   },
   headerHelpDefaults : {
      _constructor : isc.HTMLFlow,
      padding : 5,
      width : "100%",
      visibility : "hidden"
   },
   timerBarDefaults : {
      _constructor : isc.Progressbar,
      showTitle : false,
      breadth : 10,
      percentDone : 100
   },
   loginFailureItemProperties : {
      wrap : true
   },
   refreshTitle : function() {
      var L = this;
      L.setTitle(isc.i18nMessages["smartsfs.security.otp.title"] + " " + isc.DateUtil.format(this.getServerDateTime(), "dd.MM.yyyy HH:mm:ss"));
      var sec = (this.getServerDateTime().valueOf()) / 1000;
      var aktualStep = Math.floor(sec / L.timeTrip);
      var percOfRound = Math.floor(((sec / L.timeTrip) - Math.floor(sec / L.timeTrip)) * 100);
      var aktualPerc = 100 - percOfRound;
      L.timerBar.setPercentDone(aktualPerc);
      L.delayCall("refreshTitle");
   },
   getServerDateTime : function() {
      var aktual = Date.create();
      if (localTimeOffset) {
         aktual = new Date((Date.create().valueOf() + localTimeOffset));
      }
      return aktual;
   },
   initWidget : function() {
      this.title = isc.i18nMessages["smartsfs.security.otp.title"] + " " + isc.DateUtil.format(this.getServerDateTime(), "dd.MM.yyyy HH:mm:ss");
      this.errorMessage = isc.i18nMessages["smartsfs.security.otp.failure"];
      this.passwordItemTitle = isc.i18nMessages["smartsfs.security.otp.password.title"];
      this.loginButtonTitle = isc.i18nMessages["smartsfs.security.otp.button.title"];
      this.timeTrip = NumberUtil.parseInt(App.get.config["smartsfs.security.otp.roundbysec"]);
      this.passwordItemProperties = {
         wrapTitle : false,
         clipTitle : false,
         type : "text"
      };
      this.headerIconProperties = {
         src : "[SKIN]/custom/QRkey.png"
      };
      if (this.firstLogin == true) {
         var qrImgSrc = contextRoot + "/tmp/loginQR" + App.get.user.username + "_" + App.get.user.qr + ".png";
         if (isc.i18nMessages["smartsfs.security.otp.qrcode.help"]) {
            this.headerHelpProperties = {
               contents : isc.i18nMessages["smartsfs.security.otp.qrcode.help"],
               visibility : "visible"
            };
         }
         if (isc.Browser.isDesktop) {
            this.headerImageProperties = {
               imageWidth : 250,
               imageHeight : 250,
               src : qrImgSrc,
               visibility : "visible"
            }
         } else {
            this.headerImageProperties = {
               imageWidth : 150,
               imageHeight : 150,
               src : qrImgSrc,
               visibility : "visible"
            }
         }
      }
      this.Super("initWidget", arguments);
      this.delayCall("refreshTitle");
   },
   loginFunc : function(creds, dialogCallback) {
      var OTP = this;
      if (creds == null)
         return; // dismissed
      creds.j_username = creds.username;
      creds.j_password = creds.password;

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
                  App.get.user = SmartUser.create(ret.response.data);
                  dialogCallback(true);
                  if (!(OTP.relogin == true))
                     App.get.createAppLayout();
                  else if (isc.isA.Function(OTP.reloginCbk))
                     OTP.reloginCbk();
               });
            } else {
               App.get.user = undefined;
               dialogCallback(true);
               isc.warn(OTP.loginDialog.errorMessage, function() {
                  App.get.loginUser();
               });
            }
         }
      }, true);

   }
});

isc.showOTPDialog = function(fLogin, relogin, reloginCallback) {
   var otpD = SmartOTPLoginDialog.create({
      firstLogin : fLogin
   });
   otpD.loginForm.relogin = relogin;
   otpD.loginForm.reloginCbk = reloginCallback;
   otpD.timerBar.setLength(otpD.getVisibleWidth() - otpD.layoutRightMargin - otpD.layoutLeftMargin);
   otpD.timerBar.setBreadth(10);
   otpD.headerHelp.setWidth(otpD.timerBar.getLength());
   otpD.loginForm.getItem('passwordItem').focusInItem();
   return otpD;
}

isc.showUserQRCode = function(username, qr, onClose) {
   var qrImgSrc = contextRoot + "/tmp/loginQR" + username + "_" + qr + ".png";
   var size = 0;
   if (isc.Browser.isDesktop) {
      size = 250;
   } else {
      size = 150;
   }
   var qrImgProps = {
      width : "100%",
      height : "100%",
      imageWidth : size,
      imageHeight : size,
      src : qrImgSrc,
      visibility : "visible",
      snapToGrid : true,
      snapResizeToGrid : true
   }

   var qrWin = isc.Window.create({
      headerIconProperties : {
         src : "[SKIN]/custom/QRkey.png"
      },
      title : isc.i18nMessages["smartsfs.security.otp.showQR.title"],
      items : isc.Img.create(qrImgProps),
      showCloseButton : true,
      canDragResize : true,
      isModal : true,
      showModalMask : true,
      dismissOnEscape : true,
      dismissOnOutsideClick : true,
      autoCenter : true,
      closeCbk : function() {
         if (isc.isA.Function(onClose))
            onClose();
      }
   });
   qrWin.observe(qrWin, "close", "observer.closeCbk()")
   qrWin.resizeTo(size, size);
   qrWin.redraw();
   qrWin.show();

}