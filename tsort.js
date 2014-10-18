'use strict';
var TopoSort = function(){
  // store the number of incoming edges of the nodes.
  this.ins = Object.create(null);
  // The key points to the values
  this.map = Object.create(null);
}
module.exports = TopoSort;

/**
 * Add edges(or an edge, if values is non-array).
 * @param {[*]} node Non null object.
 * @param {[Object]} nodes The other nodes being pointed to, item or elements in it cannot be null or empty string.
 */
TopoSort.prototype.add = function(node, nodes){
  nodes = Array.isArray(nodes) ? nodes : [nodes];

  // initialize node's incoming edges count.
  // The current node has 0 incoming edge.
  this.ins[node] = this.ins[node] || 0;
  // And other nodes has, by default 1 incoming edge.
  nodes.forEach(function(n){
    this.ins[n] = this.ins[n] ? this.ins[n]+1 : 1;
  }.bind(this));

  this.map[node] = this.map[node] ? this.map[node].concat(nodes) : nodes;
};

/**
 * Implementation of http://en.wikipedia.org/wiki/Topological_sorting#Algorithms
 * O(|V|+|E|)
 * Extra cycle checking step might cost a bit more.
 * Reference: http://courses.cs.washington.edu/courses/cse326/03wi/lectures/RaoLect20.pdf
 * @return {[Array]} Sorted list
 */
TopoSort.prototype.sort = function(){
  // Set of all nodes with no incoming edges
  var s = [];
  // The list contains the final sorted nodes.
  var l = [];

  // just a node
  var node;

  // Find the first 0 incoming edge node. If not found, there exist a cycle dependency, cannot be sorted.
  // This error case can be handled by check incoming edges count in next step.
  for(node in this.ins){
    if(this.ins[node] === 0){
      // Any node does not exist in the map, will have 0 incoming edges. Save sometime when final sort validation.
      delete this.ins[node];
      s.push(node);
    }
  }

  while(s.length !== 0){
    var n = s.pop();
    l.push(n);

    if(this.map[n]){
      this.map[n].forEach(function(m){
        // decrease all adjacent nodes' incoming edge count. If any of them are 0,
        // put them in to set s.
        if(--this.ins[m] === 0){
          s.push(m);
        }
      }.bind(this));
    }
  }

  // Validate if the sorting has completed successfully.
  // All the node should have 0 incoming edges, any node's incoming edges count is non-zero,
  // there is a cycle among those nodes. This graph cannot be sorted.
  var cycle = [];
  for(node in this.ins){
    if(this.ins[node] !== 0){
      cycle.push(node);
    }
  }
  if(cycle.length !== 0){
    throw new Error('At least 1 cycle dependency in nodes: ' + cycle + '. Graph cannot be sorted!');
  }

  return l;
};