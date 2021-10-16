class JSONGenerator {

// https://img.plantoid.farm/

  /**
   *
   * @param {string} name Must end in #
   * @param {string} symbol
   * @param {string} description
   * @param {number} seller_fee_basis_points
   * @param {string} collectionName
   * @param {string} collectionFamily
   * @param {string} creatorAddr
   */
  constructor(
      name = "Plantoid #",
      symbol = "PTOID",
      description = "Digital native plants that evolve over time and capture CO2",
      seller_fee_basis_points = 400,
      collectionName = "Plantoids | Alpha edition",
      collectionFamily = "Plantoids",
      creatorAddr = "7Pn9dqr4EtnGy486d71acTVxr4mQjN3gXJWafpRkgQia",
      numMints) {
    if (!name.endsWith("#")) {
      alert("mint name must end in #");
      throw new Error("mint name must end in #");
    }

    this.numMints = numMints;

    this.jsonTemplate = {
      name: name,
      symbol: symbol,
      description: description,
      seller_fee_basis_points: seller_fee_basis_points,
      image: "https://img.plantoid.farm/?",
      animation_url: "",
      external_url: "https://viewer.plantoid.farm/?",
      attributes: [],
      collection: {
        name: collectionName,
        family: collectionFamily
      },
      properties: {
        creators: [
          {
            "address": creatorAddr,
            "share": 100
          }
        ]
      }
    };
  }

  generateJsonForMint(dna, number) {

    let urlParams = Object.entries(dna).map(e => e.join('=')).join('&');

    // TODO image
    let jsonMint = JSON.parse(JSON.stringify(this.jsonTemplate));

    let paddingZeros = ("" + this.numMints).length;
    let mintNameSuffix = (""+number).padStart(paddingZeros, '0');
    jsonMint.name = jsonMint.name + mintNameSuffix;
    jsonMint.image = jsonMint.image + urlParams;
    jsonMint.external_url = jsonMint.external_url + urlParams;

    jsonMint.attributes = dna.toAttrArray();

    return jsonMint;
  }
}

// {
//   "name": "Desolate Space (devnet) #004",
//   "symbol": "DSOLS",
//   "description": "lost in space...",
//   "seller_fee_basis_points": 500,
//   "image": "image.png",
//   "animation_url": "",
//   "external_url": "",
//   "attributes": [
//     {
//       "trait_type": "sun-size",
//       "value": "sm"
//     },
//     {
//       "trait_type": "sun-pos",
//       "value": "full"
//     },
//     {
//       "trait_type": "mountains",
//       "value": "rocky"
//    },
//    {
//       "trait_type": "palette",
//       "value": "blood"
//     }
//   ],
//   "collection": {
//      "name": "Desolate Spaces | Alpha Centauri",
//      "family": "Desolate Spaces"
//   },
//   "properties": {
//     "files": [
//       {
//         "uri": "image.png",
//         "type": "image/png"
//       }
//     ],
//     "category": "image",
//     "creators": [
//       {
//         "address": "GDyi8CkLQ41dYM1isjLwKCYNptGGDs4fEtd9HwVju5Md",
//         "share": 100
//       }
//     ]
//   }
// }