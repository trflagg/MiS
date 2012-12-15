


/**
 * updatePageUI()
 */
function updatePageUI(newPageData)
{
	//if string, just replace content
	if (typeof newPageData == "string")
	{
		pageUI.content = newPageData;
		$("#bodyContent").html(newPageData);
	}
	
	reloadColors();
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
    $("div#bodyContent").css('height', h - 250);
}