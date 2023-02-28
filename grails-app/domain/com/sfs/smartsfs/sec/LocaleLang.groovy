package com.sfs.smartsfs.sec

class LocaleLang {
	String id
	String nazov

	LocaleLang(id,nazov){
		this.id=id
		this.nazov=nazov
	}

	static mapping={
		table 'SC_LOCALE_LANG'
		id generator:"assigned", length:2
		nazov length:50
	}

	static constraints = {
		id nullable:false,blank:false,maxSize:2
		nazov nullable:false,maxSize:50
	}

	@Override
	public String toString() {
		return this.nazov
	}
}
