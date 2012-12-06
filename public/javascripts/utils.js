

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
	console.log(params);
	
	$.ajax(params)
    .done(function(returnedData) { updatePageUI(returnedData); })
    .fail(function(jqXHR, textStatus) {
  		$("#content").html( "Request failed. " + jqXHR.status + " " + jqXHR.statusText );
	});
}