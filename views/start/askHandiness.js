handiButtonClicked = function(handiness)
{
	changePage("/start/askHandiness", "POST", {handiness : handiness});
}