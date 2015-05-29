# gl-procedural-building
Procedurally generated buildings

[Demo](http://jspdown.github.io/gl-procedural-building/)

![](https://github.com/jspdown/gl-procedural-building/blob/master/images/step2.png)


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

## TODO:

- Define a gramar :)

## Dependencies:
 
- stack.gl
- glMatrix(2.x) 
- WebGL
- browserify
