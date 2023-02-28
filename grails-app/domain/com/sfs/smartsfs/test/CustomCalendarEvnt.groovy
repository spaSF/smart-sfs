package com.sfs.smartsfs.test

import com.sfs.smartsfs.app.CalendarEvnt
import com.sfs.smartsfs.app.ConfigProperty

class CustomCalendarEvnt extends CalendarEvnt{

   String customValue
   ConfigProperty customPropRef

   static mapping = {
      table 'TMP_CALENDAR'
   }

   static constraints = {
   }
}
