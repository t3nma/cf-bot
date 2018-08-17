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

    const cmd = commands[cmd_name];

    /* handle arguments */
    if(cmd.args !== undefined && cmd.args && args.length == 0) {
        msg.reply(`you didn't specify any arguments! Type \`${prefix}help ${cmd.name}\``
            + ' for more info about the command');
        return;
    }

    /* handle cooldown */
    if(!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldown_amount = (cmd.cooldown || 3) * 1000;

    if(timestamps.has(msg.author.id)) {
        const expiration_time = timestamps.get(msg.author.id) + cooldown_amount;

        if(now < expiration_time) {
            const time_left = (expiration_time - now) / 1000;
            msg.reply(`please wait ${time_left.toFixed(1)} more second(s) before reusing the command`);
            return;
        }
    }

    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldown_amount);

    try {
        cmd.execute(msg, args);
    } catch(err) {
        msg.reply(err);
    }
});

client.login(token);