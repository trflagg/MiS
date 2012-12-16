//runs on page load
$("#nameInput").focus();
$("body").animate({
	backgroundColor:"#999"
}, 2000, "linear");
$("#nameInput").animate({
	backgroundColor:"#999"
}, 2000, "linear");

var curPage = "ship";
$("#crewDiv").css("display","none");

validateName = function() 
{
	if (event.keyCode==13)
	{
		//enter....
		//check page
		if (curPage == "ship")
		{
			//validate data
			var shipName = $('#nameInput').val();
			if (shipName.length >= 3)
			{
				//show crew name
				$("#shipNameDiv").fadeOut('2000', function() {
					$("#crewDiv").fadeIn('2000');
					curPage = "crew"
					$("input.crewInput:first").focus();
				});
			}
				
		}
		else if (curPage == "crew")
		{
			//validate data
			var security = $('#security').val();
			var medical = $('#medical').val();
			var info = $('#info').val();
			var empat = $('#empat').val();
			var engineering = $('#engineering').val();
			var cultural = $('#cultural').val();
			if (security.length >= 3 &&
				medical.length >= 3 &&
				info.length >= 3 &&
				empat.length >= 3 &&
				engineering.length >= 3 &&
				cultural.length >= 3)
			{
				//send data
				changePage("/start/newShip", "POST", {
					shipName : shipName,
					security : security,
					medical : medical,
					info : info,
					empat : empat,
					engineering : engineering,
					cultural : cultural
				});
			}
		}
	}
	else
	{
		var shipName = $('#nameInput').val();
		if (shipName.length <= 3)
			$("#nameInstructions").fadeOut('slow');
		else
			$("#nameInstructions").fadeIn('slow');
	}
}
