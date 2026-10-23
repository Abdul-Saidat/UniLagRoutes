                    UniLagRoutes
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       UI / Map       Routing Logic    Campus Data
          │              │              │
     inputs/buttons    Dijkstra       locations
     route display     shortest path   connections
     animation         distance       distances



     src/
├── algorithms/
│   └── dijkstra.ts
│
├── data/
│   └── campusGraph.ts
│
├── components/
│   ├── LocationSelector
│   ├── Map
│   ├── RouteInfo
│   └── ...
│
├── ...


Here's the actual order we'll follow
Connect Dijkstra to React.
Add a small sample campus graph using meaningful location names.
Let the user select a starting point and destination.
Calculate the shortest route when the user clicks a button.
Display the route and its distance.
Improve the interface and explore how to visualize the route on a campus map.

To show real distances, we'll eventually need reliable campus location and route data. Dijkstra calculates the shortest path from the connections and weights we provide; it doesn't automatically know UNILAG's geography.