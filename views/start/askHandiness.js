handiButtonClicked = function(handiness)
{
	startChangePage("/start/askHandiness", "POST", {handiness : handiness});
}