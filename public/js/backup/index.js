// First init the canvas to draw the Tree on.
const WIDTH = 400;
const HEIGHT = 400;
const INITIAL_LINE_LENGTH = 80;
const INITIAL_LINE_WIDTH = INITIAL_LINE_LENGTH / 6;



// Now initialize the L-System to generate the tree
// We use the syntax for creating stochastic productions, see: https://github.com/nylki/lindenmayer/blob/master/docs/index.md#stochastic
// If you'd rather use your own stochastic function in the productions,
// you can do that too, see how it is done in this example:  https://codepen.io/nylki/pen/XdOqPd
let tree;
let _$p;
let productionsInitial = {
  'X': {
    successors: [
      { weight: 0.7, successor: 'FFF-[[X]+X]+F[+FX]-X' },
      { weight: 0.3, successor: 'FF-[X+]+FF[-FX]-XF' }
    ]
  },
  'F': {
    successors: [
      { weight: 0.8, successor: 'F' },
      { weight: 0.17, successor: 'FF' },
      { weight: 0.03, successor: 'FF+' }
    ]
  }
};

let axiomA = 'A'

let productionsVarA = {
  'X': {
    successors: [
      { weight: 0.7, successor: 'ABC' },
      { weight: 0.3, successor: 'DEG' }
    ]
  },
  'F': {
    successors: [
      { weight: 0.8, successor: 'F' },
      { weight: 0.17, successor: 'FF' },
      { weight: 0.03, successor: 'FF+' }
    ]
  },
  'A': 'FFF',
  'B': '-[[X]+X]',
  'C': '+F[+FX]-X',
  'D': 'FF-[X+]',
  'E': '+FF[-FX]',
  'G': '-XF'
};



let DNA = {
  lightNeed: 1, // 1 means max need. Think about threshold (is too light too much?)
  minHeightForBranch: 5,
  branchProbability: 0.1,
  maxStemWidth: 10,
  maxStemSegmentHeight: 15,
}

let dayConditions = {
  lightLvl: 1,
  temperature: 1,
  precipitation: 1,
  pollution: 1,
  randomSeed: 69,
}

let treeState = {
  hydrationLvl: 0.5,
  airLvl: 1,
  sunlightLvl: 1,
}

let axiomB = [
  { symbol: 'X', x: 0, y: 0 }
]

/**
 * X: Origin
 * S: Stem
 * B: Branch
 * L: Leaf
 * F: Flower
 */
let productionsVarB = {
  'X': ({ index, part, currentAxiom }) => {
    if (index >= DNA.minHeightForBranch && rng() < DNA.branchProbability) {
      // Branch
        return [
          { symbol: '-' },
          { symbol: '[' },
          { symbol: 'X' },
          { symbol: ']' },
          { symbol: 'X' },
        ];
    } else {
      // Continue straight
      return [
        { symbol: 'S', width: 1, height: 5 },
        { symbol: 'X' },
      ];
    }
  },
  'S': ({ index, part, currentAxiom }) => {
    console.log('S productions')
    console.log(index)
    console.log(part)
    console.log(currentAxiom)

    return [
      {
        symbol: 'S',
        width: Math.min(DNA.maxStemWidth, part.width + 1),
        height: Math.min(DNA.maxStemSegmentHeight, part.height + 3)
      },
    ];
  },
  'B': ({ index, part, currentAxiom }) => {
    console.log('B productions')
    console.log(index)
    console.log(part)
    console.log(params)
    console.log(currentAxiom)

    return { symbol: 'B', food: 'shit' };
  }
};

