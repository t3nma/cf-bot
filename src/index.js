import Discord from 'discord.js';
import { prefix, token } from '../config.json';
import commands from './commands';

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', async msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) {
        return;
    }

    const args = msg.content.slice(prefix.length).split(/ +/);
    const cmd_name = args.shift().toLowerCase();

    if(!commands[cmd_name]) {
        return;
    }

    const cmd = commands[cmd_name];

    try {
        if(cmd.args) {
            if(!args.length) {
                return msg.reply(`${cmd.name} could use some arguments...`);
            }

            cmd.execute(msg, args);
        } else {
            cmd.execute(msg);
        }
    } catch(err) {
        console.error(err);
        msg.reply('there was an error trying to execute that command!');
    }
});

client.login(token);