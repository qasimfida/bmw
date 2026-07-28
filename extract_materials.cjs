const fs = require('fs');

function parse() {
  const buffer = fs.readFileSync('./src/assets/model/ferrari.glb');
  const magic = buffer.toString('utf8', 0, 4);
  const chunkLength = buffer.readUInt32LE(12);
  const jsonChunk = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonChunk);
  console.log("Materials:");
  if (json.materials) {
    json.materials.forEach(m => console.log(" - " + m.name));
  }
}
parse();
