UNILAG Campus Navigation – Building the Road Network
1. What are we trying to achieve?

The goal is to build a campus navigation system that:

Allows users to select a starting location and destination.
Calculates the shortest walking route between them.
Displays the route on a map.

To achieve this, we need to represent the campus road network as a weighted graph and use Dijkstra's algorithm to find the shortest route.

2. Understanding the GeoJSON data

We obtained road data from OpenStreetMap using Overpass Turbo.

The exported data is in GeoJSON format.

GeoJSON represents geographic information using features. Each road is represented as a feature containing:

Properties: information about the road, such as its name and highway type.
Geometry: the actual geographic shape of the road.
Coordinates: the geographical positions that make up the road.

For example:

{
  geometry: {
    type: "LineString",
    coordinates: [
      [3.3793339, 6.5056988],
      [3.3794835, 6.5062155],
      [3.3795335, 6.5063053]
    ]
  }
}

Important: GeoJSON stores coordinates in this order:

[longitude, latitude]

A LineString contains an ordered sequence of coordinates representing a road.

3. Understanding graph representation

Before building the graph, we need to understand three concepts.

Vertex (Node): Represents a location or point in the road network.

Edge: Represents a direct connection between two vertices.

Weight: Represents the cost of travelling along an edge. In our application, the weight is the distance in metres between two consecutive coordinates.

For example, consider a road with five coordinates:

A ─── B ─── C ─── D ─── E

This produces:

5 vertices.
4 edges.

Each edge has a weight representing the distance between its two connected vertices.

We use an adjacency list to represent the graph.

For example:

{
  "A": [
    { node: "B", weight: 100 }
  ],
  "B": [
    { node: "A", weight: 100 },
    { node: "C", weight: 150 }
  ]
}

This means:

A connects to B, with a distance of 100 metres.
B connects to A and C.
The graph is bidirectional because our addEdge() method creates connections in both directions.
4. Calculating distances using the Haversine formula

Our GeoJSON coordinates are geographical coordinates, not ordinary Cartesian coordinates.

Therefore, we cannot simply subtract longitude and latitude values and treat the result as a distance in metres.

We use the Haversine formula to calculate the approximate distance between two geographic coordinates on the Earth's surface.

The formula is:

$$ a = \sin^2(\frac{\Delta\phi}{2}) + \cos(\phi_1)\cos(\phi_2) \sin^2(\frac{\Delta\lambda}{2}) $$ $$ c = 2\operatorname{atan2}(\sqrt a,\sqrt{1-a}) $$ $$ d = R \times c $$

Where:

\(\phi\) represents latitude in radians.
\(\lambda\) represents longitude in radians.
\(R\) is the Earth's approximate radius (6,371,000 metres).
\(d\) is the calculated distance in metres.
Why convert degrees to radians?

JavaScript's trigonometric functions (Math.sin, Math.cos, Math.atan2) work with radians, while GeoJSON provides coordinates in degrees.

We therefore created:

const toRadians = (degrees: number) =>
    degrees * (Math.PI / 180);

This converts degrees to radians.

What does calculateDistance() do?

It:

Receives two geographic coordinates.
Extracts their longitude and latitude.
Converts the coordinates from degrees to radians.
Applies the Haversine formula.
Returns the distance between the two points in metres.

For example, we tested:

calculateDistance(
  [3.3793339, 6.5056988],
  [3.3813778, 6.5072071]
);

The result was approximately 281.28 metres.

5. Building the graph from GeoJSON

This is where buildGraph() comes in.

Its responsibility is to convert our GeoJSON road data into a weighted graph that Dijkstra's algorithm can understand.

We used the DijkstraGraph class we had already implemented.

Step 1: Create a graph instance
const graph = new DijkstraGraph();

This creates an empty graph.

Step 2: Iterate through the GeoJSON features
geojson.features.forEach((feature) => {
    // Process each road
});

Each feature represents a road.

We iterate through every road because we need to extract its coordinates and convert them into graph vertices and edges.

Step 3: Extract the coordinates
const coordinates = feature.geometry.coordinates;

This gives us the ordered sequence of geographic coordinates representing the current road.

Step 4: Create vertices
coordinates.forEach((coordinate) => {
    const node = coordinate.join(",");
    graph.addVertex(node);
});

