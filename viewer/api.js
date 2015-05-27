
var box = require('./box');

var category = {
  FRONT: [0],
  BACK: [1],
  LEFT: [2],
  RIGHT: [3],
  TOP: [4],
  BOTTOM: [5],
  SIDES: [0, 1, 2, 3]
};

function getBoxByTag(node, tag) {
  var box = [];
  console.log('tag is in?', tag in node.tags, node.tags);
  if (node.tags.indexOf(tag) != -1) {
    box.push(node);
  }

  for (var i = 0; i < node.faces.length; i++) {
    for (var j = 0; j < node.faces[i].length; j++) {
      box = box.concat(getBoxByTag(node.faces[i][j], tag));
    }
  }
  console.log('get by tag! tag = ', tag, 'res = ', box);
  return box;
}

function attachBoxToFace(node, faces, box) {
  for (var i = 0; i < faces.length; i++) {
    node.faces[faces[i]].push(box); 
  }
}

function addTags(node, tag) {
  node.tags.push(tag);
}

module.exports = {
  createBox: box.create,
  attachBoxToFace: attachBoxToFace,
  addTags: addTags,
  getBoxByTag: getBoxByTag
};
for (var name in category) module.exports[name] = category[name];