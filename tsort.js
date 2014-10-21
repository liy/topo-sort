'use strict';
var TopoSort = function(){
  // store the number of incoming edges of the nodes.
  this.ins = Object.create(null);
  // The key node points to the value nodes
  this.map = Object.create(null);
}
module.exports = TopoSort;

/**
 * Add edges(or one edge, if values is non-array).
 * @param {[*]} node Non null object.
 * @param {[Object]} nodes The other nodes being pointed to, item or elements in it must not be null or empty string.
 */
TopoSort.prototype.add = function(node, nodes){
  nodes = Array.isArray(nodes) ? nodes : [nodes];

  // initialize node's incoming edges count.
  // The current node has 0 incoming edge.
  this.ins[node] = this.ins[node] || 0;

  // And other nodes, which by default have 1 incoming edge, or if node already exist increase its incoming edge count.
  for(var i=0; i<nodes.length; ++i){
    var n = nodes[i];
    this.ins[n] = this.ins[n] ? this.ins[n]+1 : 1;
  }

  this.map[node] = this.map[node] ? this.map[node].concat(nodes) : nodes;
};

/**
 * Sort the graph. Circular graph throw an error with the circular nodes info.
 * Implementation of http://en.wikipedia.org/wiki/Topological_sorting#Algorithms
 * Reference: http://courses.cs.washington.edu/courses/cse326/03wi/lectures/RaoLect20.pdf
 * @return {[Array]} Sorted list
 */
TopoSort.prototype.sort = function(){
  // Set of all nodes with no incoming edges
  var s = [];
  // The list contains the final sorted nodes.
  var l = [];

  // just a common use node variable
  var node;

  // number of unsorted nodes. If it is not zero at the end, this graph is a circular graph and cannot be sorted.
  var unsorted = 0;

  // Find all the initial 0 incoming edge nodes. If not found, this is is a circular graph, cannot be sorted.
  for(node in this.ins){
    // Count the total number of unsorted nodes.
    ++unsorted;
    if(this.ins[node] === 0){
      s.push(node);
    }
  }

  while(s.length !== 0){
    var n = s.pop();
    l.push(n);

    // decrease unsorted count, node n has been sorted.
    --unsorted;

    // n node might have no dependency, so have to check it.
    if(this.map[n]){
      // decease n's adjacent nodes' incoming edges count. If any of them has 0 incoming edges, push them into s get them ready for detaching from the graph.
      var len = this.map[n].length;
      for(var i=0; i<len; ++i){
        var m = this.map[n][i];
        // Any adjacent node has 0 incoming edges?
        if(--this.ins[m] === 0){
          s.push(m);
        }
      }
    }
  }

  // If there are unsorted nodes left, this graph is a circular graph and cannot be sorted.
  // At least 1 circular dependency exist in the nodes with non-zero incoming edges.
  if(unsorted !== 0){
    var circular = [];
    for(node in this.ins){
      if(this.ins[node] !== 0){
        circular.push(node);
      }
    }
    throw new Error('At least 1 circular dependency in nodes: \n\n' + circular.join('\n') + '\n\nGraph cannot be sorted!');
  }

  return l;
};