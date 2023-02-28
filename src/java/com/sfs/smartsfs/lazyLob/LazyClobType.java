package com.sfs.smartsfs.lazyLob;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.type.ClobType;
import org.springframework.util.Assert;

public class LazyClobType extends LazyLobType {

	protected static final int[] TYPES = { Types.CLOB };

	public Object nullSafeGet(ResultSet rs, String[] names,
			SessionImplementor session, Object owner)
			throws HibernateException, SQLException {
		Assert.notNull(name, "propertyName must be set in params");
		return new LazyClob(getCurrentSession(), owner, name);
	}

//	public void nullSafeSet(PreparedStatement st, Object value, int index,
//			SessionImplementor session) throws HibernateException, SQLException {
//		ClobType.INSTANCE.nullSafeSet(st, value, index, getCurrentSession());
//	}

	public void nullSafeSet(PreparedStatement st, Object value, int index,
			SessionImplementor session) throws HibernateException, SQLException {
		if ( value != null && ((LazyClob)value).realLob == null ) {
			ClobType.INSTANCE.nullSafeSet(st, null, index, getCurrentSession());
		} else {
			ClobType.INSTANCE.nullSafeSet(st, value, index, getCurrentSession());
		}
	}	
	
	public int[] sqlTypes() {
		return TYPES;
	}

	public Class<LazyClob> returnedClass() {
		return LazyClob.class;
	}

}
