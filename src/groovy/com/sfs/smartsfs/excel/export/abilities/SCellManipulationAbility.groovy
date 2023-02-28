package com.sfs.smartsfs.excel.export.abilities

import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.util.CellUtil
import org.apache.poi.xssf.streaming.SXSSFCell
import org.apache.poi.xssf.streaming.SXSSFRow

import com.sfs.smartsfs.excel.export.getters.Getter
import com.sfs.smartsfs.excel.export.multisheet.SheetManipulator

@Category(SheetManipulator)
class SCellManipulationAbility {
    SXSSFCell getCellAt(int rowNumber, int columnNumber) {
        SXSSFRow row = SCellManipulationAbility.getOrCreateRow(rowNumber, sheet)
        row.getCell((Short) columnNumber)
    }

    SheetManipulator putCellValue(int rowNumber, int columnNumber, String value) {
        SCellManipulationAbility.getOrCreateCellAt(rowNumber, columnNumber, sheet).setCellValue(getCreationHelper().createRichTextString(value))
        return this
    }

    SheetManipulator putCellValue(int rowNumber, int columnNumber, Getter formatter) {
        SCellManipulationAbility.putCellValue(rowNumber, columnNumber, formatter.propertyName)
        return this
    }

    SheetManipulator putCellValue(int rowNumber, int columnNumber, Number value) {
        SCellManipulationAbility.getOrCreateCellAt(rowNumber, columnNumber, sheet).setCellValue(value.toDouble())
        return this
    }

    SheetManipulator putCellValue(int rowNumber, int columnNumber, Date value) {
        SXSSFCell cell = SCellManipulationAbility.getOrCreateCellAt(rowNumber, columnNumber, sheet)
        cell.setCellValue(value)
        cell.setCellStyle(dateCellStyle)
        return this
    }

    SheetManipulator putCellValue(int rowNumber, int columnNumber, Boolean value) {
        SCellManipulationAbility.getOrCreateCellAt(rowNumber, columnNumber, sheet).setCellValue(value)
        return this
    }

    private static SXSSFCell getOrCreateCellAt(int rowNumber, int columnNumber, Sheet sheet) {
        (SXSSFCell) CellUtil.getCell(getOrCreateRow(rowNumber, sheet), columnNumber)
    }

    private static SXSSFRow getOrCreateRow(int rowNumber, Sheet sheet) {
        (SXSSFRow) CellUtil.getRow(rowNumber, sheet)
    }
}
