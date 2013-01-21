
var swig = require('swig'),
	fs = require('fs');

/**
 * sendHTMLAndJS()
*/
module.exports.sendHTMLAndJS = function (viewPath, res, pageObj) {
	try {
		pageObj = pageObj || {};
		locals = pageObj.locals || {};
		
		console.log("rendering viewPath: "+viewPath)
		var responseObject = {};
		
		//render w/ swig
		var templ = swig.compileFile(viewPath+'.html');
		responseObject.html = templ.render(locals);
		
		//check for pageUI
		if (pageObj.pageUI) responseObject.pageUI = pageObj.pageUI;
		
		//check for javascript
		var jsViewPath = './views/'+viewPath+'.js';
		fs.exists(jsViewPath, function(exists) {
			if (exists)
			{
				//read javascript in
				fs.readFile(jsViewPath, 'utf8', function (err,js) {
					if (err) {
						console.log(err);
						res.send(err);
					}	
					responseObject.js = js;
					
					//send it out
					res.send(responseObject);
				});
			}
			else
			{
				//send it out
				res.send(responseObject);
			}
		});
	}
	catch (e)
	{
		console.log("ERROR: "+ e);
		res.send(500, e);
	}
}
	