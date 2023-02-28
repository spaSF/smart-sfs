package com.sfs.smartsfs.lazyLob;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;

import org.codehaus.groovy.grails.orm.hibernate.ConfigurableLocalSessionFactoryBean;
import org.hibernate.JDBCException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.jdbc.Work;
import org.hibernate.mapping.Column;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.mapping.Property;
import org.hibernate.mapping.Table;
import org.hibernate.persister.entity.SingleTableEntityPersister;
import org.hibernate.type.AbstractSingleColumnStandardBasicType;
import org.springframework.util.Assert;

import com.sfs.smartsfs.util.ApplicationContextHolder;

public abstract class LazyLob<T> {

	protected T realLob;
	protected transient SessionImplementor session;
	protected Object owner;
	protected String name;
	protected AbstractSingleColumnStandardBasicType<T> lobType;

	protected LazyLob(T lob, Object owner) {
		Assert.notNull(owner, "owner cannot be null");
		Assert.notNull(lob, "The Lob cannot be null");
		realLob = lob;
		this.owner = owner;
	}

	protected LazyLob(SessionImplementor session, Object owner, String name, AbstractSingleColumnStandardBasicType<T> lobType) {
		this.session = session;
		this.owner = owner;
		this.name = name;
		this.lobType = lobType;
	}

	public boolean isInitialized() {
		return realLob != null;
	}

	protected void initialize() throws SQLException {
		if (isInitialized()) {
			return;
		}

		try {
			((Session)session).doWork(new Work() {
				@SuppressWarnings("unchecked")
				public void execute(Connection connection) throws SQLException {
					String tableName = findTableName();
					String columnName = findColumnName(tableName);
					String idColumnName = findIdColumnName(tableName);
					Serializable id = findId();
					String sql = generateSql(tableName, columnName, idColumnName);
					PreparedStatement ps = null;
					ResultSet rs = null;
					try {
						ps = connection.prepareStatement(sql);
						ps.setObject(1,  id);
						rs = ps.executeQuery();
						rs.next();
						realLob = (T)lobType.nullSafeGet(rs, columnName, session, owner);
					}
					finally {
						try { if (rs != null) rs.close(); } catch (SQLException ignored) {}
						try { if (ps != null) ps.close(); } catch (SQLException ignored) {}
					}
				}
			});
		}
		catch (JDBCException e) {
			throw e.getSQLException();
		}
	}

	protected String generateSql(String tableName, String columnName, String idColumnName) {
		return "select " + columnName + " from " + tableName + " where " + idColumnName + "=?";
	}

	protected Serializable findId() {
		return session.getContextEntityIdentifier(owner);
	}

	protected String findTableName() {
		return ((SingleTableEntityPersister)session.getEntityPersister(null, owner)).getTableName();
	}

	protected String findColumnName(String tableName) {
		for (Iterator<PersistentClass> iter = getConfiguration().getClassMappings(); iter.hasNext(); ) {
			PersistentClass pc = iter.next();
			if (pc.getTable().getName().equals(getTableName(tableName))) {
				for (Iterator<?> iter2 = pc.getPropertyIterator(); iter2.hasNext(); ) {
					Property property = (Property) iter2.next();
					if (property.getName().equals(name)) {
						return ((Column)property.getColumnIterator().next()).getName();
					}
				}
			}
		}

		throw new IllegalStateException("Unable to find the associated database column for property '" + name + "'");
	}

	protected String findIdColumnName(String tableName) {
		for (Iterator<PersistentClass> iter = getConfiguration().getClassMappings(); iter.hasNext(); ) {
			Table table = iter.next().getTable();
			if (table.getName().equals(getTableName(tableName))) {
				return ((Column)table.getPrimaryKey().getColumnIterator().next()).getName();
			}
		}

		throw new IllegalStateException("Unable to find the associated database column for table '" + tableName + "'");
	}

	protected static Configuration getConfiguration() {
		ConfigurableLocalSessionFactoryBean fb = getBean("&sessionFactory", ConfigurableLocalSessionFactoryBean.class);
		return fb.getConfiguration();
	}

	protected static Session getCurrentSession() {
		SessionFactory sf = getBean("sessionFactory", SessionFactory.class);
		return sf.getCurrentSession();
	}

	protected static <B> B getBean(String beanName, Class<B> beanType) {
		return ApplicationContextHolder.getApplicationContext().getBean(beanName, beanType);
	}
	
	protected static String getDefaultSchema() {
		SessionFactory sf = ApplicationContextHolder.getApplicationContext().getBean("sessionFactory", SessionFactory.class);
		SessionFactoryImplementor sfi = (SessionFactoryImplementor)sf;
		return sfi.getSettings().getDefaultSchemaName();
	}

	protected static String getTableName(String tableName) {
		if (getDefaultSchema() != null && !getDefaultSchema().isEmpty()) {
			return tableName.replaceFirst(getDefaultSchema().concat("."), "");
		}
		return tableName;
	}
}
