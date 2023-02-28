@echo off
sqlplus grux/grux@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=delta-nisvx.internal.softforsolutions.com)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=NISVX))) @getmerge.sql
rem sqlplus xntx/xntx@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=delta-nisvx.internal.softforsolutions.com)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=NISVX))) @setmerge.sql
exit
