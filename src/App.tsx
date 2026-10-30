import { useEffect, useState } from "react";
import "./App.css";
import { DijkstraGraph } from "./algorithms/dijkstra";
import CampusMap from "./components/CampusMap";
import { buildGraph, findNearestVertex } from "./algorithms/buildGraph";
import { locations } from "./data/locations";

// const locations = [
//   "Main Gate",
//   "Faculty of Science",
//   "J.F. Ade Ajayi Auditorium",
// ];

function App() {
  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [path, setPath] = useState<string[] | null>(null);
  const [fullgraph, setFullGraph] = useState<DijkstraGraph | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    [],
  );

  useEffect(() => {
    fetch("/data/unilag-paths.geojson")
      .then((response) => response.json())
      .then((data) => {
        const newGraph = buildGraph(data);
        setFullGraph(newGraph);
        console.log(newGraph.numberOfNodes);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleSubmit() {
    if (fullgraph !== null) {
      // console.log("full graph", fullgraph);
      
      const startingLocation = locations.find(
        (location) => location.name === startingPoint,
      );
      // console.log("starting location", startingLocation);
      
      const destinationLocation = locations.find(
        (location) => location.name === destination,
      );
      // console.log("destination location", destinationLocation);
      

      if (startingLocation && destinationLocation) {
        const startVertex = findNearestVertex(
          startingLocation.coordinates,
          fullgraph,
        );
        console.log("start vertex", startVertex);
        
        const destinationVertex = findNearestVertex(
          destinationLocation.coordinates,
          fullgraph,
        );

        console.log("destination vertex", destinationVertex);


        fullgraph.dijkstra(startVertex);
        console.log("Shortest path:", fullgraph.getPath(destinationVertex));
        console.log(fullgraph.distance[destinationVertex]);
        const shortestPath = fullgraph.getPath(destinationVertex);
        // console.log("shortest path", shortestPath);
        console.log(fullgraph.adjacentList[startVertex]);
console.log(fullgraph.adjacentList[destinationVertex]);
        if (shortestPath !== null) {
          const shortestRoute = [];
          for (const path of shortestPath) {
            const coordinateArr = path.split(",").map(Number) as [number, number];
            shortestRoute.push(coordinateArr);
          }
          setRouteCoordinates(shortestRoute);
        }
      }
    }
  }

  // reverse the order when pushing into shortestRoute for Leaflet:
  // shortestRoute.push([coordinateArr[1], coordinateArr[0]]);

  // const graph = useMemo(() => {
  //   const addNode = new DijkstraGraph();
  //   addNode.addVertex("Main Gate");
  //   addNode.addVertex("Faculty of Science");
  //   addNode.addVertex("J.F. Ade Ajayi Auditorium");

  //   addNode.addEdge("Main Gate", "Faculty of Science", 300); // The weight 300 represents the distance between Main Gate and Faculty of Science.
  //   addNode.addEdge("Faculty of Science", "J.F. Ade Ajayi Auditorium", 900);

  //   addNode.dijkstra("Main Gate"); // This tells Dijkstra's algorithm to calculate the shortest distances from Main Gate to every other reachable vertex in the graph.

  //   return addNode;
  // }, []);
  // function findRoute() {
  //   console.log("Find Route clicked!");

  //   console.log("Starting point:", startingPoint);
  //   console.log("Destination:", destination);

  //   graph.dijkstra(startingPoint);
  //   const pathway = graph.getPath(destination);
  //   console.log(pathway);
  //   setPath(pathway);
  // }

  // const graph = useMemo(() => {
  //   let addNode = new DijkstraGraph();
  //   addNode.addVertex("Main")
  //   return addNode
  //   , []})  // useMemo() -> caches a value between renders. () => new DijkstraGraph() creates the graph instance. [] - tells React that the memoized value has no dependencies.
  return (
    <>
      <h1>UnilagRoutes</h1>
      <p>
        Input your current destination and final destination to get an overview
        of the distance and route to your destination.
      </p>

      <label htmlFor="startingPoint">Select starting point</label>
      <select
        name="startingPoint"
        id="startingPoint"
        value={startingPoint}
        onChange={(e) => setStartingPoint(e.target.value)}
      >
        <option value="" disabled>
          Select starting point
        </option>
        {locations.map((location) => (
          <option key={location.id} value={location.name}>
            {" "}
            {location.name}{" "}
          </option>
        ))}
      </select>

      <label htmlFor="destination">Select destination</label>
      <select
        name="destination"
        id="destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      >
        {locations.map((location) => (
          <option key={location.id} value={location.name}>
            {" "}
            {location.name}{" "}
          </option>
        ))}
      </select>

      <button type="button" onClick={() => handleSubmit()}>
        Find Route
      </button>
      <p> {path && path.join(" → ")} </p>
      <CampusMap routeCoordinates = {routeCoordinates} />
    </>
  );
}

export default App;
