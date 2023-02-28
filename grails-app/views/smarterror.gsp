<!DOCTYPE html>
<html>
	<head>
	</head>
	<body>
<SCRIPT>//'"]]>>

   debugger;
   if (!window.isc && document.domain && document.domain.indexOf(".") != -1 
   	   && !(new RegExp("^(\\d{1,3}\\.){3}\\d{1,3}$").test(document.domain))) 
   	{
   	    
   	    var set = false;
   	    while (document.domain.indexOf(".") != -1) {
   	        try {
   	            if (window.opener && window.opener.isc) break;
   	            if (window.top.isc) break;
   	            
   	            if (!set) { document.domain = document.domain; set = true; }
   	            else { document.domain = document.domain.replace(/.*?\./, ''); }
   	        } catch (e) {
   	            try {
   	                if (!set) { document.domain = document.domain; set = true }
   	                else { document.domain = document.domain.replace(/.*?\./, ''); }
   	            } catch (ee) {
   	                break;
   	            }
   	        }
   	    } 
   	}

  	var isc = top.isc ? top.isc : window.opener ? window.opener.isc : null;
   
   if(isc) {
   	String.prototype.messageArgs = function() {
   	   var args = arguments;

   	   return this.replace(/\{(\d+)\}/g, function() {
   	      return args[arguments[1]];
   	   });
   	};
      isc.warn(isc.i18nMessages["default.request.exception.message"].messageArgs("${exception}"));
   }else{
      alert("Server exception occured! ${exception}");
   }
  

</SCRIPT>
	</body>
</html>
