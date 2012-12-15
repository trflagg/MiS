//runs on page load
$("#nameInput").focus();
$("body").animate({
	backgroundColor:"#999"
}, 2000, "linear");
$("#nameInput").animate({
	backgroundColor:"#999"
}, 2000, "linear");

/*
onPageOut = function()
{
	$("#nameInput").animate({
		backgroundColor:"#111"
		}, 3000, "linear");
}
*/

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
