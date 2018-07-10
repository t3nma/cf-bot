import Discord from 'discord.js';
import { get_user_info } from '../cf/api';
import { RANK_COLOR } from '../cf/constants';

const execute = async function(msg, args) {
    if(args.length > 10000) {
        msg.channel.send('no more than 10000 handles are accepted');
    }

    let users;

    try {
        const { body } = await get_user_info(args);
        users = body.result;
    } catch(err) {
        if(err.status && err.status === 400) {
            // bad request, no such user
            return msg.reply(err.body.comment);
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
            : RANK_COLOR.headquarters; // not sure

        embed.setColor(color);

        msg.channel.send('', { embed });
    }
};

const user = {
    name: 'user',
    description: 'display user info',
    args: true,
    usage: '!user handle1 handle2 ...',
    cooldown: 3,
    execute,
};

export default user;