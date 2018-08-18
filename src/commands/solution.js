/* eslint no-unused-vars: ["error", { "args": "none" }] */
const execute = async function(msg, args) {
    msg.reply('did you seriously tried to use this command?! :joy:');
};

const solution = {
    name: 'solution',
    description: 'Show solution for problem while at contest',
    usage: '!solution problem_name',
    args: true,
    execute,
};

export default solution;