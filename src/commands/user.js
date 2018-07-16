/**
 * user command
 *   - retrive info about the users whose
 *     handles are provided.
 *
 * usage:
 *   !user [handles]
 *
 *   handles - space separated user handles
 */

import Discord from 'discord.js';
import { get_user } from '../cf/api';
import { RANK_COLOR } from '../cf/constants';

const validate = args => {
    return args.length;
};

const execute = async function(msg, args) {
    args = args.split(' ');

    if(args.length > 10000) {
        return msg.channel.send('no more than 10000 handles are accepted');
    }

    let users;

    try {
        const { body } = await get_user(args);
        users = body.result;
    } catch(err) {
        if(err.status && err.status === 400) {
            // bad request, no such user
            msg.reply(err.body.comment);
            return;
        }

        console.error(err);
        throw 'an error occured while processing the request';
    }

    for(const user of users) {
        const embed = new Discord.RichEmbed()
            .setTitle(user.handle)
            .setThumbnail(`https:${user.avatar}`)
            .addField('Name', `${user.firstName} ${user.lastName}`)
            .addField('Rank', `${user.rank} (${user.rating})`)
            .setURL(`http://codeforces.com/profile/${user.handle}`);

        const color = user.rank
            ? RANK_COLOR[user.rank.replace(/ +/, '_')]
            : RANK_COLOR.headquarters; // assume color for regular users with no rank too

        embed.setColor(color);

        msg.channel.send('', { embed });
    }
};

const user = {
    name: 'user',
    description: 'display user info',
    validate,
    usage: '!user handle1 handle2 ...',
    cooldown: 3,
    execute,
};

export default user;