/** SMART-SFS 2.0.0-SNAPSHOT INSTALL/UPGRADE SCRIPT FOR ORACLE DB*/ 
ALTER TABLE SC_CONFIG 
RENAME COLUMN KEY TO PROP_KEY
/

CREATE TABLE sc_user_setting
    (id                             NUMBER(19,0) NOT NULL,
    version                        NUMBER(19,0) NOT NULL,
    app_case                       VARCHAR2(255) NOT NULL,
    app_object                     VARCHAR2(255) NOT NULL,
    field_name                     VARCHAR2(255),
    setting_object                 CLOB,
    use_default                    NUMBER(1,0),
    user_id                        NUMBER(19,0) NOT NULL,
    name                            VARCHAR2 (255))
  NOPARALLEL
  LOGGING
/

create sequence SC_SETTING_SEQ
/

-- Constraints for SC_USER_SETTING

ALTER TABLE sc_user_setting
ADD PRIMARY KEY (id)
USING INDEX
/

-- End of DDL Script for Table ZIUPT.SC_USER_SETTING

-- Foreign Key
ALTER TABLE sc_user_setting
ADD CONSTRAINT fk1961cb4b20310cd3 FOREIGN KEY (user_id)
REFERENCES sc_user (id)
/

-- config for user_settings
INSERT INTO sc_config (ID,VERSION,ADMIN_PROPERTY,CREATED_BY,DATE_CREATED,DESCRIPTION,KEY,LAST_UPDATED,UPDATED_BY,VALUE)
VALUES(SC_CONFIG_SEQ.nextval,0,1,'admin',sysdate,'smartsfs.userSetting.supported','smartsfs.userSetting.supported',sysdate,'admin','false');
/

commit;
-- End of DDL script for Foreign Key(s)
