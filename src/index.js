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

    let args = msg.content.slice(prefix.length).split(/ +/);
    let cmd = args.shift().toLowerCase();
    args = args.join(' ');

    if(!commands[cmd]) {
        return;
    }

    if(!cooldowns.has(cmd)) {
        cooldowns.set(cmd, new Discord.Collection());
    }

    cmd = commands[cmd];

    /* handle command cooldown */
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

    /* check args */
    if(cmd.validate && !cmd.validate(args)) {
        let reply = 'the arguments are invalid!';

        if(cmd.usage) {
            reply += `\nusage: \`${cmd.usage}\``;
        }

        return msg.reply(reply);
    }

    try {
        cmd.execute(msg, args);
    } catch(err) {
        msg.reply(err);
    }
});

client.login(token);