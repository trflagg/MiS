
//from http://stackoverflow.com/questions/3514784/best-way-to-detect-handheld-device-in-jquery
isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent)

/**
 * ajaxRequest()
 */
function ajaxRequest(url, type, data, dataType, myCallback)
{
	if (url == "")
		return;
		
	if (data)
		data.ajax = true;
	
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
	
		if (myCallback && typeof myCallback == 'function')
		{
			myCallback(returnedData)
		}
		else
		{
			updatePageUI(returnedData); 
		}
		
	}).fail(function(jqXHR, textStatus) {
  		$("#content").html( "ajaxRequest failed. " + jqXHR.status + " " + jqXHR.statusText + " "+ jqXHR.responseText);
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
	
	//$('input[tabindex="1"]').focus();
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
	for (var i = 0, ll = commands.length; i<ll; i++)
	{
		var command = commands[i];
		
		if (command.url) {
			$("<a href='#' onclick='ajaxRequest(\""+commands[i].url+"\");'><li class='commandItem supercommand'> "+commands[i].text+"</li></a>")
			.appendTo("#commandList");
		}
		else if (command.subcommands) {
			var $superCommand = $("<a href='#' id='command"+i+"' onclick='showSubcommands(\""+i+"\");'><li class='commandItem supercommand'> "+commands[i].text+"</li></a>")
								.appendTo("#commandList");
			var $subcommandList = $("<ul id='subcommandList"+i+"' class='subcommandList'>");
			var subcommands = command.subcommands;
			for (var j=0, ll2 = subcommands.length; j<ll2; j++)
			{
				$subcommandList.append("<a href='#' id='subcommand"+i+j+"' onclick='ajaxRequest(\""+subcommands[j].url+"\");'><li class='commandItem'> "+subcommands[j].text+"</li></a>");
			}
			
			$superCommand.append($subcommandList);
				
		}
		else {
			console.log("Error in loadCommands. command["+i+"] does not have url or subcommands.");
			console.log(commands);
		}
	}
}

function showSubcommands(index)
{
	$(".supercommand").parent().toggle();
	// REALLY BAD HARDCODING
	// TODO: FIX HARDCODED COLOR
	$("#command"+index).toggle();
	$("#command"+index+":first-child").addClass('buttonSelected').css("color","#999");
	$("#subcommandList"+index).toggle();
	
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
 * startChangePage
 */
function startChangePage(url, method, data, goAway) 
{
	if (!goAway) goAway = false;
	
	//load URL
	ajaxRequest(url, method, data, "json", function(returnedData) {
		if (goAway)
		{
			var windowHeight = $(window).height();
			
			//turn off scroll
			
			//move down
			$currentDiv.css('transform', $currentDiv.css('transform') + ' translateY('+windowHeight+'px)');
			
			$("#starBackground").css('transform',$("#starBackground").css('transform') + ' translateY('+windowHeight*(1/3)+'px)');
			//$("#starBackground").css('height', $("#starBackground").height() + windowHeight*(2/3));
			$("#starMidfield").css('transform',$("#starMidfield").css('transform') + ' translateY('+windowHeight*(1/2)+'px)');
			//$("#starMidfield").css('height', $("#starMidfield").height() + windowHeight);
			$("#starForward").css('transform',$("#starForward").css('transform') + ' translateY('+windowHeight*(2/3)+'px)');
			//$("#starForward").css('height', $("#starForward").height() + windowHeight*2);

			$("#content").delay(200).fadeOut("1200", 'linear', function() {
				updatePageUI(returnedData); 
				$(this).fadeIn("slow","linear")
			});
		}
		else
		{
			var windowWidth = $(window).width();
			
			// titleScreen is different from the others since it starts at left:0, no transform
			// the other screen divs start at left:windowWidth, transform: -windowWidth 
			// so set them double to go offscreen
			if ($currentDiv.selector == "#titleScreen")
			{
				var translateSize = windowWidth;
			}
			else
			{
				var translateSize = windowWidth*2;
			}
			$currentDiv.css('transform','translateX(-'+translateSize+'px)');
			
			// move in the new screen
			divCount++;
			var jq = $("<div id='div"+divCount+"' class='startScreen'>"+returnedData.html+"</div>").appendTo("#screenDivs");
			$currentDiv = $("#div"+divCount)
			.css('position', 'absolute')
			.css('width', '100%')
			.css('top', '0px')
			.css('left', windowWidth+"px")
			.show();
			
			$currentDiv.css('transform','translateX(-'+windowWidth+'px)');
			
			var starWidth = (windowWidth * (2/3));
			
			// width screws up in firefox, so I'm yanking it
			// unfortunately this means no parallax stars in ff :(
			//if (!($.browser.mozilla))
			{
				var newWidth = $(".stars").width() + starWidth;
				//$(".stars").css('width', newWidth);
				$("#starBackground").css('transform','translateX(-'+(starWidth/3)*divCount+'px)');
				$("#starBackground").css('width', $("#starBackground").width() + (starWidth/3));
				$("#starMidfield").css('transform','translateX(-'+(starWidth/2)*divCount+'px)');
				$("#starMidfield").css('width', $("#starMidfield").width() + (starWidth/2));
				$("#starForward").css('transform','translateX(-'+(starWidth)*divCount+'px)');
				$("#starForward").css('width', $("#starForward").width() + starWidth);
			}
			
			//wait for animation to end before running js
			setTimeout(function() {
				if (typeof returnedData.js !== undefined)
				{
					eval(returnedData.js);
				}
			}, 2000);
			
		}
	});
}