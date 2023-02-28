prompt ==================================================;
prompt ORA SQL upgrade z 2.5.0 na 2.5.1;
prompt pouzit v pripade, ze app sa nespusta v update mode;
prompt ==================================================;
prompt 
prompt **custom node icon do MenuItem**;
alter table sc_menuitem add(icon varchar2(255));

Prompt Table SC_CALENDAR;
CREATE TABLE SC_CALENDAR
(
  ID                 	   NUMBER(19),
  NAME                     VARCHAR2(255 CHAR),
  DESCRIPTION              VARCHAR2(255 CHAR),
  START_DATE               TIMESTAMP(6),
  END_DATE                 TIMESTAMP(6),
  DURATION                 NUMBER(10),
  DURATION_UNIT            VARCHAR2(255 CHAR),
  CAN_EDIT                 NUMBER(1),
  CAN_DRAG                 NUMBER(1),
  CAN_RESIZE               NUMBER(1),
  BACKGROUND_COLOR         VARCHAR2(255 CHAR),
  TEXT_COLOR               VARCHAR2(255 CHAR),
  BORDER_COLOR             VARCHAR2(255 CHAR),
  HEADER_BACKGROUND_COLOR  VARCHAR2(255 CHAR),
  HEADER_TEXT_COLOR        VARCHAR2(255 CHAR),
  HEADER_BORDER_COLOR      VARCHAR2(255 CHAR),
  STYLE_NAME               VARCHAR2(255 CHAR),
  VERSION                  NUMBER(19)           NOT NULL,
  CREATED_BY               VARCHAR2(255 CHAR)   NOT NULL,
  CREATED_DATE             TIMESTAMP(6)         NOT NULL,
  UPDATED_BY               VARCHAR2(255 CHAR)   NOT NULL,
  UPDATED_DATE             TIMESTAMP(6)         NOT NULL
)
NOCACHE
MONITORING;


Prompt Non-Foreign Key Constraints on Table SC_CALENDAR;
ALTER TABLE SC_CALENDAR ADD (
  PRIMARY KEY
  (ID)
  ENABLE VALIDATE);

Prompt Sequence SC_CALENDAR_SEQ;
CREATE SEQUENCE SC_CALENDAR_SEQ
  START WITH 1
  MAXVALUE 9999999999999999999999999999
  MINVALUE 1
  NOCYCLE
  CACHE 20
  NOORDER
  NOKEEP
  GLOBAL;
  