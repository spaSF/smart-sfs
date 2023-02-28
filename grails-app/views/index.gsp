<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
<title><g:message code="default.application.title" /></title>
<link rel="shortcut icon" href="${createLinkTo(dir:'images',file:'app.ico')}" type="image/x-icon" />
<script type="text/javascript">
var serverTime = ${Calendar.getInstance(TimeZone.getTimeZone("UTC")).getTimeInMillis()}
var localTime =  Date.now();
var localTimeOffset = serverTime - localTime;

var isomorphicDir =  "${createLink(uri: '/isomorphic/')}";
var contextRoot = "${createLink(uri: '')}";
//window.isc_useDefaultViewport = false;
</script>
<r:require module="smartsfs" />
<r:require module="scapplication" />
<r:layoutResources />
</head>
<body>
	  <r:external uri="/isomorphic/skins/${grailsApplication.config.smartsfs.skin}/load_skin.js"/>
      <r:layoutResources />
      <h2><g:message code="smartsfs.needjs.info"/></h2>
      <script type="text/javascript">
         App.create().loadUser();
      </script>
      <form id="_uploadForm" style="display: none;"></form>
<%--  IE potrebuje fyzicky Form aby urobil submit  --%>
</body>
</html>