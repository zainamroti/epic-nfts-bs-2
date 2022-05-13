
// This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
// So, we make a baseSvg variable here that all our NFTs can use.
// We split the SVG at the part where it asks for the background color.
export const svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
export const svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

// export const metaData = {
//     "name": combinedWord,  // We set the title of our NFT as the generated word.
//     "description": "A highly acclaimed collection of Legal NFTs.", "image": "data:image/svg+xml;base64",
//     "image": ''
// };

// I create three arrays, each with their own theme of random words.
// Pick some random funny words, names of anime characters, foods you like, whatever! 
const firstWords = ["Goku", "Naruto", "Zain", "Spiderman", "Ironman", "Minato"];
const secondWords = ["Beat", "Broke", "Fought", "Zoned", "Helped", "Met"];
const thirdWords = ["Tom", "Jerry", "Pinkpenther", "Thanos", "Freeza", "Madara"];


// Get fancy with it! Declare a bunch of colors.
const colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];

// I create a function to randomly pick a word from each array.
export function pickRandomFirstWord() {
    const rand = random(firstWords.length);
    return firstWords[rand];
}

export function pickRandomSecondWord() {
    const rand = random(secondWords.length);
    return secondWords[rand];
}

export function pickRandomThirdWord() {
    const rand = random(thirdWords.length);
    return thirdWords[rand];
}

// Same old stuff, pick a random color.
export function pickRandomColor() {
    const rand = random(colors.length);
    return colors[rand];
}

function random(limit) {
    return Math.floor(Math.random() * limit);;
}


export function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(new Blob(file));
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Reader Error: ', error);
    };
}
