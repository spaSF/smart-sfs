package com.sfs.smartsfs.lazyLob;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.type.BlobType;
import org.springframework.util.Assert;

public class LazyBlobType extends LazyLobType {

	protected static final int[] TYPES = { Types.BLOB };

	public Object nullSafeGet(ResultSet rs, String[] names,
			SessionImplementor session, Object owner)
			throws HibernateException, SQLException {
		Assert.notNull(name, "propertyName must be set in params");
		// return new LazyBlob(getCurrentSession(), owner, name);
		return new LazyBlob(session, owner, name);
	}

	public void nullSafeSet(PreparedStatement st, Object value, int index,
			SessionImplementor session) throws HibernateException, SQLException {
		if (value == null) {
			BlobType.INSTANCE.nullSafeSet(st, value, index,
					session);
			// getCurrentSession());
		} else {
			BlobType.INSTANCE.nullSafeSet(st, ((LazyBlob) value).getBlob(), index, session);			
		}
	}

	public int[] sqlTypes() {
		return TYPES;
	}

	public Class<LazyBlob> returnedClass() {
		return LazyBlob.class;
	}
}
