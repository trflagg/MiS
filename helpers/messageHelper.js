module.exports = function (service) {
	helper = {}
	
	processMessageFunction = function(ship, text, updateObject)
	{
		//check function 
		
	}
	
	
	helper.runMessage = function(ship, message) {
		var text = "";
		var inBrackets = false;
		var bracketText = "";
		var updateObject = {};
		
		//loop through every character
		for (i in message)
		{
			var c = message[i];
			if (inBrackets)
			{
				if(c == ']')
				{
					inBrackets = false;
					processMessageFunction(ship, bracketText, updateObject);
				}
			}
			else
			{
				if(c == '[')
				{
					inBrackets = true;
					bracketText = "";
				}
				else
					text = text.concat(c);
			}
		}
		ship.lastMessageText = text;
		return ship;
	};
	
	
	return helper
}