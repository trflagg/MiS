if (!isMobile)
{
	$("#nameInput").focus();
}


validateName = function(event) 
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
			startChangePage("/start/nameEntry", "POST", {'name':name});
		}
		else
		{
			$("#nameError").html("Name must be at least 3 characters");
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