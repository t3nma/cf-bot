import Discord from 'discord.js';
import { get_user_info } from '../cf/api';
import { RANK_COLOR } from '../cf/constants';

const execute = async function(msg, args) {
    let users;

    try {
        const { body } = await get_user_info(args);
        users = body.result;
    } catch(err) {
        console.error(err);

        if(err.status && err.status === 400) {
            // bad request, no such user
            msg.channel.send(err.body.comment);
        } else {
            msg.channel.send('an error occured while processing the request');
        }

        return;
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
    description: 'something',
    args: true,
    execute,
};

export default user;