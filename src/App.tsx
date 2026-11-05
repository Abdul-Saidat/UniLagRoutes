import { useEffect, useState } from "react";
import "./App.css";
import { DijkstraGraph } from "./algorithms/dijkstra";
import CampusMap from "./components/CampusMap";
import { buildGraph, findNearestVertex } from "./algorithms/buildGraph";
import { locations } from "./data/locations";

function App() {
  const [loading, setLoading] = useState(false)
  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  // const [path, setPath] = useState<string[] | null>(null);
  const [fullgraph, setFullGraph] = useState<DijkstraGraph | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    [],
  );
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

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
    console.log("clicked", {
      startingPoint,
      destination,
      graphReady: fullgraph !== null,
    });
    if (fullgraph === null) {
      setLoading(true)
    }
    if (fullgraph !== null) {
      const startingLocation = locations.find(
        (location) => location.name === startingPoint,
      );
      const destinationLocation = locations.find(
        (location) => location.name === destination,
      );
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
        setTotalDistance(fullgraph.distance[destinationVertex]);
        const reachable = Object.keys(fullgraph.distance).filter(
          (v) => fullgraph.distance[v] !== Infinity,
        );
        console.log(
          "Reachable:",
          reachable.length,
          "of",
          Object.keys(fullgraph.adjacentList).length,
        );
        console.log(
          "Can reach New Hall:",
          fullgraph.visited[destinationVertex],
        );
        console.log("Start connections:", fullgraph.adjacentList[startVertex]);
        console.log(
          "Destination connections:",
          fullgraph.adjacentList[destinationVertex],
        );
        console.log("Shortest path:", fullgraph.getPath(destinationVertex));
        const shortestPath = fullgraph.getPath(destinationVertex);
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
      <section className="flex items-center gap-5 py-4 px-5 border-b border-b-gray-300">
        <h1 className="font-bold text-xl md:text-3xl">UnilagRoutes</h1>
        <p>Shortest walking route between campus spots</p>
      </section>

      <section className="flex flex-col md:flex-row h-screen">
        <aside className="flex flex-col gap-2 px-7 pt-10 w-full md:w-120">
          <h2 className="font-bold text-2xl">Where to?</h2>
          <div className="flex flex-col">
            <label htmlFor="startingPoint" className="text-gray-500 font-medium">From</label>
            <select
              name="startingPoint"
              id="startingPoint"
              value={startingPoint}
              onChange={(e) => setStartingPoint(e.target.value)}
              className="border border-gray-200 rounded-2xl focus:outline-0 px-2 py-3"
            >
              <option value="" disabled className="text-[10px]">
                Select starting point
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.name}>
                  {" "}
                  {location.name}{" "}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="destination" className="text-gray-500 font-medium">To</label>
            <select
              name="destination"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border border-gray-200 rounded-2xl focus:outline-0 px-2 py-3"

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
          </div>
          <button
          disabled={loading}
            type="button"
            onClick={() => handleSubmit()}
            className={loading ? "opacity-50 cursor-not-allowed mt-3" : "px-3 py-4 rounded-2xl bg-[#1A56DB] text-white cursor-pointer font-medium mt-3"}
            // className="px-3 py-4 rounded-2xl bg-[#1A56DB] text-white"
            
          >
            {loading ? "Loading map data..." : "Find route"}
         
          </button>
          {/* {path && path.join(" → ")}  */}
          <div className="bg-slate-100 p-5 mt-3 border border-gray-300 rounded-2xl">
            <span className="text-gray-600 font-medium">ROUTE FOUND</span>
            <span></span>
          <div>
            {/* <h3 className="font-bold text-2xl">Result</h3> */}
            <p className="text-2xl font-semibold mt-5">
              {/* CITS → New Hall */}
              {startingPoint} → {destination}
            </p>
            <div className="flex gap-3 w-full mt-4">
              <div className="w-1/2 bg-white p-3 rounded-2xl">

            <p className="text-3xl font-bold">
              {totalDistance !== null
                ? `${(totalDistance / 1000).toFixed(2)} km `
                : "_"}
            </p>
            <span className=" text-gray-600">Distance</span>
              </div>
              <div className="w-1/2 bg-white p-3 rounded-2xl">
                <p className="text-3xl font-bold">
                  { totalDistance && Math.ceil(totalDistance / 80)} min
                </p>
            <span className=" text-gray-600">On foot</span>

              </div>
            </div>
          </div>
          </div>
        </aside>

        <section className="flex-1 min-w-0 h-full">
          <CampusMap routeCoordinates={routeCoordinates} />
        </section>
      </section>
    </>
  );
}

export default App;
