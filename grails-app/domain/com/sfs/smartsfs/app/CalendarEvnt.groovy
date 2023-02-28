package com.sfs.smartsfs.app

import javax.persistence.Inheritance
import javax.persistence.InheritanceType

import com.sfs.smartsfs.audit.AuditStamp
import com.sfs.smartsfs.enums.TimeUnit
/**
 * kalendar event pre ISC.Calendar
 * rozsiritelna trieda cez table per subclass
 * POZOR! overene pre Oracle, inde nemusi fungovat
 * custom properties pre Calendar instance vloz do FormProperties DS
 * @author MKR
 *
 */
@AuditStamp
class CalendarEvnt {

   String name
   String description
   Date startDate
   Date endDate
   Integer duration
   TimeUnit durationUnit = TimeUnit.minute
   Boolean canDrag
   Boolean canEdit
   Boolean canResize
   String styleName
   String backgroundColor
   String borderColor
   String textColor
   String headerBorderColor
   String headerBackgroundColor
   String headerTextColor


   static mapping = {
      tablePerHierarchy false
      table 'SC_CALENDAR'
      version true
      id generator:'native',params:[sequence:'SC_CALENDAR_SEQ']
   }

   static constraints = {
   }
}
