import { DijkstraGraph } from "./dijkstra"

const addNode = new DijkstraGraph()
addNode.addVertex("A")
addNode.addVertex("B")
addNode.addVertex("C")
addNode.addVertex("E")

addNode.addEdge("A", "B", 4) 
addNode.addEdge("A", "C", 2)
addNode.addEdge("B", "D", 1)
addNode.addEdge("C", "D", 3)

/*      4
   A ------ B
   |        |
2  |        | 1
   C -->    D
      3
   */   


addNode.showConnection()
addNode.dijkstra("A")

console.log(addNode.distance)
// console.log(addNode.previous)
// console.log(addNode.visited)

console.log(addNode.getPath("E"))