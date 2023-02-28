prompt ==================================================;
prompt ORA SQL upgrade z 2.0.0 na 2.5.0;
prompt pouzit v pripade, ze app sa nespusta v update mode;
prompt ==================================================;
prompt 
prompt **contextRoot do SC_DATASOURCE**;
alter table sc_datasource add(context_root varchar2(255));

prompt **position do MenuItem**;
alter table sc_menuitem add(position number(10));