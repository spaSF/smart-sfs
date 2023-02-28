set serveroutput on;
set linesize 1000;
set pagesize 10000;
set trimspool on;
SET feedback off;

begin
   for r in(select trim(global_name) gn from global_name) loop
      dbms_output.put_line('global name   : '||r.gn);
   end loop;
   for r in(select a.instance_name i, b.sid from v$instance a, v$mystat b where rownum=1) loop
      dbms_output.put_line('instance name : '||r.i);
      dbms_output.put_line('SID           : '||r.sid);
   end loop;
   dbms_output.put_line('NLS SETTINGS: ');
   for nls in (select * from
         (select 'SESSION' SCOPE,nsp.* from nls_session_parameters nsp
         union
         select 'DATABASE' SCOPE,ndp.* from nls_database_parameters ndp
         union
         select 'INSTANCE' SCOPE,nip.* from nls_instance_parameters nip
         ) a 
         pivot  (LISTAGG(VALUE) WITHIN GROUP (ORDER BY SCOPE)
         FOR SCOPE
         in ('SESSION' as "SESSION",'DATABASE' as DATABASE,'INSTANCE' as INSTANCE))
         where parameter in('NLS_CHARACTERSET','NLS_LANGUAGE','NLS_TERRITORY','NLS_DATE_FORMAT','NLS_NUMERIC_CHARACTERS'))loop
      dbms_output.put_line('parameter:'||rpad(nls.parameter,20,' ')||'      '||'session:'||rpad(nvl(nls.session,' '),15,' ')||'instance:'
      ||rpad(nvl(nls.instance,' '),15,' ')||'database:'||rpad(nvl(nls.database,' '),15,' '));
   end loop;	
end;
/

alter session set NLS_LANGUAGE='SLOVAK'
/
alter session set NLS_TERRITORY='SLOVAKIA'
/
alter session set NLS_DATE_FORMAT='dd.mm.yyyy hh24:mi:ss';
/
alter session set NLS_NUMERIC_CHARACTERS='. ';
/

begin
	dbms_output.enable(null);
end;
/
spool setmerge_err.log;
@mrg_sc_datasource.sql;
@mrg_sc_dsfield.sql;
@mrg_sc_operation.sql;
@mrg_sc_oper_param.sql;
@mrg_sc_config.sql;
@mrg_sc_menuitem.sql;
@mrg_sc_request_map.sql;
spool off;
disconnect;
exit;
