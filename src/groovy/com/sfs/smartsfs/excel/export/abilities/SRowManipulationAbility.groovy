package com.sfs.smartsfs.excel.export.abilities

import java.sql.Timestamp

import org.codehaus.groovy.runtime.NullObject

import com.sfs.smartsfs.excel.export.Formatters
import com.sfs.smartsfs.excel.export.getters.Getter
import com.sfs.smartsfs.excel.export.multisheet.SheetManipulator

@Category(SheetManipulator)
class SRowManipulationAbility {
    private static final handledPropertyTypes = [String, Getter, Date, Boolean, Timestamp, NullObject, Long, Integer, BigDecimal, BigInteger, Byte, Double, Float, Short]

    SheetManipulator fillHeader(List properties) {
        fillRow(Formatters.convertSafelyFromGetters(properties), 0)
    }

    SheetManipulator fillRow(List<Object> properties) {
        fillRow(properties, 1)
    }

    SheetManipulator fillRow(List<Object> properties, int rowNumber) {
        fillRowWithValues(properties, rowNumber)
    }

	// for SXSSF
	SheetManipulator fillRowWithValues(List<Object> properties, int rowNumber) {
		properties.eachWithIndex { Object property, int index ->
			def propertyToBeInserted = SRowManipulationAbility.getPropertyToBeInserted(property)
			SCellManipulationAbility.putCellValue(this, rowNumber, index, propertyToBeInserted)
		}
		return this
	}
	
    SheetManipulator add(List<Object> objects, List<Object> selectedProperties) {
        add(objects, selectedProperties, 1)
    }

    SheetManipulator add(List<Object> objects, List<Object> selectedProperties, int rowNumber) {
        objects.eachWithIndex() { Object object, int index ->
            SRowManipulationAbility.add(this, object, selectedProperties, rowNumber + index)
        }
        return this
    }

    SheetManipulator add(Object object, List<Object> selectedProperties, int rowNumber) {
        List<Object> properties = SRowManipulationAbility.getPropertiesFromObject(object, Formatters.convertSafelyToGetters(selectedProperties))
        fillRow(properties, rowNumber)
    }

    private static Object getPropertyToBeInserted(Object property){
        property = property == null ? "" : property
        if(!SRowManipulationAbility.verifyPropertyTypeCanBeHandled(property)){
            property = property.toString()
        }
        return property
    }

    private static List<Object> getPropertiesFromObject(Object object, List<Getter> selectedProperties) {
        selectedProperties.collect { it.getFormattedValue(object) }
    }

    private static boolean verifyPropertyTypeCanBeHandled(Object property) {
        if(!(handledPropertyTypes.find {it.isAssignableFrom(property.getClass())} )) {
            return false
        } else {
            return true
        }
    }
}
