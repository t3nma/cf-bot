import Discord from 'discord.js';
import snekfetch from 'snekfetch';

const ping = {
    name: 'ping',
    description: 'something',
    args: true,
    execute: async function(msg, args) {

        const url = `http://codeforces.com/api/user.info?handles=${args[0]}`;
        console.log(`URL: ${url}`);

        let user;

        try {
            const { body } = await snekfetch.get(url);
            user = body.result[0];
        } catch(err) {
            // bad request, no such user
            console.error(err);
            msg.reply(`there is no *${args[0]}* registered`);
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
    },
};

export default ping;