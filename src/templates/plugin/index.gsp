<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><g:message code="default.application.title" /></title>
<asset:link rel="shortcut icon" href="app.ico" type="image/x-icon" />
<script type="text/javascript">
debugger;
var serverTime = ${Calendar.getInstance(TimeZone.getTimeZone("UTC")).getTimeInMillis()}
var localTime =  Date.now();
var localTimeOffset = serverTime - localTime;

var isomorphicDir =  "${createLink(uri: '/plugins/smart-sfs-2.0.0-SNAPSHOT/js/isomorphic/')}";
var contextRoot = "${createLink(uri: '')}";
//window.isc_useDefaultViewport = false;
</script>
<asset:javascript src="smart-sfs.js" asset-defer="true"/>
</head>
<body>
<asset:script type="text/javascript">
	App.create().loadUser();
</asset:script>
		<h2><g:message code="smartsfs.needjs.info"/></h2>
<%--		<script type="text/javascript">--%>
<%--			App.create().loadUser();--%>
<%--		</script>--%>
		<asset:deferredScripts/>
		<form id="_uploadForm"></form>
<%--	IE potrebuje fyzicky Form aby urobil submit	--%>
</body>
</html>
