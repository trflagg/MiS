

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
  		$("#content").html( "Request failed: " + textStatus );
	});
}


/**
 * updatePageUI()
 */
function updatePageUI(newPageData)
{
	//if string, just replace content
	if (typeof newPageData == "string")
	{
		pageUI.content = newPageData;
		$("#content").html(newPageData);
	}
	
	reloadColors();
}

/**
 * defaultInterface
 */
var defaultPageUI = {
	header : {
		text : "Make it So",
	},
	locationHeader : {
		locationName : "Editor",
		description : "I Have The Power!!!"
	},
	commands : [
		{
			text: 'Location',
			url: '/editor/location',
		},
		{
			text: 'Direct Message',
			url: '/editor/directmessage',
			subcommands: [
			{
				text: 'New',
				url: '/editor/directmessage/new/',
			}]
		}
	],
	content : "<h2>Editor</h2>",
	colors : [
		{
			value : "#999",
			selectors : {
				"body" : "color",
				"a" : "color",
				":input" : "color",
				"textarea" : "color",
				"ul#commandList" : "color",
				"ul#commandList" : "border-color",
				"div.locationHeader p" : "color",
				".locationHeader" : "border-color",
				":input" : "border-color",
				"textarea" : "border-color",
				"ul#commandList a" : "color",
				"ul#commandList li" : "border-color",
				".header" : "color",
			}
		},
		{
			
			value : "#111",
			selectors : {
				":input" : "background",
				"textarea" : "background",
				".locationHeader" : "background",
				"ul#commandList" : "background",
			}
		}
	]
}
		
/**
 * $(function()
 */
$(function() {
	loadPageUI(defaultPageUI);
})

/**
 * loadInterface()
 */
function loadPageUI(newPageUI)
{
	pageUI = newPageUI;
	
	setHeader(pageUI.header.text);
	setLocation(pageUI.locationHeader);
	loadCommands(pageUI.commands);
	$("#content").html(pageUI.content);
	reloadColors();
}

/**
 * setHeader()
 */
function setHeader(headerText)
{
	$("#headerText").html(headerText)
}

/**
 * setLocation()
 */
function setLocation(locationInfo)
{
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
		var newLi = $("#commandList").append("<li><a href='#' onclick='ajaxRequest(\""+commands[command].url+"\");'> &laquo;"+commands[command].text+"</a></li>");
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
    $("div#content").css('height', h - 250);
}