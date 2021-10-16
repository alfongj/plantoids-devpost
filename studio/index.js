const WIDTH = 400;
const HEIGHT = 400;

let tree;
let _$p;
let rng;


let DNA = {
  lightNeed: 1, // 1 means max need. Think about threshold (is too light too much?)
  minHeightForBranch: 3,
  branchProbability: 0.33,
  branchDiminishingFactor: 0.85,
  stemDiminishingFactor: 0.95,
  stemWidthGrowthRate: 1.1,
  initialStemWidth: 4,
  initialStemSegmentHeight: 15,
  stemSegmentHeightGrowthRate: 1.2,
  maxStemWidth: 15,
  maxStemSegmentHeight: 25,
  maxLength: 25, // number of consecutive segments
  stemInitialColor: '#663410',
  leafShape: 0,
  flowerShape: 0,
}

let dayConditions = {
  lightLvl: 1,
  temperature: 1,
  precipitation: 1,
  pollution: 1,
  randomSeed: 873647,
}

let treeState = {
  hydrationLvl: 0.5,
  airLvl: 1,
  sunlightLvl: 1,
}

let axiomB = [
  {
    symbol: 'X',
    width: DNA.initialStemWidth,
    maxWidth: DNA.maxStemWidth,
    height: DNA.initialStemSegmentHeight,
    maxHeight: DNA.maxStemSegmentHeight,
  }
]

/**
 * X: Growth points
 * S: Segment
 * L: Leaf
 * F: Flower
 */
