package com.sfs.smartsfs.excel.export

import groovy.transform.PackageScope
import groovy.transform.TypeChecked

import org.apache.poi.openxml4j.opc.OPCPackage
import org.apache.poi.ss.usermodel.CellStyle
import org.apache.poi.ss.usermodel.CreationHelper
import org.apache.poi.ss.usermodel.DataFormat
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.xssf.streaming.SXSSFWorkbook
import org.apache.poi.xssf.usermodel.XSSFWorkbook

import com.sfs.smartsfs.excel.export.abilities.SCellManipulationAbility
import com.sfs.smartsfs.excel.export.abilities.SFileManipulationAbility
import com.sfs.smartsfs.excel.export.abilities.SRowManipulationAbility
import com.sfs.smartsfs.excel.export.multisheet.SAdditionalSheet
import com.sfs.smartsfs.excel.export.multisheet.SheetManipulator

@Mixin([SRowManipulationAbility, SCellManipulationAbility, SFileManipulationAbility])
@TypeChecked
class SXlsxExporter implements SheetManipulator {
    static final String defaultSheetName = "Report"
    static final String filenameSuffix = ".xlsx"
    @PackageScope static final String defaultDateFormat = "yyyy/mm/dd h:mm:ss"

    private Map<String, SAdditionalSheet> sheets = [:]
    private String worksheetName
    private CellStyle dateCellStyle
    private CreationHelper creationHelper
	//private XSSFWorkbook wb
    protected SXSSFWorkbook workbook
    protected String fileNameWithPath
    protected OPCPackage zipPackage

    SXlsxExporter(Integer windowSize) {
        this.workbook = new SXSSFWorkbook(windowSize)
        setUp(workbook)
    }

    SXlsxExporter(String destinationFileNameWithPath, Integer windowSize) {
        this.fileNameWithPath = destinationFileNameWithPath
        this.workbook = createOrLoadWorkbook(destinationFileNameWithPath,windowSize)
        setUp(workbook)
    }

    private SXSSFWorkbook createOrLoadWorkbook(String fileNameWithPath, Integer windowSize) {
        if(new File(fileNameWithPath).exists()) {
            zipPackage = OPCPackage.open(fileNameWithPath)
            return new SXSSFWorkbook(new XSSFWorkbook(zipPackage),windowSize)
        } else {
            return new SXSSFWorkbook(windowSize)
        }
    }

    SXlsxExporter(String templateFileNameWithPath, String destinationFileNameWithPath) {
        this.fileNameWithPath = destinationFileNameWithPath
        this.workbook = copyAndLoad(templateFileNameWithPath, destinationFileNameWithPath)
        setUp(workbook)
    }

    protected SXSSFWorkbook copyAndLoad(String templateNameWithPath, String destinationNameWithPath) {
        if(!new File(templateNameWithPath).exists()) {
            throw new IOException("No template file under path: " + templateNameWithPath)
        }
        copy(templateNameWithPath, destinationNameWithPath)
        zipPackage = OPCPackage.open(destinationNameWithPath)
        return new SXSSFWorkbook(new XSSFWorkbook(zipPackage))
    }

    protected setUp(SXSSFWorkbook workbook) {
        this.creationHelper = workbook.getCreationHelper()
        this.dateCellStyle = createDateCellStyle(defaultDateFormat)
    }

    Sheet getSheet() {
        if(sheets.isEmpty()) {
            SAdditionalSheet additionalSheet = withDefaultSheet()
            sheets.put(worksheetName, additionalSheet)
        }
        return sheets[worksheetName].sheet
    }

    SAdditionalSheet withDefaultSheet() {
        worksheetName = worksheetName ?: defaultSheetName
        return sheet(worksheetName)
    }

    SAdditionalSheet sheet(String sheetName) {
        if ( !sheets[sheetName] ) {
            Sheet workbookSheet = workbook.getSheet( sheetName ) ?: workbook.createSheet( sheetName )
            sheets[sheetName] = new SAdditionalSheet(workbookSheet, workbook.creationHelper, dateCellStyle)
        }
        return sheets[sheetName]
    }

    private void copy(String templateNameWithPath, String destinationNameWithPath) {
        zipPackage = OPCPackage.open(templateNameWithPath)
        XSSFWorkbook originalWorkbook = new XSSFWorkbook(zipPackage)
        new FileOutputStream(destinationNameWithPath).with {
            originalWorkbook.write(it)
        }
    }

    SXlsxExporter setDateCellFormat(String format) {
        this.dateCellStyle = createDateCellStyle(format)
        return this
    }

    private CellStyle createDateCellStyle(String expectedDateFormat) {
        CellStyle dateCellStyle = workbook.createCellStyle()		
        DataFormat dateFormat = workbook.createDataFormat()
        dateCellStyle.dataFormat = dateFormat.getFormat(expectedDateFormat)
        return dateCellStyle
    }

    void setWorksheetName(String worksheetName) {
        this.worksheetName = worksheetName
    }

    SXSSFWorkbook getWorkbook() {
        return workbook
    }

    CellStyle getDateCellStyle() {
        return dateCellStyle
    }

    CreationHelper getCreationHelper() {
        return creationHelper
    }

    //FIXME: nope, that doesn't work
    void finalize() {
        closeZipPackageIfPossible()
    }

    private void closeZipPackageIfPossible() {
        if(zipPackage) {
            try {
                zipPackage.close()
            } finally {
                zipPackage = null
            }
        }
    }
}