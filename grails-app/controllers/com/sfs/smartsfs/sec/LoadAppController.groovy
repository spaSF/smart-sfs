package com.sfs.smartsfs.sec


import static org.springframework.http.HttpMethod.*
import static org.springframework.http.HttpStatus.*

class LoadAppController {

	def index() {
		render view:"index",model:[retval:"OK"]
	}

}
