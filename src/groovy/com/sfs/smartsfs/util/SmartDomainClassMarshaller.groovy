package com.sfs.smartsfs.util;

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityUtils

import org.codehaus.groovy.grails.commons.ClassPropertyFetcher
import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.commons.GrailsDomainClassProperty
import org.codehaus.groovy.grails.support.IncludeExcludeSupport
import org.codehaus.groovy.grails.support.proxy.DefaultProxyHandler
import org.codehaus.groovy.grails.support.proxy.EntityProxyHandler
import org.codehaus.groovy.grails.support.proxy.ProxyHandler
import org.codehaus.groovy.grails.web.converters.ConverterUtil
import org.codehaus.groovy.grails.web.converters.exceptions.ConverterException
import org.codehaus.groovy.grails.web.converters.marshaller.IncludeExcludePropertyMarshaller
import org.codehaus.groovy.grails.web.json.JSONWriter
import org.springframework.beans.BeanWrapper
import org.springframework.beans.BeanWrapperImpl

public class SmartDomainClassMarshaller extends IncludeExcludePropertyMarshaller<JSON> {

	private boolean includeVersion = false;
	private ProxyHandler proxyHandler;
	private GrailsApplication application;

	public SmartDomainClassMarshaller(boolean includeVersion, GrailsApplication application) {
		this(includeVersion, new DefaultProxyHandler(), application);
	}

	public SmartDomainClassMarshaller(boolean includeVersion, ProxyHandler proxyHandler, GrailsApplication application) {
		this.includeVersion = includeVersion;
		this.proxyHandler = proxyHandler;
		this.application = application;
	}

	public boolean isIncludeVersion() {
		return includeVersion;
	}

	public void setIncludeVersion(boolean includeVersion) {
		this.includeVersion = includeVersion;
	}

	public boolean supports(Object object) {
		String name = ConverterUtil.trimProxySuffix(object.getClass().getName());
		return application.isArtefactOfType(DomainClassArtefactHandler.TYPE, name);
	}

	//    @SuppressWarnings({ })
	public void marshalObject(Object value, JSON json) throws ConverterException {
		JSONWriter writer = json.getWriter();
		value = proxyHandler.unwrapIfProxy(value);
		Class<?> clazz = value.getClass();

		List<String> excludes = json.getExcludes(clazz);
		List<String> includes = json.getIncludes(clazz);
		IncludeExcludeSupport<String> includeExcludeSupport = new IncludeExcludeSupport<String>(null,["password"]);//exclude password property

		GrailsDomainClass domainClass = (GrailsDomainClass)application.getArtefact(
				DomainClassArtefactHandler.TYPE, ConverterUtil.trimProxySuffix(clazz.getName()));
		BeanWrapper beanWrapper = new BeanWrapperImpl(value);

		writer.object();

		if(shouldInclude(includeExcludeSupport, includes, excludes, value, "class")) {
			writer.key("class").value(domainClass.getClazz().getName());
		}


		GrailsDomainClassProperty id = domainClass.getIdentifier();

		if(shouldInclude(includeExcludeSupport, includes, excludes, value, id.getName())) {
			Object idValue = extractValue(value, id);
			json.property(GrailsDomainClassProperty.IDENTITY, idValue);
		}

		if (shouldInclude(includeExcludeSupport, includes, excludes, value, GrailsDomainClassProperty.VERSION) && isIncludeVersion()) {
			GrailsDomainClassProperty versionProperty = domainClass.getVersion();
			Object version = extractValue(value, versionProperty);
			json.property(GrailsDomainClassProperty.VERSION, version);
		}

		GrailsDomainClassProperty[] properties = domainClass.getPersistentProperties();

		for (GrailsDomainClassProperty property : properties) {
			if(!shouldInclude(includeExcludeSupport, includes, excludes, value, property.getName())) continue;
			if(property.getName()=="password" && SpringSecurityUtils.securityConfig.userLookup.userDomainClassName==domainClass.getFullName()) continue	
			
			writer.key(property.getName());
			if (!property.isAssociation()) {
				// Write non-relation property
				Object val = beanWrapper.getPropertyValue(property.getName());
				json.convertAnother(val);
			}
			else {
				Object referenceObject = beanWrapper.getPropertyValue(property.getName());
				if (referenceObject == null) {
					json.value(null);
				}
				else {
					GrailsDomainClass referencedDomainClass = property.getReferencedDomainClass();

					// Embedded are now always fully rendered
					if (property.isOneToOne() || property.isManyToOne() || referencedDomainClass == null || property.isEmbedded() || property.getType().isEnum()) {

						try {
							//ak je definovany static shortFields v domene
							if(referencedDomainClass.clazz.shortFields){
								asDisplayObject(referenceObject, json, referencedDomainClass.getIdentifier(), referencedDomainClass.clazz.shortFields, referencedDomainClass)
							}else{
								json.convertAnother(referenceObject);
							}
						} catch (Exception e) {
							json.convertAnother(referenceObject);
						}
					}
					else {
						json.value(null);
					}
				}
			}
		}

		try {
			if(domainClass.clazz.transients){
				def trans = domainClass.clazz.transients

				if(trans){
					trans.each {
						def property=domainClass.getPropertyByName(it)
						if(!property.getName().contains("Service")){
							Object val = beanWrapper.getPropertyValue(property.getName());
							writer.key(it)
							try{
								//ak je transient field referenciou na domain object, skontroluj shortFields
								Class<?> tclazz = val.getClass()
								GrailsDomainClass referencedDomainClass  = (GrailsDomainClass)application.getArtefact(
										DomainClassArtefactHandler.TYPE, ConverterUtil.trimProxySuffix(tclazz.getName()));
								if(referencedDomainClass?.clazz?.shortFields){
									asDisplayObject(val, json, referencedDomainClass.getIdentifier(), referencedDomainClass.clazz.shortFields, referencedDomainClass)
								}else{
									json.convertAnother(val);
								}
							}catch(Exception e){
								json.convertAnother(val)
							}
						}
					}
				}
			}
		} catch (Exception e) {

		}
		writer.endObject();
	}

