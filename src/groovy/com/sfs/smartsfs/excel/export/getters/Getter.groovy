package com.sfs.smartsfs.excel.export.getters

interface Getter<DestinationFormat> {
    String getPropertyName()
    DestinationFormat getFormattedValue(Object object)
}
