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
  // const [path, setPath] = useState<string[] | null>(null);
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
    console.log("clicked", { startingPoint, destination, graphReady: fullgraph !== null})
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
        const reachable = Object.keys(fullgraph.distance).filter(
          (v) => fullgraph.distance[v] !== Infinity,
        );
        console.log(
          "Reachable:",
          reachable.length,
          "of",
          Object.keys(fullgraph.adjacentList).length,
        );
        // const reachableVertices = Object.values(fullgraph.visited).filter(
        //   Boolean,
        // ).length;

        // console.log("Reachable vertices from CITS:", reachableVertices);
        // console.log("Total graph vertices:", fullgraph.numberOfNodes);
        console.log(
          "Can reach New Hall:",
          fullgraph.visited[destinationVertex],
        );
        console.log("Start connections:", fullgraph.adjacentList[startVertex]);
        console.log(
          "Destination connections:",
          fullgraph.adjacentList[destinationVertex],
        );
        // console.log("Start distance:", fullgraph.distance[startVertex]);
        // console.log("Destination distance:", fullgraph.distance[destinationVertex]);
        console.log("Shortest path:", fullgraph.getPath(destinationVertex));
        // console.log("",fullgraph.distance[destinationVertex]);
        const shortestPath = fullgraph.getPath(destinationVertex);
        // console.log("shortest path", shortestPath);
        // console.log(fullgraph.adjacentList[startVertex]);
        console.log(fullgraph.adjacentList[destinationVertex]);
        if (shortestPath !== null) {
          const shortestRoute: [number, number][] = [];
          for (const path of shortestPath) {
            const coordinateArr = path.split(",").map(Number) as [
              number,
              number,
            ];
            shortestRoute.push([coordinateArr[1], coordinateArr[0]]);
          }
          setRouteCoordinates(shortestRoute);
        }
      }
    }
  }

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
        <option value="" disabled>
          Select destination
        </option>
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
      {/* {path && path.join(" → ")}  */}
      <CampusMap routeCoordinates={routeCoordinates} />
    </>
  );
}

export default App;
