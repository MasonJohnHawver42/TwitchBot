var mysql = require('mysql');
var fs = require('fs');

var contents = fs.readFileSync("mysqlBots//sqlLogin.json");
var login = JSON.parse(contents);

var con = mysql.createConnection(login);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


function addBot(name, uaoth)
{
	var cmd = "insert into bots(name, uaoth) values('" + name + "', '" + uaoth + "');";

	con.querry(cmd, function(err, result)
	{
		if (err) throw err;
	})
}

function banBot(bot_id, channel_id)
{
	var cmd = "insert into botBans(bot_id, channel_id) values(" + bot_id.toString() + ", " + channel_id.toString() + ");";

	con.querry(cmd, function (err, result)
	{
		if (err) throw err;
	});
}

function getBotName(bot_id, callback)
{
	var cmd = "select name from bots where id=" + bot_id.toString() + ";";

	con.query(cmd, function (err, result) 
	{
		if (err) throw err;
	});
}




function getBots(channel_id, callback)
{
	var cmd = "select id from bots";
	
	con.query(cmd, function (err, result)
		{

			var bots = result;

			for(var i = 0; i < bots.length; i++)
			{
				bots[i] = bots[i]["id"];
			}

			cmd = "select distinct bot_id from botBans where channel_id='" + channel_id + "';";

			con.query(cmd, function (err, result)
			{
				for(i = 0; i < result.length; i++)
				{
					var bot_id = result[i]["bot_id"];
					var index = bots.indexOf(bot_id);
					bots.splice(index, bot_id);
				}

				callback(bots);
			})
		});
}