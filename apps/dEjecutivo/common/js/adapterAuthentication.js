/**
 * 
 */

var AuthRealmChallengeHandler = WL.Client.createChallengeHandler("AuthRealm");

AuthRealmChallengeHandler.isCustomResponse = function(response) {
    if (!response || !response.responseJSON || response.responseText === null) {
        //return false;
    	return false;
    }
    if (typeof(response.responseJSON.authRequired) !== 'undefined'){
       // return true;
    	return true;
    } else {
        //return false;
    	return false;
    }
};

AuthRealmChallengeHandler.handleChallenge = function(response){
    var authRequired = response.responseJSON.authRequired;
 
    if (authRequired){
        $("#AppDiv").hide();
        $("#AuthDiv").show();
        $("#AuthPassword").empty();
        $("#AuthInfo").empty();
 
        if (response.responseJSON.errorMessage)
            $("#AuthInfo").html(response.responseJSON.errorMessage);
         
    } else{
        $("#AppDiv").show();
        $("#AuthDiv").hide();
        AuthRealmChallengeHandler.submitSuccess();
    }
};

$("#AuthSubmitButton").bind('click', function () {
    var username = $("#AuthUsername").val();
    var password = $("#AuthPassword").val();
    alert("Button has been clicked. User:"+ username);
    
    var invocationData = {
        adapter : "AuthenticationAdapter",
        procedure : "submitAuthentication",
        parameters : [username, password]
    };
   // alert("Antes de connect");
    //var returnvalue= WL.Client.invokeProcedure(invocationData,{});
    AuthRealmChallengeHandler.submitAdapterAuthentication(invocationData, {});
    //alert("Fin de funcion");
});