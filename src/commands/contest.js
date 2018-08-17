/**
 * problem command
 *  - retrive contests yet to start. User can filter
 *    for divison.
 *
 * usage:
 *   !contest [division]
 *
 *   division - as simple as 1, 2, 3!
 */

import Discord from 'discord.js';
import { get_contest } from '../cf/api';
import { convertEpochToDate } from '../utils';

const execute = async function(msg, args) {
    let div;

    if(args.length) {
        div = Number.parseInt(args[0]);

        if(Number.isNaN(div) || div < 0 || div > 3) {
            msg.reply(`${args[0]} is not a valid division number!`);
            return;
        }
    }

    let result;

    try {
        const { body } = await get_contest();
        result = body.result;
    } catch(err) {
        console.error(err);
        throw 'An error occured while processing the request.';
    }

    const valid = [];

    for(const r of result) {
        if(r.phase !== 'BEFORE') continue;

        if(div === undefined || r.name.includes(`Div. ${div}`)) {
            valid.push(r);
        }
    }

    if(!valid.length) {
        let reply = 'found no contests';

        if(div !== undefined) {
            reply += ` for division ${div}`;
        }

        msg.reply(reply);
        return;
    }

    for(const v of valid) {
        const embed = new Discord.RichEmbed()
            .setTitle(v.name)
            .setURL(`http://codeforces.com/contests/${v.id}`)
            .addField('Type', v.type);

        if(v.startTimeSeconds) embed.addField('Starting', convertEpochToDate(v.startTimeSeconds));
        if(v.preparedBy) embed.addField('Author', v.preparedBy);
        if(v.difficulty) embed.addField('Difficulty', v.difficulty);

        msg.channel.send('', { embed });
    }
};

const contest = {
    name: 'contest',
    description: 'Retrieve list of yet to start contests filtered by'
        + '(optional) division number.',
    usage: 'contest [division]',
    args: false,
    cooldown: 5,
    execute,
};

export default contest;