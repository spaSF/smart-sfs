package com.sfs.smartsfs.lazyLob;

import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Blob;
import java.sql.SQLException;

import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.type.BlobType;

public class LazyBlob extends LazyLob<Blob> implements Blob {

	/**
	 * Convenience constructor for use in a domain class.
	 * 
	 * @param bytes
	 *            the data to store in a Blob
	 * @param owner
	 *            the containing domain class instance
	 */
	public LazyBlob(byte[] bytes, Object owner) {
		super(getCurrentSession().getLobHelper().createBlob(bytes), owner);
	}

	/**
	 * Convenience constructor for use in a domain class.
	 * 
	 * @param blob
	 *            an existing Blob
	 * @param owner
	 *            the containing domain class instance
	 */
	public LazyBlob(Blob blob, Object owner) {
		super(blob, owner);
	}

	/**
	 * Called by the UserType when loading from the database.
	 * 
	 * @param session
	 *            the session for lazy loading
	 * @param owner
	 *            the containing domain class instance
	 * @param name
	 *            the property name
	 */
	public LazyBlob(SessionImplementor session, Object owner, String name) {
		super(session, owner, name, BlobType.INSTANCE);
	}

	// interface methods

	public long length() throws SQLException {
		initialize();
		return realLob.length();
	}

	public Blob getBlob() throws SQLException {
		initialize();
		return realLob;
	}

	public byte[] getBytes(long pos, int length) throws SQLException {
		initialize();
		return realLob.getBytes(pos, length);
	}

	public InputStream getBinaryStream() throws SQLException {
		initialize();
		return realLob.getBinaryStream();
	}

	public long position(byte[] pattern, long start) throws SQLException {
		initialize();
		return realLob.position(pattern, start);
	}

	public long position(Blob pattern, long start) throws SQLException {
		initialize();
		return realLob.position(pattern, start);
	}

	public int setBytes(long pos, byte[] bytes) throws SQLException {
		initialize();
		return realLob.setBytes(pos, bytes);
	}

	public int setBytes(long pos, byte[] bytes, int offset, int len)
			throws SQLException {
		initialize();
		return realLob.setBytes(pos, bytes, offset, len);
	}

	public OutputStream setBinaryStream(long pos) throws SQLException {
		initialize();
		return realLob.setBinaryStream(pos);
	}

	public void truncate(long len) throws SQLException {
		initialize();
		realLob.truncate(len);
	}

	public void free() throws SQLException {
		initialize();
		realLob.free();
	}

	public InputStream getBinaryStream(long pos, long length)
			throws SQLException {
		initialize();
		return realLob.getBinaryStream(pos, length);
	}
}
