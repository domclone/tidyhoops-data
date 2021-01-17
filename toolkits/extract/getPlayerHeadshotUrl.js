const nba = require('nba-api-client');

const getPlayerHeadshotUrl = (playerName) => {
  const nbaIds = nba.getPlayerID(playerName) ? nba.getPlayerID(playerName) : null
  return nbaIds === null ? null : `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${nbaIds.PlayerID}.png`
}

module.exports = getPlayerHeadshotUrl;