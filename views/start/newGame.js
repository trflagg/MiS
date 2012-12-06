$("#nameInput").focus();
$("#nameInput").animate({
	backgroundColor:"#999"
}, 2000, "linear");

validateName = function() 
{
	if (event.keyCode==13)
	{
		//enter....
		alert("Hello");
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