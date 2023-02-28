package com.sfs.smartsfs.app.util

import grails.transaction.Transactional

import java.awt.Color
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import java.lang.reflect.UndeclaredThrowableException
import java.security.GeneralSecurityException
import java.util.concurrent.ThreadLocalRandom

import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import javax.imageio.ImageIO

import org.apache.commons.codec.binary.Base32
import org.apache.commons.codec.binary.Base64
import org.codehaus.groovy.grails.web.context.ServletContextHolder

import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.WriterException
import com.google.zxing.common.BitMatrix
import com.google.zxing.qrcode.QRCodeWriter
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel

@Transactional
class ScOTPService {
	def configHolderService

	private static final int[] DIGITS_POWER	= [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000]
	private static final String OTP_KEY_CHARS = "ABCEFGHJKLMNPRSTUVWXYZ98765432"

	/**
	 * This method uses the JCE to provide the crypto algorithm.
	 * HMAC computes a Hashed Message Authentication Code with the
	 * crypto hash algorithm as a parameter.
	 *
	 * @param crypto: the crypto algorithm (HmacSHA1, HmacSHA256,
	 *                             HmacSHA512)
	 * @param keyBytes: the bytes to use for the HMAC key
	 * @param text: the message or text to be authenticated
	 */
	private byte[] hmac_sha(String crypto, byte[] keyBytes,
			byte[] text){
		try {
			Mac hmac;
			hmac = Mac.getInstance(crypto);
			SecretKeySpec macKey =
					new SecretKeySpec(keyBytes, "RAW");
			hmac.init(macKey);
			return hmac.doFinal(text);
		} catch (GeneralSecurityException gse) {
			throw new UndeclaredThrowableException(gse);
		}
	}


	/**
	 * This method converts a HEX string to Byte[]
	 *
	 * @param hex: the HEX string
	 *
	 * @return: a byte array
	 */

	private byte[] hexStr2Bytes(String hex){
		// Adding one byte to get the right conversion
		// Values starting with "0" can be converted
		byte[] bArray = new BigInteger("10" + hex,16).toByteArray();

		// Copy all the REAL bytes, not the "first"
		byte[] ret = new byte[bArray.length - 1];
		for (int i = 0; i < ret.length; i++)
			ret[i] = bArray[i+1];
		return ret;
	}



	private long getRoundSeconds(){
		String.valueOf(configHolderService.getValueForKey('smartsfs.security.otp.roundbysec')?:"30").toLong() //round seconds
	}

	private long getTimeZero(){
		String.valueOf(configHolderService.getValueForKey('smartsfs.security.otp.tzero')?:"0").toLong()
	}
	private String getDigits(){
		String.valueOf(configHolderService.getValueForKey('smartsfs.security.otp.digits')?:"6")
	}

	private String getCrypto(){
		String.valueOf(configHolderService.getValueForKey('smartsfs.security.otp.crypto')?:"HmacSHA1")
	}

	private String getQRKeyFormat(){
		String.valueOf(configHolderService.getValueForKey('smartsfs.security.otp.qrkeyformat')?:"BASE32")
	}
	private String getQRAppName(){
		String.valueOf(configHolderService.getValueForKey('smartsfs.security.otp.qrAppName')?:"SFS")
	}
	
	private String getQRAppVersion(){
		configHolderService.getAppVersion()
	}

	private String ascStr2Hex(String asc){
		StringBuilder hex = new StringBuilder();

		for (int i=0; i < asc.length(); i++) {
			hex.append(Integer.toHexString((int)asc.charAt(i)));
		}
		return hex.toString()
	}

	private String formatOtpKey(String key){
		switch(getQRKeyFormat()){
			case "BASE32":
				return new Base32().encodeAsString(key.getBytes())
				break
			case "BASE64":
				return new Base64().encodeAsString(key.getBytes())
				break
		}
	}
	/**
	 * This method generates a TOTP value for the given
	 * set of parameters.
	 *
	 * @param key: the shared secret, HEX encoded
	 * @param time: a value that reflects a time
	 * @param returnDigits: number of digits to return
	 *
	 * @return: a numeric String in base 10 that includes
	 *              {@link truncationDigits} digits
	 */

