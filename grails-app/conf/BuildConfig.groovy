grails.servlet.version = "3.0"
grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"

grails.project.fork = [
	// configure settings for compilation JVM, note that if you alter the Groovy version forked compilation is required
	//  compile: [maxMemory: 256, minMemory: 64, debug: false, maxPerm: 256, daemon:true],

	// configure settings for the test-app JVM, uses the daemon by default
	test: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, daemon:true],
	// configure settings for the run-app JVM
	run: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, forkReserve:false],
	// configure settings for the run-war JVM
	war: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, forkReserve:false],
	// configure settings for the Console UI JVM
	console: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256]
]

grails.project.dependency.resolver = "maven" // or ivy
//maven-deploy --repository=sfs-artifactory-snap
grails.project.dependency.distribution = {
	remoteRepository(id: "sfs-artifactory-snap", url: "http://alfa-tcsfs.internal.softforsolutions.com:8080/artifactory/plugins-snapshot-local"){
		authentication username:"deployer",password:"deployer"
	}
	remoteRepository(id: "sfs-artifactory-release", url: "http://alfa-tcsfs.internal.softforsolutions.com:8080/artifactory/plugins-release-local"){
		authentication username:"deployer",password:"deployer"
	}
	remoteRepository(id: "sfs-artifactory-libs-release", url: "http://alfa-tcsfs.internal.softforsolutions.com:8080/artifactory/libs-release-local"){
		authentication username:"deployer",password:"deployer"
	}
}

grails.project.dependency.resolution = {
	// inherit Grails' default dependencies
	inherits("global") {
		// uncomment to disable ehcache
		// excludes 'ehcache'
	}
	log "debug" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
	repositories {
		mavenRepo "http://alfa-tcsfs.internal.softforsolutions.com:8080/artifactory/libs-release/"
		
		grailsCentral()
		mavenLocal()
		mavenCentral()
		// uncomment the below to enable remote dependency resolution
		// from public Maven repositories
		//mavenRepo "http://repository.codehaus.org"
		//mavenRepo "http://download.java.net/maven/2/"
		//mavenRepo "http://repository.jboss.com/maven2/"
		//mavenRepo "https://repo.grails.org/grails/core"  //excel export
	}
	dependencies {
		runtime ('com.oracle:ojdbc7:12.1.0.2'){export = false}
		//csv export
		compile 'commons-csv:commons-csv:1.4'
		compile 'com.google.zxing:core:3.2.1' //OTP QR code
		// xls export
		compile('org.apache.poi:poi:3.12')
		compile ('org.apache.poi:poi-ooxml:3.12') { excludes( 'stax-api') }
		compile('org.apache.poi:ooxml-schemas:1.1') { excludes( 'stax-api') }		
		//smartclient deps
		runtime 'isomorphic_core_rpc:isomorphic_core_rpc:11.1'
		runtime 'isc-jakarta-oro:isc-jakarta-oro:2.0.6'
		runtime 'commons-cli:commons-cli:1.4'
		runtime 'commons-collections:commons-collections:3.2.2'
		runtime 'org.apache.commons:commons-collections4:4.1'
		runtime 'commons-pool:commons-pool:1.6'
		runtime 'commons-io:commons-io:2.5'
		runtime 'commons-codec:commons-codec:1.10'
		runtime 'org.slf4j:slf4j-api:1.7.12'
		runtime 'commons-jxpath:commons-jxpath:1.3'
		runtime 'org.apache.httpcomponents:httpclient:4.5.3'
		runtime 'org.apache.httpcomponents:httpcore:4.4.6'
		runtime ('org.apache.velocity:velocity:1.7'){excludes 'oro'}
		runtime 'joda-time:joda-time:2.9.9'
		runtime 'isomorphic:iText:2.1.7'
		runtime 'isomorphic:core-renderer:R8-isomorphic'
		runtime 'net.sf.jtidy:jtidy:r938'
		runtime 'isomorphic_contentexport:isomorphic_contentexport:11.0'
      
      test 'org.grails:grails-datastore-test-support:1.0-grails-2.4'
		
	}

	plugins {
		build(":tomcat:7.0.70",":release:3.1.2",":rest-client-builder:2.1.1") { export = false }
		compile (':cache:1.1.8'){ export = false }
		runtime "org.grails.plugins:resources:1.2.14"
		runtime (":hibernate4:4.3.10"){ export = false }
		compile ":resources:1.2.14"
		compile ":scaffolding:2.1.2"
		compile ":spring-security-core:2.0.0"
//		compile ":audit-trail:2.1.2"
	}
}
