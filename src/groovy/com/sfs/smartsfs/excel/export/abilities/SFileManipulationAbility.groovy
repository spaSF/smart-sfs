package com.sfs.smartsfs.excel.export.abilities

import com.sfs.smartsfs.excel.export.SXlsxExporter

@Category(SXlsxExporter)
class SFileManipulationAbility {
    void save(OutputStream outputStream) {
        workbook.write(outputStream)
        outputStream.flush()
        closeZipPackageIfPossible()
    }

    void save() {
        if(fileNameWithPath == null) {
            throw new Exception("No filename given. You cannot create and save a report without giving filename or OutputStream")
        }
        deleteIfAlreadyExists()
        new FileOutputStream(fileNameWithPath).with {
            workbook.write(it)
        }
        closeZipPackageIfPossible()
    }

    void deleteIfAlreadyExists() {
        File existingFile = new File(fileNameWithPath)
        if (existingFile.exists()) {
            existingFile.delete()
        }
    }
}
