package com.sfs.smartsfs.util

import java.text.DecimalFormat
import java.text.NumberFormat

import org.grails.databinding.converters.web.LocaleAwareNumberConverter

class LocaleAwareBigDecimalConverter extends LocaleAwareNumberConverter{
	@Override
	protected NumberFormat getNumberFormatter() {
		def nf = super.getNumberFormatter()
		if (!(nf instanceof DecimalFormat)) {
			throw new IllegalStateException("Cannot support non-DecimalFormat: " + nf)
		}

		((DecimalFormat)nf).setParseBigDecimal(true)
		nf
	}

	@Override
	public Object convert(Object value) {
		if(((String)value).indexOf(".")){
			((DecimalFormat)numberFormatter).getDecimalFormatSymbols().setDecimalSeparator("." as char)
		}
		numberFormatter.parse((String)value).asType(getTargetType())
	}
	
}
