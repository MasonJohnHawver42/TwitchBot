const tmi = require('tmi.js');

// Define configuration options
const opts = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
        secure: true
    },
  identity: {
    username: "your-username",
    password: 'oauth:your-key'
  },
  channels: [
    'test_channel'
  ]
};

// Create a client with our options
var client = new tmi.client(opts);

// Connect to Twitch:
client.connect();



//client.addListener('join', onJoin);
//addListener('chat', chatHandler);

// Register our event handlers (defined below)
client.on('chat', chatHandler);
client.on('join', onJoin);

var valid_commands = ["!test", "!math", "!help"];

var documentation = {
  test : "Call This command to determine wether the bot is working",
  math : "Call This command to do math. Valid math is only numbers and the operators(*, +, -, /) also spaces are fine, anything else will return nothing. (Dosen't use PEMDAS yet...)",
  help : "This"
}


// Called every time a message comes in
function chatHandler (channel, userstate, message, self) {

  if(message == "!test")
  {
    client.say(channel, "Comand worked! " + userstate.username  + " PogChamp !!!!");
  }

  if(message.substring(0, 5) == "!math")
  {
    var euqation = toEquation(message.substring(5));
    var answer = doMath(euqation);
    var response = userstate.username + " your Answer is: " + answer;
    if (!answer)
    {
      response =  userstate.username + " either I cant do that math, or thats just not math. To see whats valid type !help !math."
    }
    client.say(channel, response);

  }

  if(message.substring(0, 5) == "!help")
  {
    if(message.trim().length == 5)
    {
      client.say(channel, userstate.username + " the valid commands are: " + valid_commands.join(", ") + ". To see the documentation for these commands type !help [valid command]");
    }
    else{
      var command = message.substring(5).trim();
      if(valid_commands.includes(command))
      {
        client.say(channel, userstate.username + ": " + documentation[command.substring(1)]);
      }
      else
      {
        client.say(channel, userstate.username + " Thats not a valid command!!!")
      }
    }
  }


}

function onJoin (chanel, username, self)
{
  if(self)
  {
    client.say(chanel, "Bot[" + username + '] Joined! To start using me enter in command !help');
  }
}


// math stuff


function doMath(euqation)
{
  if(euqation.operator == null && euqation.side_2 == null)
  {
    if(!isNaN(euqation.side_1.trim()))
    {
      return parseFloat(euqation.side_1);
    }

    else
    {
      return false;
    }
  }
  else
  {
    var sides = [euqation.side_1, euqation.side_2];
    var euqations = new Array(2);
    for(var i = 0; i < 2; i++)
    {
      euqations[i] = toEquation(sides[i]);
    }
    var num1 = doMath(euqations[0]);
    var num2 = doMath(euqations[1]);

    if (num1, num2)
    {
      return doOperator(num1, num2, euqation.operator);
    }
    else
    {
      return false;
    }

  }
}

function doOperator(num1, num2, operator)
{
  switch(operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
    default:
      return false;
  }
}

function toEquation(equ_string)
{
    var result = equ_string.match(/[/*+-]/i);
    if(result != null)
    {
      var side1 = equ_string.substring(0, result.index);
      var side2 = equ_string.substring(result.index + 1);
      var new_operator = result[0];
    }
    else
    {
      var side1 = equ_string;
      var side2 = null;
      var operator = null;
    }

    return {
      side_1: side1,
      operator: new_operator,
      side_2: side2
    };
}
