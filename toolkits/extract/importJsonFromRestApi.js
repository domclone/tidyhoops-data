"use strict";

const axios = require('axios');

async function importJsonFromRestApi(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error("An error occurred.");
    console.error(err.stack);
  }

};

module.exports = importJsonFromRestApi;
