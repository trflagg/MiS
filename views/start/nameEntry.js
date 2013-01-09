//runs on page load
$("#nameInput").focus();


validateName = function() 
{
	if (event.keyCode==13)
	{
		//enter....
		//validate name
		var name = $('#nameInput').val();
		if (name.length >= 3)
		{
			$("#nameInput").animate({
				backgroundColor:"#000"
			}, 2000, "swing")
			changePage("/start/nameEntry", "POST", {'name':name});
		}
	}
	else
	{
		var name = $('#nameInput').val();
		if (name.length <= 3)
			$("#nameInstructions").fadeOut(2000);
		else
			$("#nameInstructions").fadeIn(2000);
	}
}
