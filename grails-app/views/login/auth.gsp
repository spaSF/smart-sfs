<html>
<head>
</head>
<body>
<SCRIPT>//'"]]>>isc_loginRequired
//
// Embed this whole script block VERBATIM into your login page to enable
// SmartClient RPC relogin.
//=======    



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
if (isc && isc.RPCManager) isc.RPCManager.delayCall("handleLoginRequired", [window]);
</SCRIPT>
</body>
</html>
