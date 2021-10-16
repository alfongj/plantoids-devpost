class Tree {
  constructor(
    dna
  ) {
    this.DNA = dna;
    this.lsystem = new LSystem({
      productions: this._getProductions(),
      axiom: this._getInitialAxiom(),
    });
  }

  /**
   * X: Growth points
   * S: Segment
   * L: Leaf
   * F: Flower
   */
  _getProductions() {
    return {
      'X': ({ index, part }) => {

        // Stop growing past the DNA max length
        if (this._getLengthForIndex(index, true) >= this.DNA.maxLength) {
          return;
        }

        if (index >= this.DNA.minHeightForBranch && this.rng() < this.DNA.branchProbability) {
          // Branch X -> +[X]-X  OR -[X]+X

          let direction = this.rng() > 0.5 ? 'left' : 'right';
          let continuesStraight = this.rng() > 0.1; // TODO DNA

          let result = [
            { symbol: direction === 'left' ? '-' : '+' },
            { symbol: '[' },
            {
              symbol: 'X',
              width: part.width * this.DNA.branchDiminishingFactor,
              maxWidth: part.maxWidth * this.DNA.branchDiminishingFactor,
              height: part.height * this.DNA.branchDiminishingFactor,
              maxHeight: part.maxHeight * this.DNA.branchDiminishingFactor
            },
            { symbol: ']' },
            { symbol: direction === 'right' ? '-' : '+' }
          ];

          if (continuesStraight) {
            result.push({
              symbol: 'X',
              width: part.width * this.DNA.stemDiminishingFactor,
              maxWidth: part.maxWidth * this.DNA.stemDiminishingFactor,
              height: part.height * this.DNA.stemDiminishingFactor,
              maxHeight: part.maxHeight * this.DNA.stemDiminishingFactor
            });
          }

          return result;
        } else {
          // Continue X -> SX

          return [
            {
              symbol: 'S',
              width: part.width,
              maxWidth: part.maxWidth,
              height: part.height,
              maxHeight: part.maxHeight,
              color: this.DNA.stemInitialColor
            },
            {
              symbol: 'X',
              width: part.width * this.DNA.stemDiminishingFactor,
              maxWidth: part.maxWidth * this.DNA.stemDiminishingFactor,
              height: part.height * this.DNA.stemDiminishingFactor,
              maxHeight: part.maxHeight * this.DNA.stemDiminishingFactor
            },
          ];
        }
      },
      // Segments grow but don't span new segments
      // S -> S*
      'S': ({ part }) => {
        return [
          {
            symbol: 'S',
            width: Math.min(part.maxWidth, part.width * this.DNA.stemWidthGrowthRate),
            maxWidth: part.maxWidth,
            height: Math.min(part.maxHeight, part.height * this.DNA.stemSegmentHeightGrowthRate),
            maxHeight: part.maxHeight,
            color: part.color
          },
        ];
      }
    };
  }

  _getInitialAxiom() {
    return [
      {
        symbol: 'X',
        width: this.DNA.initialStemWidth,
        maxWidth: this.DNA.maxStemWidth,
        height: this.DNA.initialStemSegmentHeight,
        maxHeight: this.DNA.maxStemSegmentHeight,
      }
    ]
  }

  setFinals(_finals) {
    this.lsystem.setFinals(_finals);
  }

  getDNA() {
    return this.DNA;
  }

  getJson() {
    return this.lsystem.getString(false);
  }

  // TODO implement
  iterateToToday() {
    const HARDCODED_ITERATIONS = 25; // TODO remove
    const randomSeed = 77; // TODO derive from weather each day
    const _rng = new Math.seedrandom(randomSeed);
    this.rng = _rng;
    this.lsystem.iterate(HARDCODED_ITERATIONS, _rng);
  }

  draw() {
    this.lsystem.final();
  }

  getMaxDepth() {
    let axiom = this.lsystem.getRaw();
    let maxDepth = 0;
    let curDepth = 0;
    for (let obj of axiom) {
      if (obj.symbol === '[') {
        curDepth++;
      } else if (obj.symbol === ']') {
        curDepth--;
      }
      maxDepth = Math.max(maxDepth, curDepth);
    }
    return maxDepth;
  }

  getDepthForIdx(idx) {
    let axiom = this.lsystem.getRaw();

    let curDepth = 0;
    let curIdx = 0;
    for (let obj of axiom) {
      if (idx == curIdx) return curDepth;

      if (obj.symbol === '[') {
        curDepth++;
      } else if (obj.symbol === ']') {
        curDepth--;
      }

      curIdx++;
    }
    return 0;
  }

  /**
   *
   * @param {Number} forIdx Part index within the axiom
   * @param {bool} local Whether to return the length counting from this branch only.
   *   If false, it counts from the tree root
   * @returns Number
   */
  _getLengthForIndex(forIdx, local) {
    let axiom = this.lsystem.getRaw();
    let maxLength = 0;
    let lengths = [0];

    let idx = 0;

    for (let obj of axiom) {
      if (obj.symbol === '[') {
        lengths.push(0);
      } else if (obj.symbol === ']') {
        lengths.pop();
      } else if (!'[]+-X'.includes(obj.symbol)) {
        lengths[lengths.length - 1]++;
      }

      let sumReducer = (prev, cur) => prev + cur;

      if (forIdx && forIdx === idx) {
        return local ? lengths[lengths.length - 1] : lengths.reduce(sumReducer);
      } else {
        maxLength = Math.max(
          maxLength,
          lengths.reduce(sumReducer));
      }

      idx++;
    }
    return maxLength;
  }

  getMaxRotation() {
    let str = this.getString();
    let maxRotation = 0;
    let minuses = [0];
    let pluses = [0];
    for (let char of str) {
      if (char === '[') {
        minuses.push(0);
        pluses.push(0);
      } else if (char === ']') {
        minuses.pop();
        pluses.pop();
      } else if (char === '-') {
        minuses[minuses.length - 1]++;
      } else if (char === '+') {
        pluses[pluses.length - 1]++;
      }

      let sumReducer = (prev, cur) => prev + cur;
      maxRotation = Math.max(
        maxRotation,
        minuses.reduce(sumReducer),
        pluses.reduce(sumReducer));
    }
    return maxRotation;
  }
}
