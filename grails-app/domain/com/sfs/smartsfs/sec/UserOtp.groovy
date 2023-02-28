package com.sfs.smartsfs.sec

class UserOtp {
	
	String username
	String otpKey
	String smsCode
	Date smsValidTo
	
	static mapping = {
		table 'SC_USER_OTP'
		id generator:'native',params:[sequence:'SC_USER_OTP_SEQ']
		username unique:true
	}
	
    static constraints = {
		username blank: false,unique:true
    }
}
