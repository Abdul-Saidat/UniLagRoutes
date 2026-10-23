import { useMemo, useState } from "react";
import "./App.css";
import { DijkstraGraph } from "./algorithms/dijkstra";

const locations = [
  "Main Gate",
  "Faculty of Science",
  "J.F. Ade Ajayi Auditorium",
];

function App() {
  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [path, setPath] = useState<string[] | null>(null);

  const graph = useMemo(() => {
    const addNode = new DijkstraGraph();
    addNode.addVertex("Main Gate");
    addNode.addVertex("Faculty of Science");
    addNode.addVertex("J.F. Ade Ajayi Auditorium");

    addNode.addEdge("Main Gate", "Faculty of Science", 300); // The weight 300 represents the distance between Main Gate and Faculty of Science.
    addNode.addEdge("Faculty of Science", "J.F. Ade Ajayi Auditorium", 900);

    addNode.dijkstra("Main Gate"); // This tells Dijkstra's algorithm to calculate the shortest distances from Main Gate to every other reachable vertex in the graph.

    return addNode;
  }, []);
  function findRoute() {
    console.log("Find Route clicked!");

    console.log("Starting point:", startingPoint);
    console.log("Destination:", destination);
    
    
    graph.dijkstra(startingPoint);
    const pathway = graph.getPath(destination);
    console.log(pathway);
    setPath(pathway);
  }

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
        <option value="" disabled>Select starting point</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {" "}
            {location}{" "}
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
          <option key={location} value={location}>
            {" "}
            {location}{" "}
          </option>
        ))}
      </select>

      <button type="button" onClick={() => findRoute()}>
        Find Route
      </button>
      <p> {path && path.join(" → ")} </p>
    </>
  );
}

export default App;
