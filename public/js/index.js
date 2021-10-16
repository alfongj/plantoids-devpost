const WIDTH = 400;
const HEIGHT = 350;

// let treeState = {
//   hydrationLvl: 0.5,
//   airLvl: 1,
//   sunlightLvl: 1,
// }

const treeFinals = ($p, tree) => {
  const dna = tree.getDNA();
  console.log(dna)
  return {
    'S': ({ index, part }) => {
      let depthLvl = tree.getDepthForIdx(index);

      $p.noStroke();
      $p.fill($p.lerpColor(
        $p.color(part.color),
        $p.color('black'),
        depthLvl * 0.15
      ));
      $p.quad(-part.width / 2, 0,
        part.width / 2, 0,
        part.width * 0.9 / 2, part.height,
        -part.width * 0.9 / 2, part.height);
      $p.translate(0, part.height - 0.5)
    },
    'X': () => {
      let leafImage = leafImages[dna.leafShape];
      let flowerImage = flowerImages[dna.flowerShape];

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
  }
};


leafImages = [];
flowerImages = [];

let sketch = function ($p, parentElem) {
  $p.preload = function () {
    leafImages[0] = $p.loadImage('img/leaf1.png');
    leafImages[1] = $p.loadImage('img/leaf2.png');
    leafImages[2] = $p.loadImage('img/leaf3.png');
    leafImages[3] = $p.loadImage('img/leaf4.png');

    flowerImages[0] = $p.loadImage('img/flower1.png');
    flowerImages[1] = $p.loadImage('img/flower2.png');
    flowerImages[2] = $p.loadImage('img/flower3.png');
    flowerImages[3] = $p.loadImage('img/flower4.png');
  }

  $p.setup = function () {
    const canvas = $p.createCanvas(WIDTH, HEIGHT);
    canvas.parent(parentElem);
    $p.noLoop();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nftMetadataUrl = urlParams.get("n");
    if (nftMetadataUrl)
      initTreeWithMetadataUrl($p, nftMetadataUrl);
    else {
      initTreeWithDNA($p, new DNA());
    }
  }
};

function startPrinting(count, remaining, _$p) {
  if (remaining == 0) return;

  setTimeout(() => {
    let dnaMint = new JSONGenerator().generateJsonForMint(new DNA(), count);
    _$p.saveJSON(dnaMint, `${count}.json`);
    startPrinting(count + 1, remaining - 1, _$p);
  }, 100);
}

new p5(sketch, 'canvas-cont');


const BTCHASH_API_URL = "https://us-central1-plantoid-farm.cloudfunctions.net/api/btchash";
// Loads today's weather and then inits the tree
function initTreeWithDNA($p, dna) {
  const today = new Date();
  const reqUrl = new URL(BTCHASH_API_URL);
  reqUrl.search = new URLSearchParams({
    day: today.getUTCDate(),
    month: today.getUTCMonth() + 1,
    year: today.getUTCFullYear()
  }).toString()

  fetch(reqUrl)
    .then(result => result.json())
    .then(btchash => {
      const todaysWeather = new Weather(btchash);
      const tree = new Tree(dna);
      tree.iterateToToday();
      tree.setFinals(treeFinals($p, tree));
      drawScene($p, tree, todaysWeather);
    });
}

function initTreeWithMetadataUrl($p, nftMetadataUrl) {
  fetch(nftMetadataUrl)
    .then(result => result.json())
    .then(nftMeta => {
      const dna = new DNA(nftMeta);
      initTreeWithDNA($p, dna);
    });
}

const WEATHER_TEXT_SIZE = 64;
const WEATHER_TEXT_COLOR = "#000000";

function drawScene($p, tree, weather) {
  $p.background('#FBFFFA');

  $p.textSize(WEATHER_TEXT_SIZE);
  $p.fill(WEATHER_TEXT_COLOR)
  $p.text(weather.getEmoji(), $p.width - 80, 80);
  $p.select("#plant-info").removeClass("hidden")
  $p.select("#weather-info").html(weather.toString());
  $p.select("#dna-info").html(JSON.stringify(tree.getDNA(), null, 4));

  // Translate so that tree is in the center
  $p.translate($p.width / 2, $p.height);
  $p.rotate(Math.PI);
  tree.draw();
}