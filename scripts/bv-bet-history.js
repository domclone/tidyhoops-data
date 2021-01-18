const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Bet = require('../models/bet');
const importJsonFromRestApi = require('../toolkits/extract/importJsonFromRestApi.js');
const getRequestUrl = require('../toolkits/extract/getRequestUrl.js');
const getPlayerHeadshotUrl = require('../toolkits/extract/getPlayerHeadshotUrl.js');
const { connect } = require('../mongoose');

const bvUrl = 'https://www.bovada.lv/sports/player-props?overlay=login';
const bvBetHistoryRoute = '**/api/mybets*';
const credentials = { username: process.env.BV_USER, password: process.env.BV_PASS };
const selectors = {
  email: 'input[type="text"]',
  password: 'input[type = "password"]',
  submit: 'button[type="submit"]'
};

let connection = null;

const betHistory = async () => {
  try {
    // get request url for bet data from bovada api
    let requestUrl = await getRequestUrl(bvUrl, bvBetHistoryRoute, credentials, selectors);
    requestUrl.searchParams.set('bet.isActive', '0'); // we want settled bets not active bets
    requestUrl.searchParams.delete('limit'); // we want all bets 
    requestUrl = requestUrl.href;

    const rawBets = await importJsonFromRestApi(requestUrl);

    const cleanedBets = rawBets.data.map(entry => {
      let playerName = entry.events[0].players !== null ? entry.events[0].players[0].name : null;
      if (playerName === 'C.J. McCollum') playerName = 'CJ McCollum'; // annoying, will find a better solution
      if (playerName === 'RJ Barrett Jr.') playerName = 'RJ Barrett'; // annoying, will find a better solution

      const bet = {
        id: entry.id,
        date: entry.events[0].games[0].date,
        title: entry.title,
        odds: entry.odds,
        player: playerName,
        setup: entry.events[0].statistic.title,
        playerTeam: entry.events[0].teams !== null ? entry.events[0].teams[0].abbreviation : null,
        homeTeam: entry.events[0].games[0].homeTeam.abbreviation,
        awayTeam: entry.events[0].games[0].visitingTeam.abbreviation,
        wager: entry.amount,
        result: entry.events[0].settlement.result,
        gain: entry.events[0].settlement.result === 'Lost' ? -Math.round(entry.amount) : Math.round((entry.odds * entry.amount) - entry.amount),
        isParlay: entry.isAccumulator,
        playerHeadshot: getPlayerHeadshotUrl(playerName)
      }

      return bet;
    })
    const straightBets = cleanedBets.filter(bet => bet.isParlay === 0); // we want to filter out parlays for now

    if (connection === null) connection = await connect(); // connect to mongo
    Bet.insertMany(straightBets, { ordered: false }); // save bets to mongo
  } catch (err) {
    console.log(`error: ${err}`);
  }
};

betHistory();