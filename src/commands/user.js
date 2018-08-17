/**
 * user command
 *  - retrive info about the users whose
 *    handles are provided
 *
 * usage:
 *   !user [handles]
 *
 *   handles - space separated user handles. Up to 3
 *             handles maximum.
 */

import Discord from 'discord.js';
import { get_user } from '../cf/api';
import { RANK_COLOR } from '../cf/constants';

const execute = async function(msg, args) {
    if(args.length > 3) {
        msg.reply('no more than 3 handles accepted.');
        return;
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
        throw 'An error occured while processing the request';
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
    description: 'Diplay user information. Maximum of 3 users per request.',
    usage: '!user [handles]',
    args: true,
    cooldown: 5,
    execute,
};

export default user;