We convert each coordinate array into a string.

For example:

[3.3793339, 6.5056988]

becomes:

"3.3793339,6.5056988"

Why?

Our graph uses strings as vertex identifiers. Converting coordinates into strings allows us to use their geographic positions as unique node keys.

We then pass each node to addVertex().

Our addVertex() method checks whether the node already exists before adding it.

This is important because different road features may share the same coordinate.

Instead of creating duplicate vertices, they can reference the same graph vertex.

Step 5: Create edges

After creating the vertices, we connect consecutive coordinates.

for (let i = 0; i < coordinates.length - 1; i++) {
    const currentCoordinate = coordinates[i];
    const nextCoordinate = coordinates[i + 1];

    const currentNode = currentCoordinate.join(",");
    const nextNode = nextCoordinate.join(",");

    const distance = calculateDistance(
        currentCoordinate,
        nextCoordinate
    );

    graph.addEdge(currentNode, nextNode, distance);
}

Let's understand the logic.

Why coordinates.length - 1?

We are connecting each coordinate to the next one.

If there are five coordinates, the last coordinate has no next coordinate. Therefore, we stop at the second-to-last index.

Why calculateDistance()?

We need to know the distance between the current coordinate and the next coordinate. That distance becomes the edge's weight.

Why addEdge()?

It connects the two vertices and stores their distance as the edge weight.

Our addEdge() method creates connections in both directions.

Step 6: Return the graph
return graph;

After processing all the road features, we return the completed graph.

We need this because other parts of our application, particularly the routing functionality, need access to the graph.

6. Running Dijkstra's algorithm

Now that we have a weighted graph, we can use Dijkstra's algorithm.

Dijkstra's algorithm finds the shortest path from a starting vertex to other reachable vertices in a weighted graph with non-negative edge weights.

We tested it using:

Starting coordinate:

3.3793339,6.5056988

Destination coordinate:

3.3813778,6.5072071

First, we ran:

graph.dijkstra("3.3793339,6.5056988");

The method returned undefined.

This wasn't an error. Our dijkstra() method updates the graph's internal distance information rather than explicitly returning a value.

We then inspected:

graph.distance;

This returned an object containing the shortest known distances from our starting vertex to other vertices.

For example, the distance associated with a vertex represents the shortest known route from the starting point to that vertex.

Retrieving the actual path

Calculating the shortest distances is not the same as retrieving the sequence of vertices that make up a route.

That's why we have getPath().

We ran:

graph.getPath("3.3813778,6.5072071");

It returned an array containing eight coordinates.

These coordinates represent the ordered sequence of vertices from our starting point to our destination.

In other words, Dijkstra finds the shortest route, while getPath() retrieves the vertices that make up that route.

7. What have we achieved so far?

Our current implementation can:

Load real road data from GeoJSON.
Extract geographic coordinates.
Represent coordinates as graph vertices.
Connect consecutive vertices using weighted edges.
Calculate edge distances using the Haversine formula.
Build a weighted adjacency-list graph.
Run Dijkstra's algorithm.
Retrieve the shortest route as an ordered sequence of coordinates.

We have successfully tested this using actual UNILAG road data.

8. Important limitations to understand

Our current implementation makes some assumptions:

Every edge is bidirectional. Real roads may have access restrictions.
We rely on identical coordinate values to connect road features.
Our selected OpenStreetMap highway types do not automatically guarantee pedestrian access.
The Haversine formula estimates the distance between two points along the Earth's surface; it does not account for every real-world walking condition.

These are things we can improve as the application develops.

Test Yourself Before Moving On

Don't just copy these notes. Close them and see if you can answer these questions in your own words.

Why are we converting GeoJSON coordinates into strings before adding them to the graph?
What is the difference between a vertex, an edge and a weight?
Why are we using the Haversine formula instead of ordinary subtraction?
Why does our loop stop at coordinates.length - 1?
What happens when two different roads share the same coordinate?
What exactly does buildGraph() return?
What is the difference between graph.distance and graph.getPath()?
Why did graph.dijkstra() return undefined even though it executed successfully?

One final thing: I want you to be able to explain the entire process without memorising the code.

The big picture is:

GeoJSON → Extract coordinates → Create vertices → Calculate distances → Create weighted edges → Build graph → Run Dijkstra → Retrieve shortest path.