	private boolean shouldInclude(IncludeExcludeSupport<String> includeExcludeSupport, List<String> includes, List<String> excludes, Object object, String propertyName) {
		return includeExcludeSupport.shouldInclude(includes,excludes,propertyName) && shouldInclude(object,propertyName);
	}

	protected void asDisplayObject(Object refObj, JSON json,GrailsDomainClassProperty idProperty, shortFields, GrailsDomainClass refDomainClass) throws ConverterException, IllegalArgumentException, IllegalAccessException {
		Object idValue;

		if (proxyHandler instanceof EntityProxyHandler) {
			idValue = ((EntityProxyHandler) proxyHandler).getProxyIdentifier(refObj);
			if (idValue == null) {
				idValue = extractValue(refObj, idProperty);
			}
		}
		else {
			idValue = extractValue(refObj, idProperty);
		}
		JSONWriter writer = json.getWriter();
		writer.object();
		writer.key("id").value(idValue);

		//        shortFields = field.get(null);
		if (shortFields instanceof Collection) {
			BeanWrapper beanWrapper = new BeanWrapperImpl(refObj);
			Collection<String> o = (Collection<String>) shortFields;
			for (String el : o) {
				def property = refDomainClass.getPropertyByName(el)
				//				writer.key(el).value(extractValue(refObj, property));
				writer.key(property.getName());
				if (!property.isAssociation()) {
					// Write non-relation property
					Object val = beanWrapper.getPropertyValue(property.getName());
					json.convertAnother(val);
				}
				else {
					Object referenceObject = beanWrapper.getPropertyValue(property.getName());
					if (referenceObject == null) {
						json.value(null);
					}
					else {
						GrailsDomainClass referencedDomainClass = property.getReferencedDomainClass();

						// Embedded are now always fully rendered
						if (property.isOneToOne() || property.isManyToOne() || referencedDomainClass == null || property.isEmbedded() || property.getType().isEnum()) {

							try {
								//ak je definovany static shortFields v domene
								if(referencedDomainClass.clazz.shortFields){
									asDisplayObject(referenceObject, json, referencedDomainClass.getIdentifier(), referencedDomainClass.clazz.shortFields, referencedDomainClass)
								}else{
									json.convertAnother(referenceObject);
								}
							} catch (Exception e) {
								json.convertAnother(referenceObject);
							}
						}
						else {
							json.value(null);
						}
					}
				}
			}
		}
		writer.endObject();
	}

	protected void asShortObject(Object refObj, JSON json, GrailsDomainClassProperty idProperty, GrailsDomainClass referencedDomainClass) throws ConverterException {

		Object idValue;

		if (proxyHandler instanceof EntityProxyHandler) {
			idValue = ((EntityProxyHandler) proxyHandler).getProxyIdentifier(refObj);
			if (idValue == null) {
				idValue = extractValue(refObj, idProperty);
			}
		}
		else {
			idValue = extractValue(refObj, idProperty);
		}
		JSONWriter writer = json.getWriter();
		writer.object();
		writer.key("class").value(referencedDomainClass.getFullName());
		writer.key("id").value(idValue);
		writer.endObject();
	}

	protected Object extractValue(Object domainObject, GrailsDomainClassProperty property) {
		if(domainObject instanceof GroovyObject) {
			return ((GroovyObject)domainObject).getProperty(property.getName());
		}
		else {
			ClassPropertyFetcher propertyFetcher = ClassPropertyFetcher.forClass(domainObject.getClass());
			return propertyFetcher.getPropertyValue(domainObject, property.getName());
		}
	}

	protected boolean isRenderDomainClassRelations() {
		return false;
	}
}
