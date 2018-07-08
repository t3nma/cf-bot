const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cmd_files = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for(const file of cmd_files) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd);
}

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) {
        return;
    }

    const args = msg.content.slice(prefix.length).split(/ +/);
    const cmd_name = args.shift().toLowerCase();

    if(!client.commands.has(cmd_name)) {
        return;
    }

    const cmd = client.commands.get(cmd_name);

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