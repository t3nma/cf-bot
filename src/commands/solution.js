/* eslint no-unused-vars: ["error", { "args": "none" }] */
const execute = async function(msg, args) {
    msg.reply('did you seriously tried to use this command?! :joy:');
};

const help = {
    name: 'solution',
    description: 'Show solution for problem',
    usage: '!solution problem_name',
    args: true,
    execute,
};

export default help;