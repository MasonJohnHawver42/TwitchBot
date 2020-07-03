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
    'test_channels'
  ]
};

// Create a client with our options
var client = new tmi.client(opts);

// Connect to Twitch:
client.connect();

// Register our event handlers (defined below)
client.on('chat', chatHandler);
client.on('join', onJoin);

var valid_commands = ["!test", "!help"];

var documentation = {
  test : "Call This command to determine wether the bot is working",
  help : "This"
}


// Called every time a message comes in
function chatHandler (channel, userstate, message, self) {
  
  if(message == "!test")
  {
    client.say(channel, "Comand worked! " + userstate.username  + " PogChamp !!!!");
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