import * as graphM from './graph.js';

window.runDijkstra = async function runDijkstra() {
  graphM.resetLinkHighlights();

  const links = await graphM.getAllLinksAsList();

  const graph = convert(links);
  const start = Object.keys(graph)[0];
  const end = Object.keys(graph)[Object.keys(graph).length - 1];

  console.log(links);
  console.log(graph);

  dijkstra(graph, start, end);
}



// const links = [
//   {source: "a", target: "b", cost: 2},
//   {source: "a", target: "c", cost: 4},
//   {source: "b", target: "c", cost: 1},
//   {source: "b", target: "d", cost: 7},
//   {source: "c", target: "d", cost: 3},
//   {source: "c", target: "e", cost: 5},
//   {source: "d", target: "e", cost: 1}
// ];

async function convertNew(source, target){
  // graphM.highlightLink('B',target,'green');
  console.log(source, target)
  if(source != target && source != undefined && target != undefined){
    // graphM.highlightLink(target,source,'green');
    graphM.highlightLink(source,target,'green');

    await graphM.sleep(2000);
    // graphM.expireLinkHighlight(target,source);
    graphM.expireLinkHighlight(source,target);
  }
}

async function convertNew2(text){
  graphM.resetLinkHighlights();
  const letters = text.split(" ").filter(word => word.length === 1);
  console.log(letters)
  for (let i = 0; i < letters.length - 1; i++) {
    if(letters[i+1] != 'a'){
      // graphM.highlightLink(letters[i],letters[i+1],'green');
      graphM.highlightLink(letters[i+1],letters[i],'green');

      await graphM.sleep(2000);
    }
  }
}


const convertText = (text) => {
  // const links = [];
  // console.log("convert");
  text.split("\n").forEach(async line => {
    const [source, costStr, target] = line.split(/->|\sthrough\s/);
    // const cost = parseInt(costStr);
    // console.log(source, target)
    if(source === target)
      return;
    else
      graphM.highlightLink(source,target,'green');

      // graphM.highlightLink(source,target,'green');

    await graphM.sleep(2000);
    graphM.expireLinkHighlight(source,target);
      // graph.
    // links.push({source: source, target: target, cost: cost});
  });
  // links.shift();
  // return links;
} 
//covnerts file type for graphing to 
const convert = (links) => {
  const graph = {};
  for (const link of links) {
    const {source, target, cost} = link;
    if (!graph[source]) graph[source] = {};
    graph[source][target] = cost;
    if (!graph[target]) graph[target] = {};
    graph[target][source] = cost;
  }
  return graph;
}

// const graph = {
//     a: { b: 5, c: 2 },
//     b: { a: 5, c: 7, d: 8 },
//     c: { a: 2, b: 7, d: 4, e: 8 },
//     d: { b: 8, c: 4, e: 6, f: 4 },
//     e: { c: 8, d: 6, f: 3 },
//     f: { e: 3, d: 4 },
//   };
  
const dijkstra = async (graph, start, end) => {
  const visited = new Set();
  const distances = {};
  const previous = {};

  // Initialize distances to Infinity and previous nodes to null
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  // Helper function to get the node with the smallest distance
  function getSmallestNode() {
    let smallestDistance = Infinity;
    let smallestNode = null;
    for (const node in distances) {
      if (!visited.has(node) && distances[node] < smallestDistance) {
        smallestDistance = distances[node];
        smallestNode = node;
      }
    }
    return smallestNode;
  }

  // Main loop
  let currentNode = getSmallestNode();
  while (currentNode !== null) {
    // Update distances to neighbors of current node
    for (const neighbor in graph[currentNode]) {
      const distance = graph[currentNode][neighbor];
      const totalDistance = distances[currentNode] + distance;
      if (totalDistance < distances[neighbor]) {
        console.log(currentNode + neighbor)
        await convertNew(currentNode, neighbor)
        distances[neighbor] = totalDistance;
        previous[neighbor] = currentNode;
      }
    }

    // Mark current node as visited
    visited.add(currentNode);

    // Get the next smallest unvisited node
    currentNode = getSmallestNode();

    // Print the cost table
    console.log("Table of costs:");
    for (const node in distances) {
      console.log(`${node}-> ${distances[node]} through ${previous[node]}`);
    }
    // console.log("------------------");
  }

  // Build the path from start to end
  const path = [];
  let node = end;
  while (node !== null) {
    path.unshift(node);
    node = previous[node];
  }

  // Return the shortest path and its total weight
  const weight = distances[end];
  const output = `Shortest path: ${path.join(" -> ")} with weight ${weight}`;
  console.log(output);

  convertNew2(output);
  // return { path, weight };
}
