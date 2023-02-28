prompt DB independend;
Column maxf New_value mxf;
Select nvl(max(id),0) + 1 maxf From SC_FILE;
create sequence sc_file_seq   start with &mxf increment by 1 maxvalue 9999999999999999999999999999 nominvalue noorder nocycle cache 20;

Column maxp New_value mxp;
Select nvl(max(id),0) + 1 maxp From SC_OPER_PARAM;
create sequence sc_oper_param_seq   start with &mxp increment by 1 maxvalue 9999999999999999999999999999 nominvalue noorder nocycle cache 20;

Alter Table sc_config Rename Column key To prop_key;

prompt OTP upgrade;

create sequence sc_user_otp_seq  start with 1 increment by 1 maxvalue 9999999999999999999999999999 nominvalue noorder nocycle cache 20;

Prompt Table SC_USER_OTP;
Create Table SC_USER_OTP(
   ID           Number(19) Not Null
  ,VERSION      Number(19) Not Null
  ,OTP_KEY      Varchar2(255 Char) Null
  ,SMS_CODE     Varchar2(255 Char) Null
  ,SMS_VALID_TO Timestamp(6) Null
  ,USERNAME     Varchar2(255 Char) Null)
Tablespace USERS
Result_cache (Mode Default);

Prompt Non-Foreign Key Constraints on Table SC_USER_OTP;
Alter Table SC_USER_OTP Add (
  Primary Key
  (ID)
  Using Index
    Tablespace USERS
  Enable Validate);

Alter Table SC_USER_OTP Add (
  Unique (USERNAME)
  Using Index
    Tablespace USERS
  Enable Validate);
