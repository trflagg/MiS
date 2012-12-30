

/**
 * ajaxRequest()
 */
function ajaxRequest(url, type, data, dataType)
{
	if (data)
		data.ajax = true
	
	//default to GET
	type = (typeof type == 'undefined')?"GET":type;
	
	var params = {
		type : type,
		url : url,
		data : data,
		headers :
			{ Accept : "text/xml" },
		dataType : dataType
	};
	
	$.ajax(params)
    .done(function(returnedData, successString, jqXHR) { 
		console.log(successString);
		console.log(jqXHR);
		updatePageUI(returnedData); 
	}).fail(function(jqXHR, textStatus) {
  		$("#content").html( "ajaxRequest failed. " + jqXHR.status + " " + jqXHR.statusText );
	});
}