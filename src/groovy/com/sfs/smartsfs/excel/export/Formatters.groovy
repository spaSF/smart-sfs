package com.sfs.smartsfs.excel.export

import com.sfs.smartsfs.excel.export.getters.AsIsPropertyGetter
import com.sfs.smartsfs.excel.export.getters.Getter
import com.sfs.smartsfs.excel.export.getters.LongToDatePropertyGetter
import com.sfs.smartsfs.excel.export.getters.PropertyGetter

class Formatters {
    static PropertyGetter asDate(String propertyName) {
        return new LongToDatePropertyGetter(propertyName)
    }

    static PropertyGetter asIs(String propertyName) {
        return new AsIsPropertyGetter(propertyName)
    }

    static List<Getter> convertSafelyToGetters(List properties) {
        properties.collect {
            if (it instanceof Getter) {
                return it
            } else if(it instanceof String) {
                return asIs(it)
            } else {
                throw IllegalArgumentException('List of properties, which should be either String, a Getter. Found: ' +
                        it?.toString() + ' of class ' + it?.getClass())
            }
        }
    }

    static List<Object> convertSafelyFromGetters(List properties) {
        properties.collect {
            (it instanceof Getter) ? it.getPropertyName() : it
        }
    }
}
