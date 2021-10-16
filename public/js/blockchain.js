/**
 *
 * @param {Number} day Day of the month (1 indexed)
 * @param {Number} month Month in the year (1 indexed)
 * @param {Number} year
 * @returns UNIX timestamp in milliseconds
 */
function _getUnixDateWithMsForDay(day, month, year) {
  return new Date(Date.UTC(year, month - 1, day)).getTime();
}

/**
 *
 * @param {Object} data Response object from blockchain API.
 *   See https://blockchain.info/blocks/1634184000000?format=json
 *   for an example
 */
function _extractEarliestHashOfTheDay(data) {
  // TODO(alfongj) Make this resilient to blocks coming out of order
  return data[data.length - 1].hash;
}

function getBTCBlockHashForDay(day, month, year, callback) {
  let dateInMs = _getUnixDateWithMsForDay(day, month, year);
  let BTCBlockInfoApiURL = `https://blockchain.info/blocks/${dateInMs}?format=json`;
  fetch(BTCBlockInfoApiURL)
    .then(response => response.json())
    .then(data => {
      let hash = _extractEarliestHashOfTheDay(data);
      callback(hash);
    });
}