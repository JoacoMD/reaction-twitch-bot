const reactions = require('./reactions.json');

const fetchGif = (reactionName) => {
    const reaction = reactions[reactionName];
    return reaction.gifs[Math.floor(Math.random() * reaction.gifs.length)]
}

const buildReaction = (command, user, target) => {
    const reactionName = command.replace('!', '');
    const reaction = reactions[reactionName];
    if(!reaction) { return null; }
    if(reaction.msg === null && target === null) { return targetNotFound; }
    if (reaction.msgTarget && target) {
        return {msg: parseMsg(reaction.msgTarget, user, target), src: fetchGif(reactionName)}
    } else {
        return {msg: parseMsg(reaction.msg, user, target), src: fetchGif(reactionName)}
    }
}

const parseMsg = (msg, user, target) => {
    const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
    let text = msg.replace(templateMatcher, (substring, value, index) => {
      value = value === 'user' ? user : target;
      return value;
    });
    return text;
}

const targetNotFound = 'targetNotFound';

const getListOfCommands = () => {
    return Object.keys(reactions).map(name => '!' + name);
} 

module.exports = { buildReaction, targetNotFound, getListOfCommands }