// TODO eliminate all randomness
const finalsA = {
  'F': () => {
    _$p.drawingContext.lineWidth += (Math.random() - 0.5) / 100;
    _$p.drawingContext.strokeStyle = 'rgb(55, 29, 4)';
    _$p.drawingContext.beginPath()
    _$p.drawingContext.moveTo(0, 0)
    _$p.drawingContext.lineTo(0, tree.linelength / (tree.lsystem.iterations + 1))
    _$p.drawingContext.stroke()
    _$p.drawingContext.translate(0, (tree.linelength / (tree.lsystem.iterations + 1)) - 1.5)
  },
  'X': () => {
    if (Math.random() > 0.8) {
      _$p.drawingContext.drawImage(image, 0, 0, 20, 20);
    } else {
      _$p.drawingContext.drawImage(image2, 0, 0, 10, 20);
    }
  },
  '+': () => { _$p.drawingContext.rotate((Math.PI / 180) * 22.5) },
  '-': () => { _$p.drawingContext.rotate((Math.PI / 180) * -22.5) },
  '[': () => {
    _$p.drawingContext.save();
    _$p.drawingContext.lineWidth *= 0.65;
    // Make strokes lighter in branches
    // to simulate depth
    _$p.drawingContext.globalAlpha *= Math.random() * (1.0 - 0.7) + 0.7;
    tree.linelength -= 10;
  },
  ']': () => {
    _$p.drawingContext.restore();
    _$p.drawingContext.lineWidth *= 0.9;
    tree.linelength += 10;
  }
};


const finalsB = {
  'S': ({ index, part }) => {
    console.log(part)
    _$p.drawingContext.lineWidth = part.width;// (Math.random() - 0.5) / 100;
    _$p.drawingContext.strokeStyle = 'rgb(55, 29, 4)';
    _$p.drawingContext.beginPath()
    _$p.drawingContext.moveTo(0, 0)
    _$p.drawingContext.lineTo(0, part.height)
    _$p.drawingContext.stroke()
    _$p.drawingContext.translate(0, part.height - 1.5)
  },
  'X': () => {
    if (Math.random() > 0.8) {
      _$p.drawingContext.drawImage(image, 0, 0, 20, 20);
    } else {
      _$p.drawingContext.drawImage(image2, 0, 0, 10, 20);
    }
  },
  '+': () => { _$p.drawingContext.rotate((Math.PI / 180) * 22.5) },
  '-': () => { _$p.drawingContext.rotate((Math.PI / 180) * -22.5) },
  '[': () => {
    console.log("BRANCH")
    _$p.drawingContext.save();
    _$p.drawingContext.lineWidth *= 0.65;
    // Make strokes lighter in branches
    // to simulate depth
    _$p.drawingContext.globalAlpha *= Math.random() * (1.0 - 0.7) + 0.7;
    tree.linelength -= 10;
  },
  ']': () => {
    _$p.drawingContext.restore();
    _$p.drawingContext.lineWidth *= 0.9;
    tree.linelength += 10;
  }
};

let rng;
let sketch = function ($p) {
  _$p = $p;
  rng = new Math.seedrandom(dayConditions.randomSeed);
  $p.setup = function () {
    $p.createCanvas(WIDTH, HEIGHT);

    tree = new Tree(
      $p.drawingContext,
      INITIAL_LINE_LENGTH,
      productionsVarB,
      finalsB,
      rng
      );
    let lsystem = tree.getLSystem();

    // Freshly init the L-System
    lsystem.setAxiom(axiomB);
    $p.noLoop();
  }

  const BACKG_COLOR_1 = '#b0f3ff',
    BACKG_COLOR_2 = '#ffffff';

  $p.draw = function () {
    // console.log(`
    //   iterations: ${tree.getLSystem().iterations}
    //   maxDepth: ${tree.getMaxDepth()}
    //   maxRotation: ${tree.getMaxRotation()}
    //   length: ${tree.getJson().length}
    //   `);


    tree.setLinelength(INITIAL_LINE_LENGTH);

    // Finally draw
    $p.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    $p.drawingContext.clearRect(0, 0, $p.width, $p.height);

    drawGradient($p, 0, 0, $p.width, $p.height, $p.color(BACKG_COLOR_1), $p.color(BACKG_COLOR_2), 'y')
    // Translate so that tree is (more or less) in the center
    $p.drawingContext.translate($p.width / 2, $p.height - 50);
    $p.drawingContext.rotate(Math.PI);
    $p.drawingContext.lineWidth = INITIAL_LINE_WIDTH;
    $p.drawingContext.lineCap = 'square'
    tree.draw();

    document.getElementById('text-output').innerHTML = tree.getJson();
  }
};
new p5(sketch, 'canvas-cont');

const image = document.getElementById('source');
const image2 = document.getElementById('source2');
document.getElementById('btn-iterate').addEventListener("click", function () {
  tree.getLSystem().iterate();
  _$p.draw();
});