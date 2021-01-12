const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const betSchema = new Schema({
  id: { type: String, unique: true },
  date: { type: Date },
  title: { type: String },
  odds: { type: Number },
  player: { type: String },
  setup: { type: String },
  playerTeam: { type: String },
  homeTeam: { type: String },
  awayTeam: { type: String },
  wager: { type: Number },
  result: { type: String },
  gain: { type: Number },
  isParlay: { type: Number },
  nbaPlayerId: { type: Number },
  nbaTeamId: { type: Number },
  playerHeadshot: { type: String }
});

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;