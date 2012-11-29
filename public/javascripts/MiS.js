
function loadCommands(commands) 
{
	for (var command in commands)
	{
		var newLi = $("#commandList").append("<li><a href="+commands[command].url+"> &laquo;"+commands[command].text+"</a></li>");
	}
}

var lightColored = {
	"body" : "color",
	"a" : "color",
	":input" : "color",
	"textarea" : "color",
	".header" : "color",
	".header a" : "color",
	"ul#commandList" : "color",
	"ul#commandList" : "border-color",
	"div.locationHeader p" : "color",
	"ul#commandList a" : "color",
	".locationHeader" : "border-color",
	":input" : "border-color",
	"textarea" : "border-color",
}

var darkColored = {
	":input" : "background",
	"textarea" : "background",
	".locationHeader" : "background",
	"ul#commandList" : "background",
}
	

function ajaxRequest(type, url, data, dataType, callback)
{
	if (data)
		data.ajax = true
	
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
    .done(function() { alert("success"); })
    .fail(function(jqXHR, textStatus) {
  		alert( "Request failed: " + textStatus );
	})
    .always(function() { alert("complete"); });
}
	
function setColors(lightColor, darkColor)
{
	for (var prop in lightColored)
	{
		$(""+prop).css(lightColored[prop], lightColor);
	}
	
	
	for (var prop in darkColored)
	{
		$(""+prop).css(darkColored[prop], darkColor);
	}
	
}
	

$(function() {
	loadCommands([
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
	}]);
	
	setColors("#999", "#111");
});


jQuery.event.add(window, "load", resizeFrame);
jQuery.event.add(window, "resize", resizeFrame);

function resizeFrame() 
{
    var h = $(window).height();
    var w = $(window).width();
    $("div#commands").css('height', h - 200);
    $("div#content").css('height', h - 250);
}
