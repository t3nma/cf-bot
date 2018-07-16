/**
 * problem command
 *  - retrive random problem based on index
 *    and tags (when provided).
 *
 * usage:
 *   !user [index] [tags]
 *
 *   index - (OPTIONAL) problem's contest index (capitalized letter)
 *   tags  - (OPTIONAL) semicolon separated problem tags
 */

import Discord from 'discord.js';
import { get_problem } from '../cf/api';
import { randomInt } from '../utils';

const execute = async function(msg, args) {
    let arg_index;

    args = args.split(' ');

    if(args.length && /^[A-Z][0-9]?$/.test(args[0])) {
        arg_index = args.shift();
    }

    args = args.join(' ').split(';').map(arg => arg.trim());

    let result;

    try {
        const { body } = await get_problem(args);
        result = body.result;
    } catch(err) {
        if(err.status && err.status === 400) {
            // bad request, invalid tag format
            msg.reply('tags should contain only lowercase letters, numbers, '
                + ' spaces and the symbols ***** and **-**.');
            return;
        }

        console.error(err);
        throw 'an error occured while processing the request';
    }

    let { problems } = result;

    if(!problems.length) {
        msg.reply('found no problems with that tags');
        return;
    }

    if(arg_index) {
        problems = problems.filter(prob =>
            prob.index && prob.index == arg_index
        );

        if(!problems.length) {
            let reply = 'found no problems with that index';
            if(args.length) {
                reply += ' and tags';
            }

            msg.reply(reply);
            return;
        }
    }

    const r = randomInt(0, problems.length - 1);

    const { name, contestId, index, tags } = problems[r];
    const { solvedCount } = result.problemStatistics[r];


    const embed = new Discord.RichEmbed()
        .setTitle(name)
        .addField('Contest', `${contestId}/${index}`)
        .addField('Accepted', `${solvedCount} time(s)`)
        .addField('Tags', tags.join(', '))
        .setURL(`http://codeforces.com/contest/${contestId}/problem/${index}`);

    msg.channel.send('', { embed });
};

const problem = {
    name: 'problem',
    description: 'retrieve a random problem with given index & tags',
    usage: 'problem [index] [tags]',
    cooldown: 5,
    execute,
};

export default problem;