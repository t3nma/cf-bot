import Discord from 'discord.js';
import snekfetch from 'snekfetch';

const execute = async function(msg, args) {

    const url = `http://codeforces.com/api/user.info?handles=${args[0]}`;
    console.log(`URL: ${url}`);

    let user;

    try {

        const { body } = await snekfetch.get(url);
        user = body.result[0];

    } catch(err) {
        console.error(err);

        if(err.status && err.status === 400) {
            // bad request, no such user
            msg.reply(`there is no user registered with the handle *${args[0]}*`);
        } else {
            msg.reply('an error occured while processing your request');
        }

        return;
    }

    const embed = new Discord.RichEmbed()
        .setTitle(user.handle)
        .setColor('BLUE')
        .setThumbnail(`https:${user.avatar}`);

    if(user.firstName && user.lastName) {
        embed.addField('Name', `${user.firstName} ${user.lastName}`);
    }

    embed.addField('Rank', `${user.rank} (${user.rating})`);

    // TODO set color according to rank

    msg.channel.send('', { embed });
};

const user = {
    name: 'user',
    description: 'something',
    args: true,
    execute,
};

export default user;