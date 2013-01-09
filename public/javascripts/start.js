		var nextURL = "#{nextURL}" || ""
		$(function() {
			$("body").bind("click touch", function() {
				$("body").unbind("click");
				if (nextURL != "")
					changePage(nextURL);
			});
			
			//animate stars
			var animateStars = false
			$('#starMidfield').css({backgroundPosition: '0px 0px'});
			$('#starForward').css({backgroundPosition: '0px 0px'});
			$('#starBackground').css({backgroundPosition: '0px 0px'});
			if (animateStars)
			{
				
				$('#starMidfield').animate({
					'backgroundPosition-x': '00000px',
					'backgroundPosition-y': '10000px',
				}, 240000, 'linear');
				
				$('#starForward').animate({
					'backgroundPosition-x': '00000px',
					'backgroundPosition-y': '10000px',
				}, 120000, 'linear');
				
				$('#starBackground').animate({
					'backgroundPosition-x': '00000px',
					'backgroundPosition-y': '10000px',
				}, 480000, 'linear');
			}
			
			//fade in grey text.
			$("#titleScreen").animate({
					color:"#999"
				}, 2000, "linear", function() {
					//wait a couple of seconds
					//then fade in click prompt
					window.setTimeout( function() {
						$(".prompt").fadeIn("slow");
					}, 1000);

					//load nextPage automatically?
					//if (nextURL != "")
					//	changePage(nextURL);
				});
		});
		
		function changePage(url, method, data) 
		{
			
			//load URL
			ajaxRequest(url, method, data, "json", function(returnedData) {
				console.log(returnedData);
				console.log(returnedData.html);
				$("#divTwo").html(returnedData.html);
				$('#divTwo').animate({left: '0px'}, 2000, 'swing');
				$('#titleScreen').animate({left: '-1000px'}, 2000, 'swing');

				$('#starMidfield').css({backgroundPosition: '0px 0px'});
				$('#starForward').css({backgroundPosition: '0px 0px'});
				$('#starBackground').css({backgroundPosition: '0px 0px'});
				
				$('#starMidfield').animate({
					'backgroundPosition-x': '-1000px',
				}, 2500, 'swing');
					
				$('#starForward').animate({
					'backgroundPosition-x': '-2000px',
				}, 2500, 'swing');
					
				$('#starBackground').animate({
					'backgroundPosition-x': '-500px',
				}, 2500, 'swing');
			});
		}