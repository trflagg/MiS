
/**
 * ajaxRequest()
 */
function ajaxRequest(url, type, data, dataType, myCallback)
{
	if (data)
		data.ajax = true
	
	//default to GET
	type = (typeof type == 'undefined')?"GET":type;
	dataType = (typeof dataType == 'undefined')?"html":dataType;
	
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
	
		//run callback or call updatePageUI
		if (myCallback && typeof myCallback == 'function')
		{
			myCallback(returnedData)
		}
		else
		{
			updatePageUI(returnedData); 
		}
		
	}).fail(function(jqXHR, textStatus) {
  		$("#content").html( "ajaxRequest failed. " + jqXHR.status + " " + jqXHR.statusText );
	});
}





/**
 * updatePageUI()
 */
function updatePageUI(returnedData)
{
	//if string, just replace content
	if (typeof returnedData == "string")
	{
		$("#bodyContent").html(returnedData);
	}
	else
	{
		if (returnedData.html)
		{
			$("#content").html(returnedData.html);
		}
		if (returnedData.js)
		{
			console.log(returnedData.js);
			eval(returnedData.js);
		}
		if (returnedData.pageUI)
		{
			console.log(returnedData.pageUI);
			loadPageUI(returnedData.pageUI);
		}
	}
	
	$('input[tabindex="1"]').focus();
	
	
}


/**
 * loadInterface()
 */
function loadPageUI(newPageUI)
{
	pageUI = newPageUI;
	
	setHeader(pageUI.header);
	setLocation(pageUI.locationHeader);
	loadCommands(pageUI.commands);
	$("#bodyContent").html(pageUI.content);
	reloadColors();
}

/**
 * setHeader()
 */
function setHeader(header)
{
	$("#headerText").html(header.text)
}

/**
 * setLocation()
 */
function setLocation(locationInfo)
{
	if('showLabel' in locationInfo)
	{
		if (!locationInfo.showLabel)
		{
			$("p#locationLabel").css("display", "none");
		}
	}
	$("#locationName").html(locationInfo.locationName);
	$("#locationInfo").html(locationInfo.description);
}

/**
 * loadCommands()
 */
function loadCommands(commands) 
{
	for (var command in commands)
	{
		var newLi = $("#commandList").append("<a href='#' onclick='ajaxRequest(\""+commands[command].url+"\");'><li class='commandItem'> "+commands[command].text+"</li></a>");
	}
}


/**
 * reloadColors()
 */
function reloadColors()
{
	$.each(pageUI.colors, function(index, color) {
		setColors(color.value, color.selectors);
	});
}

/**
 * setColors()
 */

function setColors(colorValue, selectorList)
{
	for (var prop in selectorList)
	{
		$(""+prop).css(selectorList[prop], colorValue);
	}
}


/**
 * resizeFrame()
 */

jQuery.event.add(window, "load", resizeFrame);
jQuery.event.add(window, "resize", resizeFrame);

function resizeFrame() 
{
    var h = $(window).height();
    var w = $(window).width();
    $("div#commands").css('height', h - 200);
    //$("div#bodyContent").css('height', h - 250);
}
