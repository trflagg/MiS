
//from http://stackoverflow.com/questions/3514784/best-way-to-detect-handheld-device-in-jquery
isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent)

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
			//move down
			$currentDiv.animate({top: '-'+windowHeight+'px'}, 2000, 'swing')
			


			$('#starMidfield').animate({
				'backgroundPosition-y': '+='+windowHeight+'px',
			}, 3000, 'linear');
				
			$('#starForward').animate({
				'backgroundPosition-y': '+='+windowHeight*2+'px',
			}, 3000, 'linear');
			
			$('#starBackground').animate({
				'backgroundPosition-y': '+='+windowHeight*2/3+'px',
			}, 3000, 'linear');
			
			$("#content").delay(1000).fadeOut("1000", 'linear', function() {
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
			//move in the new
			divCount++;
			var jq = $("<div id='div"+divCount+"' class='startScreen'>"+returnedData.html+"</div>").appendTo("#screenDivs");
			$currentDiv = $("#div"+divCount)
			.css('position', 'absolute')
			.css('width', '100%')
			.css('top', '0px')
			.css('left', windowWidth+"px")
			.show();
			
			$currentDiv.css('transform','translateX(-'+windowWidth+'px)');
			
			var starWidth = (windowWidth * (2/3)) * divCount;
			
			//width screws up in firefox, so I'm yanking it
			//unfortunately this means no parallax stars in ff :(
			if (!($.browser.mozilla))
			{
				var newWidth = $(".stars").width() + starWidth;
				//$(".stars").css('width', newWidth);
				$("#starBackground").css('transform','translateX(-'+(starWidth/3)+'px)');
				$("#starBackground").css('width', $("#starBackground").width() + (starWidth/3));
				$("#starMidfield").css('transform','translateX(-'+(starWidth/2)+'px)');
				$("#starMidfield").css('width', $("#starMidfield").width() + (starWidth/2));
				$("#starForward").css('transform','translateX(-'+(starWidth)+'px)');
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