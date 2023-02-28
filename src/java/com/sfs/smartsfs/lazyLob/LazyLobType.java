package com.sfs.smartsfs.lazyLob;

import java.io.Serializable;
import java.util.Properties;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.internal.util.compare.EqualsHelper;
import org.hibernate.usertype.ParameterizedType;
import org.hibernate.usertype.UserType;

import com.sfs.smartsfs.util.ApplicationContextHolder;

public abstract class LazyLobType implements UserType, ParameterizedType {

	protected String name;

	public void setParameterValues(Properties parameters) {
		name = parameters.getProperty("propertyName");
	}

	public boolean equals(Object x, Object y) throws HibernateException {
		return EqualsHelper.equals(x, y);
	}

	public int hashCode(Object x) throws HibernateException {
		return x.hashCode();
	}

	public Object deepCopy(Object value) throws HibernateException {
		return value;
	}

	public boolean isMutable() {
		return false;
	}

	public Serializable disassemble(Object value) throws HibernateException {
		return (Serializable)value;
	}

	public Object assemble(Serializable cached, Object owner) throws HibernateException {
		return cached;
	}

	public Object replace(Object original, Object target, Object owner) throws HibernateException {
		return original;
	}

	protected SessionImplementor getCurrentSession() {
		SessionFactory sf = ApplicationContextHolder.getApplicationContext().getBean("sessionFactory", SessionFactory.class);
		return (SessionImplementor)sf.getCurrentSession();
	}
}
