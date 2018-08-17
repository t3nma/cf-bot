# cf-bot

cf-bot is a Discord bot that interacts with the codeforces API. It provides
simple yet useful commands to give you and your teammates information without
needing to leave the lobby. 

## Commands

#### Help:

+ `!help` - List every available command
+ `!help [command]` - List information on a specific command

#### User:

+ `!user [handles]` - List information on the specified users (3 at maximum)

#### Contest:

+ `!contest` - List every upcoming contest
+ `!contest [div_number]` - List every upcoming contest for a specific division

#### Problem:

+ `!problem` - Selects a random problem
+ `!problem [tags]` - Selects a random problem with given tags
  + [list of tags](http://codeforces.com/blog/entry/14565)
  + multi-word tags must use underscore (_) as separator

#### Solution:

+ `!solution problem_name` - bot will shame you by solving the problem you're
stuck at while in-contest

## Setup

Before anything, follow [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) and save the **token** for later use.

+ Install Node.js ( version >= v8.11.3)
+ Download cf-bot `git clone https://github.com/brunoccast/cf-bot.git`
+ `cd` to cf-bot and run `npm install`
+ Edit the file `config.json` and use your previously generated token in the
correct configuration spot: `"token": "paste_your_token_here"`. You can also
change the `prefix` configuration to whatever prefix you want to use for the
commands.
+ Run `npm run build && node .`, your bot should now be online and ready to use!

## Updating

Just run `git pull && npm install && npm run build` inside cf-bot folder and
you're ready to start the bot again.

## License

Released under the [MIT License](./LICENSE)