	private String generateTOTPSHA1(String key,
			String time,
			String returnDigits){
		return generateTOTP(key, time, returnDigits, "HmacSHA1");
	}


	/**
	 * This method generates a TOTP value for the given
	 * set of parameters.
	 *
	 * @param key: the shared secret, HEX encoded
	 * @param time: a value that reflects a time
	 * @param returnDigits: number of digits to return
	 *
	 * @return: a numeric String in base 10 that includes
	 *              {@link truncationDigits} digits
	 */

	private String generateTOTP256(String key,
			String time,
			String returnDigits){
		return generateTOTP(key, time, returnDigits, "HmacSHA256");
	}

	/**
	 * This method generates a TOTP value for the given
	 * set of parameters.
	 *
	 * @param key: the shared secret, HEX encoded
	 * @param time: a value that reflects a time
	 * @param returnDigits: number of digits to return
	 *
	 * @return: a numeric String in base 10 that includes
	 *              {@link truncationDigits} digits
	 */

	private String generateTOTP512(String key,
			String time,
			String returnDigits){
		return generateTOTP(key, time, returnDigits, "HmacSHA512");
	}


	/**
	 * This method generates a TOTP value for the given
	 * set of parameters.
	 *
	 * @param key: the shared secret, HEX encoded
	 * @param time: a value that reflects a time
	 * @param returnDigits: number of digits to return
	 * @param crypto: the crypto function to use
	 *
	 * @return: a numeric String in base 10 that includes
	 *              {@link truncationDigits} digits
	 */

	private String generateTOTP(String key,
			String time,
			String returnDigits,
			String crypto){
		int codeDigits = Integer.decode(returnDigits).intValue();
		String result = null;

		// Using the counter
		// First 8 bytes are for the movingFactor
		// Compliant with base RFC 4226 (HOTP)
		while (time.length() < 16 )
			time = "0" + time;

		// Get the HEX in a Byte[]
		byte[] msg = hexStr2Bytes(time);
		byte[] k = hexStr2Bytes(key);
		byte[] hash = hmac_sha(crypto, k, msg);

		// put selected bytes into result int
		int offset = hash[hash.length - 1] & 0xf;

		int binary =
				((hash[offset] & 0x7f) << 24) |
				((hash[offset + 1] & 0xff) << 16) |
				((hash[offset + 2] & 0xff) << 8) |
				(hash[offset + 3] & 0xff);

		int otp = binary % DIGITS_POWER[codeDigits];

		result = Integer.toString(otp);
		while (result.length() < codeDigits) {
			result = "0" + result;
		}
		return result;
	}


	public Boolean otpEnabled(){
		return new Boolean(configHolderService.getValueForKey('smartsfs.security.useOTP'))?:false
	}

	/**
	 * generate OTP code by user key
	 * @param userOTPKey
	 * @return
	 */
	public String generateOTPcode(String userOTPKey){
		long rnd = getRoundSeconds()
		long t0 = getTimeZero()
		String digits = getDigits()
		String crypto = getCrypto()
		//aktualny cas UTC
		Calendar actual = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
		long actualTime = actual.getTimeInMillis()
		//na sekundy
		long actualTimeSec = actualTime/1000
		//sekundy od time zero zaokruhli roudSeconds
		long otpTime = (actualTimeSec-t0)/rnd //v sekundach zaokruhlene na 30 sec
		//cas na hexa string
		String otpTimeString = Long.toHexString(otpTime).toUpperCase()
		while (otpTimeString.length() < 16) otpTimeString= "0" + otpTimeString
		//user key na hexa
		String otpHexKey=ascStr2Hex(userOTPKey)
		//generuj otp kod
		String otp=generateTOTP(otpHexKey,otpTimeString,digits,crypto)
		return otp
	}

