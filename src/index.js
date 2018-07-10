import Discord from 'discord.js';
import { prefix, token } from '../config.json';
import commands from './commands';

const client = new Discord.Client();
const cooldowns = new Discord.Collection();

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

    if(!cooldowns.has(cmd_name)) {
        cooldowns.set(cmd_name, new Discord.Collection());
    }

    const cmd = commands[cmd_name];

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldown_amount = (cmd.cooldown || 3) * 1000;

    if(timestamps.has(msg.author.id)) {
        const expiration_time = timestamps.get(msg.author.id) + cooldown_amount;

        if(now < expiration_time) {
            const time_left = (expiration_time - now) / 1000;
            return msg.reply(`please wait ${time_left.toFixed(1)} more second(s) before reusing the command`);
        }
    }

    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldown_amount);

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