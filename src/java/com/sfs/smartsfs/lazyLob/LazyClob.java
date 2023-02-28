package com.sfs.smartsfs.lazyLob;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.sql.Clob;
import java.sql.SQLException;

import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.type.ClobType;

public class LazyClob extends LazyLob<Clob> implements Clob {

	/**
	 * Convenience constructor for use in a domain class.
	 * @param s the string to store in a Clob
	 * @param owner the containing domain class instance
	 */
	public LazyClob(String s, Object owner) {
		super(getCurrentSession().getLobHelper().createClob(s), owner);
	}

	/**
	 * Convenience constructor for use in a domain class.
	 * @param clob an existing Clob
	 * @param owner the containing domain class instance
	 */
	public LazyClob(Clob clob, Object owner) {
		super(clob, owner);
	}

	/**
	 * Called by the UserType when loading from the database.
	 * @param session the session for lazy loading
	 * @param owner the containing domain class instance
	 * @param name the property name
	 */
	public LazyClob(SessionImplementor session, Object owner, String name) {
		super(session, owner, name, ClobType.INSTANCE);
	}

	// interface methods

	public long length() throws SQLException {
		initialize();
		return realLob.length();
	}

	public String getSubString(long pos, int length) throws SQLException {
		initialize();
		return realLob.getSubString(pos, length);
	}

	public Reader getCharacterStream() throws SQLException {
		initialize();
		return realLob.getCharacterStream();
	}

	public InputStream getAsciiStream() throws SQLException {
		initialize();
		return realLob.getAsciiStream();
	}

	public long position(String searchstr, long start) throws SQLException {
		initialize();
		return realLob.position(searchstr, start);
	}

	public long position(Clob searchstr, long start) throws SQLException {
		initialize();
		return realLob.position(searchstr, start);
	}

	public int setString(long pos, String str) throws SQLException {
		initialize();
		return realLob.setString(pos, str);
	}

	public int setString(long pos, String str, int offset, int len) throws SQLException {
		initialize();
		return realLob.setString(pos, str, offset, len);
	}

	public OutputStream setAsciiStream(long pos) throws SQLException {
		initialize();
		return realLob.setAsciiStream(pos);
	}

	public Writer setCharacterStream(long pos) throws SQLException {
		initialize();
		return realLob.setCharacterStream(pos);
	}

	public void truncate(long len) throws SQLException {
		initialize();
		realLob.truncate(len);
	}

	public void free() throws SQLException {
		initialize();
		realLob.free();
	}

	public Reader getCharacterStream(long pos, long length) throws SQLException {
		initialize();
		return realLob.getCharacterStream(pos, length);
	}
}