	/**
	 * generate otp user key
	 * @return key
	 */
	public String generateOTPKey(){
		StringBuilder code = new StringBuilder();
		int codeLen=0
		switch (getCrypto()){
			case "HmacSHA1":
				codeLen=20
				break
			case "HmacSHA256":
				codeLen=32
				break
			case "HmacSHA512":
				codeLen=64
				break
		}
		for (int i = 0; i < codeLen; i ++) {
			int nextInt = ThreadLocalRandom.current().nextInt(OTP_KEY_CHARS.length());
			code.append(OTP_KEY_CHARS.charAt(nextInt));
		}
		return code.toString();
	}

	public String generateQrPostfix(){
		StringBuilder code = new StringBuilder();
		int codeLen=5
		for (int i = 0; i < codeLen; i ++) {
			int nextInt = ThreadLocalRandom.current().nextInt(OTP_KEY_CHARS.length());
			code.append(OTP_KEY_CHARS.charAt(nextInt));
		}
		return code.toString();
	}
	
	public void generateQR(String username,String userKey,String qrnum){
		def servletContext = ServletContextHolder.servletContext
		def webRootDir = servletContext.getRealPath("/")
		def tmpDir = configHolderService.getValueForKey('smartsfs.temp.directory')?:"/tmp"
		def realTempDir = new File(webRootDir, tmpDir)
		realTempDir.mkdirs()
		String fileName = "loginQR${username}_${qrnum}.png";
		int size = 250;
		String fileType = "png";
		File myFile = new File( realTempDir,fileName)
		String userKeyFmt=formatOtpKey(userKey)
		String appName = getQRAppName()
		String appVer = getQRAppVersion()
		String algorithm
		switch (getCrypto()){
			case "HmacSHA1":
				algorithm="SHA1"
				break
			case "HmacSHA256":
				algorithm="SHA256"
				break
			case "HmacSHA512":
				algorithm="SHA512"
				break
		}
		String digits=getDigits().toString()
		String period=getRoundSeconds().toString()
		String qrCode = "otpauth://totp/${appName}-${appVer}:${username}(${appName})?secret=${userKeyFmt}&issuer=SoftForSolutions&algorithm=${algorithm}&digits=${digits}&period=${period}"
		try {

			Map<EncodeHintType, Object> hintMap = new EnumMap<EncodeHintType, Object>(EncodeHintType.class);
			hintMap.put(EncodeHintType.CHARACTER_SET, "UTF-8");

			// Now with zxing version 3.2.1 you could change border size (white border size to just 1)
			hintMap.put(EncodeHintType.MARGIN, 1); /* default = 4 */
			hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);

			QRCodeWriter qrCodeWriter = new QRCodeWriter();
			BitMatrix byteMatrix = qrCodeWriter.encode(qrCode, BarcodeFormat.QR_CODE, size,
					size, hintMap);
			int CrunchifyWidth = byteMatrix.getWidth();
			BufferedImage image = new BufferedImage(CrunchifyWidth, CrunchifyWidth,
					BufferedImage.TYPE_INT_RGB);
			image.createGraphics();

			Graphics2D graphics = (Graphics2D) image.getGraphics();
			graphics.setColor(Color.WHITE);
			graphics.fillRect(0, 0, CrunchifyWidth, CrunchifyWidth);
			graphics.setColor(Color.BLACK);

			for (int i = 0; i < CrunchifyWidth; i++) {
				for (int j = 0; j < CrunchifyWidth; j++) {
					if (byteMatrix.get(i, j)) {
						graphics.fillRect(i, j, 1, 1);
					}
				}
			}
			ImageIO.write(image, fileType, myFile);
		} catch (WriterException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void deleteQR(String username,String qrnum){
		def servletContext = ServletContextHolder.servletContext
		def webRootDir = servletContext.getRealPath("/")
		def tmpDir = configHolderService.getValueForKey('smartsfs.temp.directory')?:"/tmp"
		def realTempDir = new File(webRootDir, tmpDir)
		String fileName = "loginQR${username}_${qrnum}.png";
		File myFile = new File( realTempDir,fileName)
		if(myFile.exists()) myFile.delete()
	}
}
