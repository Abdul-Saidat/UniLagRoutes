import { DijkstraGraph } from "./dijkstra";

// remember, GeoJSON stores coordinates as: [longitude, latitude]
// using the Haversine formula to calculate the distance between two consecutive coordinates on a UNILAG road (geographic coordinates)
function calculateDistance(point1: number[], point2: number[]) {
    const lon1 = point1[0]
    const lat1 = point1[1]
    
    const lon2 = point2[0]
    const lat2 = point2[1]
    
    const R = 6371000;
    // the Haversine formula uses radians, but GeoJSON coordinates are in degrees, so we convert to radians
    const toRadians = (degrees: number) => degrees * (Math.PI / 180)
    
    const lonDiff = toRadians(lon1) - toRadians(lon2)
    const latDiff = toRadians(lat1) - toRadians(lat2)
    
    // implementing the Haversine formula
    const a = Math.sin(latDiff / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(lonDiff / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c
    return d
}
(window as any).calculateDistance = calculateDistance;

// Nearest-vertex lookup.
// It receives a landmark's coordinates and returns the closest vertex in the road graph.

export function findNearestVertex(landmarkCoordinates, graph) {
    let minimumDistance = Infinity
    let minimumVertex = ""

    const keys = Object.keys(graph.adjacentList)

    for (const vertex of keys) {
        const originalVertex = vertex.split(",").map(Number)
        const distance = calculateDistance(landmarkCoordinates, originalVertex)

        if (distance < minimumDistance) {
            minimumDistance = distance
            minimumVertex = vertex
        }
    }

    return minimumVertex

}

(window as any).findNearestVertex = findNearestVertex;

export function buildGraph(geojson) {
    const graph = new DijkstraGraph()
    geojson.features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates
        coordinates.forEach((coordinate: number[]) => {
            const node = coordinate.join(",")
            graph.addVertex(node)
        })
        for (let i = 0; i < coordinates.length - 1; i++) {
            const currentCoordinate = coordinates[i]
            const nextCoordinate = coordinates[i + 1]

            const currentNode = currentCoordinate.join(",")
            const nextNode = nextCoordinate.join(",")

            const distance = calculateDistance(currentCoordinate, nextCoordinate)
            graph.addEdge(currentNode, nextNode, distance)
        }
    })

    return graph
}

(window as any).buildGraph = buildGraph;