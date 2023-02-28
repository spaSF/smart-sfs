package com.sfs.smartsfs.isc

import java.text.SimpleDateFormat

import org.grails.databinding.converters.ValueConverter

import com.sfs.smartsfs.app.util.ConfigHolderService

class SmartDateConversionHelper implements ValueConverter{

	ConfigHolderService configHolderService
	//smartclient datetime : 2017-04-03T15:35:00.000
	List<String> formatStrings = [
		"yyyy-MM-dd'T'HH:mm:ss.S",
		'yyyy-MM-dd HH:mm:ss.S',
		"yyyy-MM-dd'T'hh:mm:ss'Z'",
		"yyyy-MM-dd HH:mm:ss.S z",
		'dd.MM.yyyy',
		'yyyy-MM-dd'
	]

	protected Map<String, SimpleDateFormat> formatters = [:].withDefault { String formatString -> new SimpleDateFormat(formatString) }

	@Override
	public Object convert(Object value) {
		Date dateValue
		Boolean inputHasTime = String.valueOf(value).contains(':')
		if (value instanceof String) {
			def firstException
			formatStrings.each { String format ->
				if(format.contains(':')==inputHasTime||!inputHasTime){
					if (dateValue == null) {
						SimpleDateFormat formatter = formatters.get(format)
						if(inputHasTime)formatter.setTimeZone(TimeZone.getTimeZone('UTC')) //pridane kvoliva smartclientovi ale iba pre datetime fields
						try {
							dateValue = formatter.parse(value)
							if(!inputHasTime)dateValue=dateValue.clearTime()
						} catch (Exception e) {
							firstException = firstException ?: e
						}
					}
				}
			}
			if(dateValue == null && firstException) {
				throw firstException
			}
		}
		dateValue
	}

	@Override
	public boolean canConvert(Object value) {
		return value instanceof String
	}


	@Override
	public Class<?> getTargetType() {
		List dateFormats = configHolderService.getObjectForKey("grails.databinding.dateFormats",[])
		if(dateFormats) {
			formatStrings = dateFormats
			formatters = [:].withDefault { String formatString -> new SimpleDateFormat(formatString) }
		}
		return Date
	}
}
