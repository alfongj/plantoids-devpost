class DNA {
  constructor(nftMetadata) {
    if (nftMetadata) {
      // TODO parse
    } else {
      this._genRandomDNA();
      // this._genGoodLookingDNA();
    }
  }

  // to non inclusive
  _getRandomIntInRange(from, to) {
    return Math.floor(from + Math.random() * (to - from));
  }

  _getRandomFloatInRange(from, to) {
    return from + Math.random() * (to - from);
  }

  _getRandomElemInArray(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  _genRandomDNA() {
    this.minHeightForBranch = this._getRandomIntInRange(2, 6);
    this.branchProbability = this._getRandomFloatInRange(0.15, 0.4);
    this.branchDiminishingFactor = this._getRandomFloatInRange(0.6, 0.95);
    this.stemDiminishingFactor = this._getRandomFloatInRange(0.85, 0.95);
    this.stemWidthGrowthRate = this._getRandomFloatInRange(1.02, 1.15);
    this.initialStemWidth = this._getRandomIntInRange(2, 8);
    this.initialStemSegmentHeight = this._getRandomIntInRange(10, 25);
    this.stemSegmentHeightGrowthRate = this._getRandomFloatInRange(1.05, 1.25);
    this.maxStemWidth = this._getRandomIntInRange(10, 20)
    this.maxStemSegmentHeight = this._getRandomIntInRange(20, 35);
    this.maxLength = this._getRandomIntInRange(20, 30);
    this.stemInitialColor = this._getRandomElemInArray(
      ['#663410', '#472410', '#332116', '#634634', '#9E6F52', '#245C30']);
    this.leafShape = this._getRandomIntInRange(0, 4);
    this.flowerShape = this._getRandomIntInRange(0, 4);
    let date = new Date();
    this.birthday = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
  }

  _genGoodLookingDNA() {
    this.minHeightForBranch = 2;
    this.branchProbability = 0.3;
    this.branchDiminishingFactor = 0.8208261364589362;
    this.stemDiminishingFactor = 0.8678152160819728;
    this.stemWidthGrowthRate = 1.0778746937439005;
    this.initialStemWidth = 3;
    this.initialStemSegmentHeight = 15;
    this.stemSegmentHeightGrowthRate = 1.2;
    this.maxStemWidth = 15;
    this.maxStemSegmentHeight = 25;
    this.maxLength = 25; // number of consecutive segments
    this.stemInitialColor = '#663410';
    this.leafShape = 0;
    this.flowerShape = 0;
    let date = new Date();
    this.birthday = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
  }

  toAttrArray() {
    return [
      {
        trait_type: 'minHeightForBranch',
        value: this.minHeightForBranch
      },
      {
        trait_type: 'branchProbability',
        value: this.branchProbability
      },
      {
        trait_type: 'branchDiminishingFactor',
        value: this.branchDiminishingFactor
      },
      {
        trait_type: 'stemDiminishingFactor',
        value: this.stemDiminishingFactor
      },{
        trait_type: 'stemWidthGrowthRate',
        value: this.stemWidthGrowthRate
      },{
        trait_type: 'initialStemWidth',
        value: this.initialStemWidth
      },{
        trait_type: 'initialStemSegmentHeight',
        value: this.initialStemSegmentHeight
      },{
        trait_type: 'stemSegmentHeightGrowthRate',
        value: this.stemSegmentHeightGrowthRate
      },{
        trait_type: 'maxStemWidth',
        value: this.maxStemWidth
      },{
        trait_type: 'maxStemSegmentHeight',
        value: this.maxStemSegmentHeight
      },{
        trait_type: 'maxLength',
        value: this.maxLength
      },{
        trait_type: 'stemInitialColor',
        value: this.stemInitialColor
      },{
        trait_type: 'leafShape',
        value: this.leafShape
      },{
        trait_type: 'flowerShape',
        value: this.flowerShape
      },{
        trait_type: 'birthday',
        value: this.birthday
      }
    ]
  }
}


