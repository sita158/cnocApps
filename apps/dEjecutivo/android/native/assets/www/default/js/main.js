
/* JavaScript content from js/main.js in folder common */
function wlCommonInit(){
	/*
	 * Use of WL.Client.connect() API before any connectivity to a MobileFirst Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the MobileFirst Server.
	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */
	
	// Common initialization code goes here

	/*var RealmChallengeHandler = WL.Client.createChallengeHandler("CustomAuthenticatorRealm");
	WL.Logger.info("RealmChallengeHandler");
	WL.Logger.info(RealmChallengeHandler);
	
		$('#loginButton').bind('click', function () {
			
			WL.Logger.info($('#usernameInputField').val());
			WL.Logger.info($('#passwordInputField').val());
			
	    var reqURL = '/j_security_check';
	    var options = {};
	    options.parameters = {
	            j_username : $('#usernameInputField').val().trim(),
	            j_password : $('#passwordInputField').val().trim()
	    };
	    options.headers = {};
	    RealmChallengeHandler.submitLoginForm(reqURL, options, RealmChallengeHandler.submitLoginFormCallback);

	});
		
		RealmChallengeHandler.isCustomResponse = function(response) {
	        if (!response || !response.responseJSON) {
	            return false;
	        }
	         
	        if(response.responseJSON.authStatus){
	        	return true;
	        }else{
	        	return false;
	        }

	        
	     
	    };*/
	
	/*busyIndicator = new WL.BusyIndicator();
	callHeaderData("ms_te_incidents_agrupado","columns", "status");
	callHeaderData("ms_te_incidents_agrupado","columns", "failure_type");
	callHeaderData("ms_te_incidents_companies","companies", "companies");
	callHeaderData("ms_te_incidents_agrupado","columns", "center,status");
	callHeaderData("ms_te_incidents_agrupado","columns", "proactivity");*/
}

function callHeaderData(ms, columns, valueColumn){
	
	/*
	 * The REST API works with all adapters and external resources, and is supported on the following hybrid environments: 
	 * iOS, Android, Windows Phone 8, Windows 8. 
	 * If your application supports other hybrid environments, see the tutorial for MobileFirst 6.3.
	 */
	var resourceRequest = new WLResourceRequest("/adapters/getDataCmdb/getDataCMDB", WLResourceRequest.GET);
	resourceRequest.setQueryParameter("params", [{"ms":ms, "columns":columns, "valueColumn":valueColumn}]);
	
	if(valueColumn==="status"){
		resourceRequest.send().then(successStatus,failure);
	}else if(valueColumn==="failure_type"){
		resourceRequest.send().then(successFm,failure);
	}else if(valueColumn==="companies"){
		resourceRequest.send().then(successCompanies,failure);
	}else if(valueColumn==="center,status"){
		resourceRequest.send().then(successCenters,failure);
	}else if(valueColumn==="proactivity"){
		resourceRequest.send().then(successProactivity,failure);
	}	
}

function successStatus(result){
	WL.Logger.debug("Adapter retrieve success Status");
	responseJson = JSON.parse(result.responseText);
		
	var total = 0;
	$.each( responseJson.records.record, function( key, value ) {		
		try{
			if(value.status === "Open"){
				total += parseInt(value.value);
				$("#countOpen").text(value.value);
			}else if(value.status === "Closed"){
				total += parseInt(value.value);
				$("#countClosed").text(value.value);
			}

		}catch(e){}
					
	});
	$("#countTotal").text(total);
}

function successFm(result){
	WL.Logger.debug("Adapter retrieve success FM");
	responseJson = JSON.parse(result.responseText);
	$.each( responseJson.records.record, function( key, value ) {		
		
		try{
			if(value.failure_type === "MASSIVE FAILURE"){
				$("#countMF").text(value.value);
			}
		}catch(e){}
					
	});
}

function successCompanies(result){
	WL.Logger.debug("Adapter retrieve success Companies");
	responseJson = JSON.parse(result.responseText);
	$("#countCompanies").text(responseJson.records.record.length);
}

function successCenters(result){
	WL.Logger.debug("Adapter retrieve success Centers");
	responseJson = JSON.parse(result.responseText);
	WL.Logger.debug(responseJson.records.record);
	
	var categories = [];
	var open = [];
	var closed = [];
	$.each( responseJson.records.record, function( key, value ) {
		WL.Logger.debug(key + "-" +value.center);					
		categories.push(value.center);		
	});	
	categories = categories.unique();
	
	$.each( categories, function( keyC, valueC ) {
		var openF = false;
		var closedF = false;
		$.each( responseJson.records.record, function( keyD, valueD ) {
			WL.Logger.debug(keyD + "-" +valueD.center);
			if(valueC === valueD.center && valueD.status === "Open"){
				open.push(parseInt(valueD.value));
				openF = true;
			}else if(valueC === valueD.center && valueD.status === "Closed"){
				closed.push(parseInt(valueD.value));
				closedF = true;
			}		
		});
		if(!openF){
			open.push(0);
		}else if(!closedF){
			closed.push(0);
		}
		
	});
	
	var series = [{name:"Open", data:open},{name:"Closed", data:closed}];
	
	WL.Logger.debug(categories);
	WL.Logger.debug(open);
	WL.Logger.debug(closed);
	
	WL.Logger.debug(series);
	
	$('#centerChart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        tooltip: {
			shared: true,
			enabled: true
		},
		credits: {
			enabled: false
		},
        series: series
    });
	
}

function successProactivity(result){
	WL.Logger.debug("Adapter retrieve success Status");
	responseJson = JSON.parse(result.responseText);
	WL.Logger.debug(responseJson.records.record);		
	
	var series = [];
	/*
	$.each( responseJson.records.record, function( key, valueName ) {
		WL.Logger.debug(key +" - "+value);
		series.push({
			name : valueName,
			data : data
		});
	});*/
	
}

	Array.prototype.unique = function(a){
	  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
	});

function failure(result){
	WL.Logger.debug("Adapter retrieve failure");
	WL.Logger.debug(result);
}
/* JavaScript content from js/main.js in folder android */
// This method is invoked after loading the main HTML and successful initialization of the IBM MobileFirst Platform runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}