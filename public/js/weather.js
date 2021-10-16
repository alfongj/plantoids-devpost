class Weather {

  constructor(btcHash) {
    if (btcHash) {
      this.btcHash = btcHash;
      this._extractWeatherFromBtcHash(btcHash);
    }
  }

  _extractWeatherFromBtcHash(hash) {
    const weather = {
      randomSeed: 0,       // 1st and 2nd digits from the right, but read from Left to right). 0-255
      lightLvl: 0,         // 3rd digit of hash from the right. From 0-15
      precipitationLvl: 0, // 4th digit of hash from the right. From 0-15
    }

    let curIdx = hash.length;

    this.randomSeed = parseInt(hash.slice(curIdx - 2, curIdx), 16);
    curIdx -= 2;

    this.lightLvl = parseInt(hash.slice(curIdx - 1, curIdx), 16);
    curIdx--;

    this.precipitationLvl = parseInt(hash.slice(curIdx - 1, curIdx), 16);
    curIdx--;
  };

  toString() {
    return `{
      randomSeed: ${this.randomSeed},
      lightLvl: ${this.lightLvl},
      precipitationLvl: ${this.precipitationLvl},
      emoji: ${this.getEmoji()},
      btcHash: ${this.btcHash}
    }`;
  }

  // ☁️☀️🌤🌥⛅️🌧🌨☔️💧
  getEmoji() {
    if (this.precipitationLvl >= 10) {
      return "☔";
    } else if (this.precipitationLvl >= 5 && this.lightLvl >= 8) {
      return "🌦";
    } else if (this.precipitationLvl >= 5) {
      return "🌧";
    } else if (this.lightLvl >= 13) {
      return "☀️";
    } else if (this.lightLvl >= 10) {
      return "🌤";
    } else if (this.lightLvl >= 7) {
      return "🌥";
    } else if (this.lightLvl >= 4) {
      return "⛅";
    } else {
      return "☁️";
    }
  }

}