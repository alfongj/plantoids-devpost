const fetch = require("sync-fetch");

/**
 *
 * @param {Number} day Day of the month (1 indexed)
 * @param {Number} month Month in the year (1 indexed)
 * @param {Number} year
 * @return {Number} UNIX timestamp in milliseconds
 */
function _getUnixDateWithMsForDay(day, month, year) {
  return new Date(Date.UTC(year, month - 1, day)).getTime();
}

/**
 *
 * @param {Object} data Response object from blockchain API.
 *   See https://blockchain.info/blocks/1634184000000?format=json
 *   for an example
 * @return {string} Hash
 */
function _extractEarliestHashOfTheDay(data) {
  // TODO(alfongj) Make this resilient to blocks coming out of order
  return data[data.length - 1].hash;
}

/**
 *
 * @param {Number} day Day of the month (1 indexed)
 * @param {Number} month Month in the year (1 indexed)
 * @param {Number} year
 * @return {string} With the appropriate hash
 */
function getBTCBlockHashForDay(day, month, year) {
  const dateInMs = _getUnixDateWithMsForDay(day, month, year);
  const BTCBlockInfoApiURL = `https://blockchain.info/blocks/${dateInMs}?format=json`;
  const data = fetch(BTCBlockInfoApiURL).json();
  return _extractEarliestHashOfTheDay(data);
}

module.exports = getBTCBlockHashForDay;