let productionsVarB = ($p) => ({
  'X': ({ index, part }) => {

    // Stop growing past the DNA max length
    if (tree.getLengthForIndex(index, true) >= DNA.maxLength) {
      return;
    }

    if (index >= DNA.minHeightForBranch && rng() < DNA.branchProbability) {
      // Branch X -> +[X]-X  OR -[X]+X

      let direction = rng() > 0.5 ? 'left' : 'right';
      let continuesStraight = rng() > 0.1; // TODO DNA

      let result = [
        { symbol: direction === 'left' ? '-' : '+' },
        { symbol: '[' },
        {
          symbol: 'X',
          width: part.width * DNA.branchDiminishingFactor,
          maxWidth: part.maxWidth * DNA.branchDiminishingFactor,
          height: part.height * DNA.branchDiminishingFactor,
          maxHeight: part.maxHeight * DNA.branchDiminishingFactor
        },
        { symbol: ']' },
        { symbol: direction === 'right' ? '-' : '+' }
      ];

      if (continuesStraight) {
        result.push({
          symbol: 'X',
          width: part.width * DNA.stemDiminishingFactor,
          maxWidth: part.maxWidth * DNA.stemDiminishingFactor,
          height: part.height * DNA.stemDiminishingFactor,
          maxHeight: part.maxHeight * DNA.stemDiminishingFactor
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
          color: DNA.stemInitialColor
        },
        {
          symbol: 'X',
          width: part.width * DNA.stemDiminishingFactor,
          maxWidth: part.maxWidth * DNA.stemDiminishingFactor,
          height: part.height * DNA.stemDiminishingFactor,
          maxHeight: part.maxHeight * DNA.stemDiminishingFactor
        },
      ];
    }
  },
  // Segments grow but don't span new segments
  // S -> S*
  'S': ({part}) => {
    return [
      {
        symbol: 'S',
        width: Math.min(part.maxWidth, part.width * DNA.stemWidthGrowthRate),
        maxWidth: part.maxWidth,
        height: Math.min(part.maxHeight, part.height * DNA.stemSegmentHeightGrowthRate),
        maxHeight: part.maxHeight,
        color: part.color
      },
    ];
  }
});

const finalsB = ($p) => ({
  'S': ({index, part}) => {
    let depthLvl = tree.getDepthForIdx(index);

    $p.noStroke();
    $p.fill($p.lerpColor(
        $p.color(part.color),
        $p.color('black'),
        depthLvl * 0.15
      ));
    $p.quad(-part.width / 2, 0,
      part.width / 2, 0,
      part.width * DNA.stemDiminishingFactor / 2, part.height,
      -part.width * DNA.stemDiminishingFactor / 2, part.height);
    $p.translate(0, part.height - 0.5)
  },
  'X': () => {
    let leafImage = leafImages[DNA.leafShape];
    let flowerImage = flowerImages[DNA.flowerShape];

    if (Math.random() > 0.5) {
      $p.colorMode($p.HSB);
      $p.tint(0, 0, $p.random(50, 100));
      $p.image(leafImage, 0, 0, 10, 10);
      $p.colorMode($p.RGB);
    } else {
      $p.image(flowerImage, 0, 0, 10, 10);
    }

  },
  '+': () => { $p.drawingContext.rotate((Math.PI / 180) * 22.5) },
  '-': () => { $p.drawingContext.rotate((Math.PI / 180) * -22.5) },
  '[': () => {
    $p.drawingContext.save();
  },
  ']': () => {
    $p.drawingContext.restore();
  }
});


const NUM_ITERATIONS = 30;
leafImages = [];
flowerImages = [];

let sketch = function ($p, parentElem) {
  rng = new Math.seedrandom(dayConditions.randomSeed);

  $p.preload = function () {
    leafImages[0] = $p.loadImage('../public/img/leaf1.png');
    leafImages[1] = $p.loadImage('../public/img/leaf2.png');
    leafImages[2] = $p.loadImage('../public/img/leaf3.png');
    leafImages[3] = $p.loadImage('../public/img/leaf4.png');

    flowerImages[0] = $p.loadImage('../public/img/flower1.png');
    flowerImages[1] = $p.loadImage('../public/img/flower2.png');
    flowerImages[2] = $p.loadImage('../public/img/flower3.png');
    flowerImages[3] = $p.loadImage('../public/img/flower4.png');
  }

  $p.setup = function () {
    let canvas = $p.createCanvas(WIDTH, HEIGHT);
    canvas.parent(parentElem);

    tree = new Tree(
      $p.drawingContext,
      productionsVarB($p),
      finalsB($p),
      rng
    );
    let lsystem = tree.getLSystem();

    // Freshly init the L-System
    lsystem.setAxiom(axiomB);
    lsystem.iterate(NUM_ITERATIONS);
    $p.noLoop();
  }

  const BACKG_COLOR_1 = '#001e3d',
    BACKG_COLOR_2 = '#000000';

  $p.draw = function () {
    // console.log(`
    //   iterations: ${tree.getLSystem().iterations}
    //   maxDepth: ${tree.getMaxDepth()}
    //   maxRotation: ${tree.getMaxRotation()}
    //   length: ${tree.getJson().length}
    //   `);

    $p.background('#FBFFFA');

    // Translate so that tree is in the center
    $p.translate($p.width / 2, $p.height);
    $p.rotate(Math.PI);

    tree.draw();

    document.getElementById('text-output').innerHTML = tree.getJson();
  }
};

new p5(sketch, 'canvas-cont');

function generateTreeAsync(remTreeCount) {
  if(remTreeCount <= 0) return;

  setTimeout(() => {
    dayConditions.randomSeed++;
    DNA.leafShape = Math.floor(Math.random() * 4);
    DNA.flowerShape = Math.floor(Math.random() * 4);
    new p5(sketch, 'output-container');
    generateTreeAsync(remTreeCount - 1);
  }, 100);
}

generateTreeAsync(40);




document.getElementById('btn-iterate').addEventListener("click", function () {
  tree.getLSystem().iterate();
  _$p.draw();
  document.getElementById('iteration-counter').innerHTML = tree.getLSystem().iterations;
});

const BTCHASH_API_URL = "https://us-central1-plantoid-farm.cloudfunctions.net/api/btchash";
function loadTodaysWeather() {
  const today = new Date();
  const reqUrl = new URL(BTCHASH_API_URL);
  reqUrl.search = new URLSearchParams({
    day: today.getUTCDate(),
    month: today.getUTCMonth()+1,
    year: today.getUTCFullYear()
  }).toString()

  fetch(reqUrl)
    .then(result => result.json())
    .then(btchash => {
      let weather = new Weather(btchash);
      console.log(weather);
    });
}

loadTodaysWeather();