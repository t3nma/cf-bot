/**
 * help command
 *  - list commands or info on specific command
 *
 * usage:
 *   !help [command]
 *
 *   command - (OPTIONAL) command name to get info about
 */

import commands from '.';
import { prefix } from '../../config.json';

const execute = async function(msg, args) {
    const data = [];

    if(!args.length) {
        /* list commands */
        data.push('Here\'s a list of all my commands:');
        data.push(Object.keys(commands).join(', '));
        data.push(`\nYou can send \`${prefix}help [command]\` to get info on a specific command!`);

        try {
            msg.author.send(data, { split: true });
            if(msg.channel.type === 'dm') return;
            msg.reply('I\'ve sent you a DM with all my commands!');
        } catch(err) {
            console.error(`Could not send help DM to ${msg.author.tag}.\n`, err);
            msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
        }

    } else {
        /* show info on specific command */
        const cmd_name = args[0].toLowerCase();

        if(commands[cmd_name] === undefined) {
            msg.reply('that is not a valid command!');
            return;
        }

        const cmd = commands[cmd_name];

        data.push(`**Name:** ${cmd.name}`);

        if (cmd.description) data.push(`**Description:** ${cmd.description}`);
        if (cmd.usage) data.push(`**Usage:** ${cmd.usage}`);

        data.push(`**Cooldown:** ${cmd.cooldown || 3} second(s)`);

        msg.channel.send(data, { split: true });
    }
};

const help = {
    name: 'help',
    description: 'List all my commands or info about a specific command',
    usage: '!help [command]',
    args: false,
    execute,
};

export default help;