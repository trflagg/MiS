$("#nameInput").focus();
$("#nameInput").animate({
	backgroundColor:"#999"
}, 2000, "linear");

validateName = function() 
{
	if (event.keyCode==13)
	{
		//enter....
		//validate name
		var name = $('#nameInput').val();
		if (name.length >= 3)
			changePage("/start/nameEntry", "POST", {'name':name});
	}
	else
	{
		var name = $('#nameInput').val();
		if (name.length < 3)
			$("#nameInstructions").fadeOut('slow');
		else
			$("#nameInstructions").fadeIn('slow');
	}
}

onPageOut = function()
{
	$("#nameInput").animate({
		backgroundColor:"#111"
	}, 3000, "linear");
	
}