package com.sfs.smartsfs.util

import org.hibernate.dialect.Oracle10gDialect

class NowaitOracleDialect extends Oracle10gDialect {

	@Override
	public String getWriteLockString(int timeout) {
		return super.getForUpdateNowaitString()
	}

	@Override
	public String getForUpdateString() {
		return super.getForUpdateNowaitString()
	}

	@Override
	public String getReadLockString(int timeout) {
		return super.getForUpdateNowaitString()
	}

	@Override
	public String getForUpdateString(String aliases) {
		return super.getForUpdateNowaitString(aliases)
	}

}
