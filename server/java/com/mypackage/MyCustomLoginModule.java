package com.mypackage;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpUriRequest;

import com.ibm.json.java.JSONObject;
import com.worklight.adapters.rest.api.AdaptersAPI;
import com.worklight.adapters.rest.api.MFPServerOAuthException;
import com.worklight.server.auth.api.MissingConfigurationOptionException;
import com.worklight.server.auth.api.UserIdentity;
import com.worklight.server.auth.api.WorkLightAuthLoginModule;

public class MyCustomLoginModule implements WorkLightAuthLoginModule, AdaptersAPI {
	private String USERNAME;
	private String PASSWORD;
	
	private static final Logger logger= Logger.getLogger(MyCustomLoginModule.class.getName()); 
	@Override
	public void logout() {
		// TODO Auto-generated method stub
		 USERNAME = null;
		 PASSWORD = null;
		
	}
	@Override
	public void abort() {
		// TODO Auto-generated method stub
		 USERNAME = null;
		 PASSWORD = null;
	}
	@Override
	public void init(Map<String, String> options)
			throws MissingConfigurationOptionException {
		// TODO Auto-generated method stub
		
	}
	@Override
	public UserIdentity createIdentity(String loginModule) {
		HashMap<String, Object> customAttributes = new HashMap<String, Object>();
	    customAttributes.put("AuthenticationDate", new Date());
	     
	    UserIdentity identity = new UserIdentity(loginModule, USERNAME, null, null, customAttributes, PASSWORD);
	    return identity;
	}
	
	public MyCustomLoginModule clone() throws CloneNotSupportedException {
	    return (MyCustomLoginModule) super.clone();
	}
	@Override

	public boolean login(Map<String, Object> authenticationData) {
		System.out.println("MyCustomLoginModule");
	    USERNAME = (String) authenticationData.get("username");
	    PASSWORD = (String) authenticationData.get("password");
	    String params [] = {USERNAME,PASSWORD};
	    System.out.println(params);
	    HttpUriRequest request = createJavascriptAdapterRequest("AuthenticationAdapter","ldap",params);
	    logger.info("-------------------------------------------");
	    logger.info(request.toString());
	    
	    try {
			HttpResponse response = executeAdapterRequest(request);
			logger.info("-------------------------------------------");
			logger.info(response.toString());
		    
		    int status = response.getStatusLine().getStatusCode();
		    
		    if(status != 200){
		    	return false;
		    }else{
		    	return true;
		    }
		    
		} catch (MFPServerOAuthException e) {
			// TODO Auto-generated catch block
			logger.info(e.toString());  
			e.printStackTrace();
			return false;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.info(e.toString()); 
			e.printStackTrace();
			return false;
		}
	    
	    /*if (USERNAME.equals("user") && PASSWORD.equals("password"))
	        return true;
	    else
	        throw new RuntimeException("Invalid credentials");*/
	    //return true;
	}
	
	@Override
	public HttpResponse executeAdapterRequest(HttpUriRequest request)
			throws IOException, MFPServerOAuthException {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public JSONObject getResponseAsJSON(HttpResponse response)
			throws IOException {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public HttpUriRequest createJavascriptAdapterRequest(String adapter,
			String procedure, Object... args) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
