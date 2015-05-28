
function Grid(row, col) {
  this.row = row;
  this.col = col;
  this._grid = [];
}

Grid.prototype.attach = function (x, y, obj, face) {
  this._grid.push({
    x: x,
    y: y,
    obj: obj,
    face: face
  });
};

Grid.prototype.computeSizePosition = function (parentSize, parentPosition) {
  // call elm.obj.align(elm.face);
  // call elm.obj.computeSizePosition(size, position);
};

module.exports = Grid;