# Usage
```javascript
var TopoSort = require('topo-sort');

var tsort = new TopoSort();
tsort.add('a', ['b', 'c']);
tsort.add('d', ['a', 'b', 'c']);
// Output d,a,c,b
var l = tsort.sort();
```
