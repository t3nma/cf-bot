module.exports = {
    name: 'ping',
    description: 'something',
    args: false,
    execute: msg => {
        msg.channel.send('', {
            embed: {
                color: 150,
                title: 'Pong!',
                fields: [
                    {
                        inline: true,
                        name: 'sub-title 1',
                        value: 'description 1',
                    },
                    {
                        inline: true,
                        name: 'sub-title 2',
                        value: 'description 2',
                    },
                ],
            },
        });
    },
};