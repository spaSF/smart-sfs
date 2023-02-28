Create Table SC_USER_SETTING(
   ID             Number(19) Not Null Enable
  ,VERSION        Number(19)
  ,APP_CASE       Varchar2(255) Not Null Enable
  ,APP_OBJECT     Varchar2(255) Not Null Enable
  ,SETTING_OBJECT Clob
  ,USE_DEFAULT    Number(1)
  ,USER_ID        Number(19) Not Null Enable
  ,NAME           Varchar2(255 Char))
Nocache
Logging;
Alter Table sc_user_setting
   Add Constraint SC_USER_SETTING_PK Primary Key(id) Validate;
Alter Table sc_user_setting
   Add Constraint SC_USER_SETTING_USER_Fk Foreign Key(user_id) References sc_user(id) Validate;
Create Unique Index SC_USER_SETTING_UK
   On SC_USER_SETTING(SETTING_OBJECT)
   Logging;
Create Sequence SC_SETTING_SEQ Start With 1
                               Increment By 1
                               Maxvalue 9999999999999999999999999999
                               Nominvalue
                               Noorder
                               Nocycle
                               noCache
                               Nokeep
                               Global;