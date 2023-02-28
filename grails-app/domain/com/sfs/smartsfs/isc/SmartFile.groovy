package com.sfs.smartsfs.isc

import org.apache.commons.io.FileUtils
import org.apache.commons.io.IOUtils
import org.springframework.web.multipart.commons.CommonsMultipartFile

import com.sfs.smartsfs.lazyLob.LazyBlob
import com.sfs.smartsfs.lazyLob.LazyBlobType
import com.sfs.smartsfs.lazyLob.LazyClob
import com.sfs.smartsfs.lazyLob.LazyClobType

class SmartFile {

	String filename
	String fullpath
	Long filesize
	String contentType
	LazyBlob lBlob
	LazyClob lClob
	Boolean storeLocal=false

	static shortFields = ["filename", "fullpath", "contentType"]


	public SmartFile(CommonsMultipartFile file,Boolean storeLocal) {
		this.filename = file.originalFilename;
		this.filesize = file.size
		this.contentType = file.contentType
		this.storeLocal=storeLocal
		def grailsApplication = new SmartFile().domainClass.grailsApplication
		def webRootDir = grailsApplication.mainContext.servletContext.getRealPath("/")
		if(storeLocal){
			def uploadDir = grailsApplication.config.smartsfs?.upload?.directory?:"/upload"
			def realUploadDir = new File(webRootDir, uploadDir)
			realUploadDir.mkdirs() //zrob adresar ak neni
			File localFile=new File( realUploadDir, this.filename) //zrob prazdny file
			file.transferTo(localFile) //svac do lokalneho file
			this.fullpath = localFile.getPath()
		}else{
			def tmpDir = grailsApplication.config.smartsfs?.temp?.directory?:"/tmp"
			def realTempDir = new File(webRootDir, tmpDir)
			realTempDir.mkdirs()
			this.fullpath = realTempDir.getPath().concat("\\${this.filename}")
			this.lBlob= new LazyBlob(file.getBytes(), this)
		}
		println this.fullpath
	}
	
	public SmartFile(byte[] streamBytes,String filename,String contentType,String relativePath,Boolean storeLocal=false){
		this.filename = filename;
		this.filesize = streamBytes.size()
		this.contentType = contentType
		this.storeLocal=storeLocal?:false
		if(this.storeLocal){
			def grailsApplication = new SmartFile().domainClass.grailsApplication
			def webRootDir = grailsApplication.mainContext.servletContext.getRealPath("/")
			def realDir = new File(webRootDir, relativePath)
			realDir.mkdirs() //zrob adresar ak neni
			File localFile=new File( realDir, this.filename) //zrob prazdny file
			this.fullpath=localFile.getPath()
			FileOutputStream fos = new FileOutputStream(localFile);
			fos.write(streamBytes)
			fos.close();
		}else{
			this.fullpath=relativePath
			this.lBlob = new LazyBlob(streamBytes, this)
		}
	}

// SPa takto? 
	ByteArrayInputStream getFile() throws Exception {
		File localFile
		if(this.storeLocal){
			localFile=new File( this.fullpath)
			if(localFile.exists()){
				return new ByteArrayInputStream(FileUtils.readFileToByteArray(localFile))
			}else{
				throw FileNotFoundException
			}
		}else{
			return new ByteArrayInputStream(this.lBlob.getBytes(1L, this.lBlob.length().intValue()));
		}
	}

//  MKr povodne
//	File getFile() throws Exception {
//		File localFile
//		if(this.storeLocal){
//			localFile=new File( this.fullpath)
//			if(localFile.exists()){
//				return localFile
//			}else{
//				throw FileNotFoundException
//			}
//		}else{
//			//temp file
//			def grailsApplication = new SmartFile().domainClass.grailsApplication
//			def webRootDir = grailsApplication.mainContext.servletContext.getRealPath("/")
//			def tmpDir = grailsApplication.config.smartsfs?.temp?.directory?:"/tmp"
//			def realTempDir = new File(webRootDir, tmpDir)
//			realTempDir.mkdirs()
//			localFile=new File( realTempDir,this.filename)
//			FileOutputStream fos = new FileOutputStream(localFile);
//			if(this.lBlob.length()){
//				IOUtils.copyLarge(this.lBlob.binaryStream, fos)
//			}else{
//				IOUtils.copyLarge(this.lClob.asciiStream, fos)
//			}
////			fos.write(this.lBlob)
////			fos.close();
//			localFile.deleteOnExit()
//			return localFile
//		}
//	}

	def beforeDelete(){
		if(this.storeLocal){
			File localFile=new File( this.fullpath)
			if(localFile.exists()) localFile.delete()
		}
	}

	static mapping = {
		table 'SC_FILE'
		id generator:'native',params:[sequence:'SC_FILE_SEQ']
		lBlob type: LazyBlobType, params: [propertyName: 'lBlob']
		lClob type: LazyClobType, params: [propertyName: 'lClob']
		version true
	}

	static constraints = {
	}
}
