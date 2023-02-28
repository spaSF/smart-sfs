package com.sfs.smartsfs.excel.export.getters

import groovy.transform.InheritConstructors

@InheritConstructors
class AsIsPropertyGetter extends PropertyGetter<Object, Object> {

    protected format(Object value) {
        return value
    }
}
