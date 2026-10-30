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


Stage	What we need to accomplish	Status
1	      Implement Dijkstra	           ✅
2	 Obtain UNILAG road data	           ✅
3	Display road data on the map      	 ✅
4	 Convert GeoJSON into a graph	      ⬜
5	Calculate actual distances between connected coordinates	                          ⬜
6	Connect the graph to Dijkstra	      ⬜
7	Identify buildings and their geographic coordinates	                          ⬜
8	Connect selected buildings 
  to the road network	                ⬜
9	Calculate and display
  the shortest route	                ⬜
10	Display route distance 
  and directions	                     ⬜


<!-- Haversine formula -->
a=sin^2(Δϕ/2​)+cos(ϕ1​)cos(ϕ2​)sin^2(Δλ/2​)
c=2arctan2(roota, root1−a​)
d = R * c
where R = Earth's mean radius = 6371000;
φ₁ (phi one) = latitude of the first point.
φ₂ (phi two) = latitude of the second point.
λ₁ (lambda one) = longitude of the first point.
λ₂ (lambda two) = longitude of the second point.
