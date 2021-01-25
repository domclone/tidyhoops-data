const nba = require('nba');

const getPlayerHeadshotUrl = (playerName) => {
  let playerId;

  if (playerName === null) {
    return null
  } else if (nba.findPlayer(playerName) === undefined) {
    return null
  } else {
    playerId = nba.findPlayer(playerName).playerId
  }

  return `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerId}.png`
}

module.exports = getPlayerHeadshotUrl;