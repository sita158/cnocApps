package com.mypackage;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


//import com.worklight.extension.api.Messages.logger;
import com.worklight.server.auth.api.AuthenticationResult;
import com.worklight.server.auth.api.AuthenticationStatus;
import com.worklight.server.auth.api.MissingConfigurationOptionException;
import com.worklight.server.auth.api.UserIdentity;
import com.worklight.server.auth.api.WorkLightAuthenticator;


public class MyCustomAuthenticator implements WorkLightAuthenticator{
	private String username;
	private String password;
	private static final Logger logger= Logger.getLogger(MyCustomAuthenticator.class.getName()); 
	

	@Override
	public void init(Map<String, String> options) throws MissingConfigurationOptionException {
		// TODO Auto-generated method stub
		logger.info("MyCustomAuthenticator initialized");
	}
	@Override
	public WorkLightAuthenticator clone() throws CloneNotSupportedException {
	    MyCustomAuthenticator otherAuthenticator = (MyCustomAuthenticator) super.clone();
	    return otherAuthenticator;
	}
	@Override
	public AuthenticationResult processRequest(HttpServletRequest request, HttpServletResponse response, boolean isAccessToProtectedResource) throws IOException,   ServletException {
	    if (request.getRequestURI().contains("j_security_check")){
	        String username = request.getParameter("username");
	        String password = request.getParameter("password");
	        logger.info("MyCustomAuthenticator");
	        logger.info(username);
	        logger.info(password);
	        if (null != username && null != password && username.length() > 0 && password.length() > 0){
	            this.username = request.getParameter("username");
	        this.password = request.getParameter("password");
	            return AuthenticationResult.createFrom(AuthenticationStatus.SUCCESS);
	        } else {
	            response.setContentType("application/json; charset=UTF-8");
	            response.setHeader("Cache-Control", "no-cache, must-revalidate");
	            response.getWriter().print("{\"authStatus\":\"required\", \"errorMessage\":\"Please enter username and password\"}");
	            return AuthenticationResult.createFrom(AuthenticationStatus.CLIENT_INTERACTION_REQUIRED);
	        }
	    }
	     
	    if (!isAccessToProtectedResource)
	        return AuthenticationResult.createFrom(AuthenticationStatus.REQUEST_NOT_RECOGNIZED);
	     
	    response.setContentType("application/json; charset=UTF-8");
	    response.setHeader("Cache-Control", "no-cache, must-revalidate");
	    response.getWriter().print("{\"authStatus\":\"required\"}");
	    return AuthenticationResult.createFrom(AuthenticationStatus.CLIENT_INTERACTION_REQUIRED);
	}
	@Override
	public Map<String, Object> getAuthenticationData() {
	    logger.info("getAuthenticationData");
	    Map<String, Object> authenticationData = new HashMap<String, Object>();
	    authenticationData.put("username", username);
	    authenticationData.put("password", password);
	    return authenticationData;
	}
	@Override
	public boolean changeResponseOnSuccess(HttpServletRequest request, HttpServletResponse response) throws IOException {
	    if (request.getRequestURI().contains("j_security_check")){
	        response.setContentType("application/json; charset=UTF-8");
	        response.setHeader("Cache-Control", "no-cache, must-revalidate");
	        response.getWriter().print("{\"authStatus\":\"complete\"}");
	        return true;
	    }
	    return false;
	}
	@Override
	public AuthenticationResult processRequestAlreadyAuthenticated(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
	    return AuthenticationResult.createFrom(AuthenticationStatus.REQUEST_NOT_RECOGNIZED);
	}
	@Override
	public AuthenticationResult processAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
	        String errorMessage) throws IOException, ServletException {
	 
	    response.setContentType("application/json; charset=UTF-8");
	    response.setHeader("Cache-Control", "no-cache, must-revalidate");
	    response.getWriter().print("{\"authStatus\":\"required\", \"errorMessage\":\"" + errorMessage + "\"}");
	    return AuthenticationResult.createFrom(AuthenticationStatus.CLIENT_INTERACTION_REQUIRED);
	}
	@Override
	@Deprecated
	public
	HttpServletRequest getRequestToProceed(HttpServletRequest currentRequest,
			HttpServletResponse currentResponse, UserIdentity user)
			throws IOException {
		// TODO Auto-generated method stub
		return null;
	}
	
}
