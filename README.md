# gl-tree

Build complex 3D shapes by describing a tree of boxes. 
Experiment project for better understanding MVP matrices.

[Demo](http://jspdown.github.io/gl-tree/)

![](https://github.com/jspdown/gl-tree/blob/master/images/step2.png)

3D shapes can be described using the following syntax:

```javascript
var root = box.create(vec3.fromValues(1.0, 0, 0), [1, 1, 1]);

  var box = require('./box');

  var root =      box.create(vec3.fromValues(1.0, 0, 0),    [1, 1, 1]);

  var back =      box.create(vec3.fromValues(0, 0, 0),      [0.5, 0.5, 0.5]),
      top =       box.create(vec3.fromValues(0, 0, 0),      [0.6, 0.5, 0.2]),
      topright =  box.create(vec3.fromValues(0, 0, 0),      [0.5, 0.5, 0.5]),
      backback =  box.create(vec3.fromValues(0.5, 0.5, 0),  [0.4, 0.4, 1]);
    
  box.addChild(back, box.faces.FRONT, backback);  
  box.addChild(back, box.faces.BACK, backback);  
  box.addChild(top, box.faces.LEFT, topright);
  box.addChild(top, box.faces.RIGHT, topright);

  box.addChild(root, box.faces.FRONT, back);
  box.addChild(root, box.faces.BOTTOM, top);
  box.addChild(root, box.faces.BACK, back);
  box.addChild(root, box.faces.TOP, top);
```

## Build & Run

```shell
$> npm install -g grunt-cli
$> npm install
$> grunt
$> cd dist && python -m SimpleHTTPServer
```

## Dependencies:
 
- stack.gl
- glMatrix(2.x) 
- WebGL
- browserify
