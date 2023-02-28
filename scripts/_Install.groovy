println '''start install'''
ant.mkdir(dir:"${basedir}/src/templates")
ant.mkdir(dir:"${basedir}/src/templates/scaffolding")
ant.copy(file:"${pluginBasedir}/src/templates/scaffolding/Controller.groovy",overwrite:true, todir:"${basedir}/src/templates/scaffolding")
ant.mkdir(dir:"${basedir}/src/templates/war")
ant.copy(file:"${basedir}/src/templates/war/web.xml",failonerror:false, overwrite:true, tofile:"${basedir}/src/templates/war/web.xml.bkp")
ant.copy(file:"${pluginBasedir}/src/templates/war/web.xml",overwrite:true, todir:"${basedir}/src/templates/war")
println '''*** templates installed ****'''

ant.mkdir(dir:"${basedir}/web-app/tmp")
ant.mkdir(dir:"${basedir}/web-app/upload")

ant.mkdir(dir:"${basedir}/web-app/isomorphic")
ant.copy(todir:"${basedir}/web-app/isomorphic",overwrite:true){fileset(dir:"${pluginBasedir}/web-app/isomorphic")}
ant.delete(dir:"${pluginBasedir}/web-app/isomorphic")
//ant.copy(file:"${pluginBasedir}/src/templates/plugin/server.properties", todir:"${basedir}/src/java")
println '''*** isomorphic installed ****'''

ant.mkdir(dir:"${basedir}/grails-app/views/login")
ant.copy(file:"${pluginBasedir}/grails-app/views/login/auth.gsp",overwrite:true, todir:"${basedir}/grails-app/views/login")
//ant.copy(file:"${basedir}/grails-app/views/index.gsp",overwrite:true, tofile:"${basedir}/grails-app/views/index.gsp.bkp")
//ant.copy(file:"${pluginBasedir}/grails-app/views/index.gsp",overwrite:true, todir:"${basedir}/grails-app/views")
ant.copy(file:"${pluginBasedir}/grails-app/views/index.gsp",overwrite:true, tofile:"${basedir}/grails-app/views/index.plugin.gsp")
println '''*** gsp installed ****'''

ant.mkdir(dir:"${basedir}/src/sql")
ant.copy(todir:"${basedir}/src/sql",overwrite:true){fileset(dir:"${pluginBasedir}/src/sql")}
println '''*** sql skripts installed ****'''

ant.mkdir(dir:"${basedir}/web-app/xlstempl")
ant.copy(todir:"${basedir}/web-app/xlstempl",overwrite:true){fileset(dir:"${pluginBasedir}/web-app/xlstempl")}
ant.delete(dir:"${pluginBasedir}/web-app/xlstempl")
println '''*** excel templates installed ****'''

ant.copy(todir:"${basedir}/web-app/images",overwrite:false){fileset(dir:"${pluginBasedir}/web-app/images")}
println '''*** images installed ****'''

ant.copy(todir:"${basedir}/web-app/help",overwrite:false){fileset(dir:"${pluginBasedir}/web-app/help")}
println '''*** help installed ****'''

println '''
*******************************************************
* Nainstaloval sa Smart SFS core plugin...........    *
* views/index.plugin.gsp obsahuje navod pre index.gsp *
* Skontroluj web-app/websrc/isomorphic adresar!!!     *
*                                                     *
* POZOR ZMENA!! "grails.resources.modules"            *
* presunute z Config.gfoovy do SmartSfsResources      *
*                                                     *
* svoje resources is daj zvlast!                      *
*                                                     *
* PO PRVEJ INSTALACII:                                *
* Musis pustit "smart-quickstart" script!!!           *
* Doplni config.groovy so vsetkym co treba ;)         *
*                                                     *
*******************************************************

*******************************************************
**POZOR!! Spusti upgr_2_5_1_SNAPSHOT.sql proti DB!!!!**
*******************************************************

'''
