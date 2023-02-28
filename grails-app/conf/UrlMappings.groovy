class UrlMappings {

	static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "500"(view:'/error')
		"/"(view:'/index')
		"/home"(controller:"SmartNavigator",action:"home")
	}
}
