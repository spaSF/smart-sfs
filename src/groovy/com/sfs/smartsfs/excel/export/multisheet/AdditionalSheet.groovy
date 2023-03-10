package com.sfs.smartsfs.excel.export.multisheet

import groovy.transform.TypeChecked

import org.apache.poi.ss.usermodel.CellStyle
import org.apache.poi.ss.usermodel.CreationHelper
import org.apache.poi.ss.usermodel.Sheet

import com.sfs.smartsfs.excel.export.abilities.CellManipulationAbility
import com.sfs.smartsfs.excel.export.abilities.RowManipulationAbility
import com.sfs.smartsfs.excel.export.abilities.SCellManipulationAbility

@Mixin([RowManipulationAbility, CellManipulationAbility])
@TypeChecked
class AdditionalSheet implements SheetManipulator {
    private Sheet sheet
    private CreationHelper creationHelper
    private CellStyle dateCellStyle

    AdditionalSheet(Sheet sheet, CreationHelper creationHelper, CellStyle dateCellStyle) {
        this.sheet = sheet
        this.creationHelper = creationHelper
        this.dateCellStyle = dateCellStyle
    }

    Sheet getSheet() {
        return sheet
    }

    CreationHelper getCreationHelper() {
        return creationHelper
    }

    CellStyle getDateCellStyle() {
        return dateCellStyle
    }

}
