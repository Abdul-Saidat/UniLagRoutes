// Initialize distances — A = 0, everything else Infinity.
// Initialize previous — everything starts as null.
// Keep track of visited nodes.
// Find the unvisited node with the smallest distance.
// Inspect its neighbours.
// Calculate the candidate distance:
// current distance + edge weight
// Compare candidate vs current distance.
// If candidate is smaller, update:
// distance
// previous
// Repeat until you've processed the relevant nodes.
// Reconstruct the path using previous.

interface Edge {
    node: string;
    weight: number;
}

export class DijkstraGraph {
    numberOfNodes: number;
    adjacentList: Record<string, Edge[]>;
    distance: Record<string, number>;
    previous: Record<string, string | null>
    visited: Record<string, boolean> = {}
    constructor() {
        this.numberOfNodes = 0
        this.adjacentList = {}
        this.distance = {}
        this.previous = {}
    }

    // this method answers: what is the shortest distance from the starting node to every other node, and which node came before each one?
    // dijkstra(startNode: string) {
    //     const allNodes = Object.keys(this.adjacentList)
    //     for (const node of allNodes) {
    //         if (node == startNode) {
    //             this.distance[node] = 0
    //             this.previous[node] = null
    //             this.visited[node] = false
    //         } else {
    //             this.distance[node] = Infinity
    //             this.previous[node] = null
    //             this.visited[node] = false
    //         }
    //     }

    //     while (Object.values(this.visited).some(value => value === false)) {
    //         let currentNode = ""
    //         for (const node of allNodes) {
    //             if (this.visited[node] == false) {
    //                 if (!currentNode) {
    //                     currentNode = node
    //                 } else if (this.distance[node] < this.distance[currentNode]) {
    //                     currentNode = node
    //                 }
    //             }
    //         }
    //         if (this.distance[currentNode] === Infinity) {
    //             break
    //         } else {
    //             for (const neighbour of this.adjacentList[currentNode]) {
    //                 if (!this.visited[neighbour.node]) {
    //                     const candidate = this.distance[currentNode] + neighbour.weight
    //                     if (candidate < this.distance[neighbour.node]) {
    //                         this.distance[neighbour.node] = candidate
    //                         this.previous[neighbour.node] = currentNode
    //                     }
    //                 }
    //             }
    //         }
    //         this.visited[currentNode] = true
    //     }
    // }

    dijkstra(startNode: string) {
        const allNodes = Object.keys(this.adjacentList)
        for (const node of allNodes) {
            this.distance[node] = node === startNode ? 0 : Infinity
            this.previous[node] = null
            this.visited[node] = false
        }

        const frontier = new Set<string>([startNode])

        while (frontier.size > 0) {
            // pick the frontier node with the smallest distance
            let currentNode = ""
            let best = Infinity
            for (const node of frontier) {
                if (this.distance[node] < best) {
                    best = this.distance[node]
                    currentNode = node
                }
            }

            frontier.delete(currentNode)
            this.visited[currentNode] = true

            for (const neighbour of this.adjacentList[currentNode]) {
                if (this.visited[neighbour.node]) continue
                const candidate = best + neighbour.weight
                if (candidate < this.distance[neighbour.node]) {
                    this.distance[neighbour.node] = candidate
                    this.previous[neighbour.node] = currentNode
                    frontier.add(neighbour.node)
                }
            }
        }
    }

    // takes the destination and follows previous backwards
    getPath(destinationNode: string): string[] | null {
        if (this.distance[destinationNode] === Infinity || this.distance[destinationNode] === undefined) return null
        const nodes: string[] = []
        nodes.push(destinationNode)
        let currentNode = destinationNode
        while (this.previous[currentNode] !== null) {
            const previousNode = this.previous[currentNode]
            currentNode = previousNode
            nodes.push(currentNode)
        }
        const finalPath = nodes.reverse()
        return finalPath

    }

    addVertex(node: string) {
        if (!this.adjacentList[node]) {
            this.adjacentList[node] = []
            this.numberOfNodes++;
            return this.adjacentList;
        }
        return "Node already exists"
    }

    addEdge(node1: string, node2: string, weight: number) {
        if (!this.adjacentList[node1] || !this.adjacentList[node2]) return "Both nodes have to be a member"

        this.adjacentList[node1].push({ node: node2, weight: weight })
        this.adjacentList[node2].push({ node: node1, weight: weight })
        return this.adjacentList
    }

    showConnection() {
        const allNodes = Object.keys(this.adjacentList)

        for (const node of allNodes) {
            const nodeConnections = this.adjacentList[node]
            let connections = ""
            let vertex;
            for (vertex of nodeConnections) {
                connections += vertex.node + " " + "(" + vertex.weight + ")" + " "
            }
            console.log(node + "-->" + connections);
        }
    }
}