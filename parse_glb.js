const fs = require('fs');

function parse() {
  const buffer = fs.readFileSync('./src/assets/model/ferrari.glb');
  const magic = buffer.toString('utf8', 0, 4);
  if (magic !== 'glTF') {
    console.log('Not a valid GLB file');
    return;
  }
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.toString('utf8', 16, 20);
  if (chunkType !== 'JSON') {
    console.log('First chunk is not JSON');
    return;
  }
  const jsonChunk = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonChunk);
  console.log("Materials:");
  if (json.materials) {
    json.materials.forEach(m => console.log(" - " + m.name));
  }
}
parse();
