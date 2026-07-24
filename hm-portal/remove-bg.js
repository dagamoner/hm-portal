const { Jimp } = require('jimp');

async function removeBg() {
  const image = await Jimp.read('public/images/logo.png');
  
  // Make white pixels transparent
  image.scan((x, y, idx) => {
    const r = image.bitmap.data[idx];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    
    // white threshold
    if (r > 240 && g > 240 && b > 240) {
      image.bitmap.data[idx + 3] = 0; // alpha
    }
  });

  await image.write('public/images/logo-transparent.png');
  console.log("Success");
}

removeBg().catch(console.error);
