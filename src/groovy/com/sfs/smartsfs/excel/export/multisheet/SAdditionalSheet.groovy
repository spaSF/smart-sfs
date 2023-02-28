package com.sfs.smartsfs.excel.export.multisheet

import groovy.transform.TypeChecked

import org.apache.poi.ss.usermodel.CellStyle
import org.apache.poi.ss.usermodel.CreationHelper
import org.apache.poi.ss.usermodel.Sheet

import com.sfs.smartsfs.excel.export.abilities.SCellManipulationAbility
import com.sfs.smartsfs.excel.export.abilities.SRowManipulationAbility

@Mixin([SRowManipulationAbility, SCellManipulationAbility])
@TypeChecked
class SAdditionalSheet implements SheetManipulator {
    private Sheet sheet
    private CreationHelper creationHelper
    private CellStyle dateCellStyle

    SAdditionalSheet(Sheet sheet, CreationHelper creationHelper, CellStyle dateCellStyle) {
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
