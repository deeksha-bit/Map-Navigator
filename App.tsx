// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, NativeModules, Text, Platform } from "react-native";
// import MapboxGL from "@rnmapbox/maps";
// import Geolocation from "@react-native-community/geolocation";
// import { accessToken } from "./src/constants";
// MapboxGL.setAccessToken(accessToken);
// const App = () => {
//   const { BatteryModule } = NativeModules;
//   const [coordinates] = useState([78.9629, 20.5937]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [pathCoordinates, setPathCoordinates] = useState([]);
//   const [isPowerMode, setisPowerMode] = useState(false);

//   useEffect(() => {
//     MapboxGL.setTelemetryEnabled(false);
//     if (Platform.OS === "android") {
//       BatteryModule.getBatteryOptimisationStatus()
//         .then((powersave: boolean) => {
//           setisPowerMode(powersave);
//         })
//         .catch((err) => {
//           console.log("exception occurred ", err);
//         });
//     }
//   }, []);

//   const getCurrentLocation = () => {
//     // Get the user's current location
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setCurrentLocation({ latitude, longitude });
//       },
//       (error) => {
//         console.error("Error getting location:", error);
//       },
//       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//     );
//   };

//   Geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       console.log("latitude ", latitude, longitude);
//       setPathCoordinates((prevCoordinates) => [
//         ...prevCoordinates,
//         { latitude, longitude },
//       ]);

//       // Handle position update every 10 minutes
//     },
//     (error) => {
//       console.log("position in error", error);
//       // Handle errors
//     },
//     {
//       timeInterval: 600000, // 10 minutes in milliseconds
//       // Other configuration options
//     }
//   );

//   console.log("path ", pathCoordinates);

//   const [route, setRoute] = useState({
//     type: "FeatureCollection",
//     features: [
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "LineString",
//           coordinates: [
//             [77.5946, 12.9716],
//             [80.2707, 13.0827],
//           ],
//         },
//       },
//     ],
//   });

//   return (
//     <View style={styles.page}>
//       {/* //This functionality will only work for android */}
//       <View style={styles.card}>
//         <Text style={styles.text}>Battery Optimisation Status</Text>
//         <Text style={styles.text}>
//           {isPowerMode ? "Power Saving Mode On" : "Power Saving Mode off"}
//         </Text>
//       </View>

//       <View style={styles.container}>
//         <MapboxGL.MapView style={styles.map}>
//           <MapboxGL.Camera zoomLevel={6} centerCoordinate={coordinates} />
//           <MapboxGL.ShapeSource shape={route}>
//             <MapboxGL.LineLayer style={{ lineColor: "orange", lineWidth: 5 }} />
//           </MapboxGL.ShapeSource>
//         </MapboxGL.MapView>
//       </View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#000",
//     height: 100,
//     justifyContent: "center",
//     borderRadius: 50,
//     margin: 20,
//     padding: 20,
//   },
//   text: {
//     textAlign: "center",
//     fontSize: "30",
//   },
//   page: {
//     flex: 1,
//   },
//   container: {
//     height: "100%",
//     width: "100%",
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   markerContainer: {
//     alignItems: "center",
//     width: 60,
//     backgroundColor: "transparent",
//     height: 70,
//   },
//   textContainer: {
//     backgroundColor: "grey",
//     borderRadius: 10,
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   text: {
//     textAlign: "center",
//     paddingHorizontal: 5,
//     flex: 1,
//     color: "white",
//   },
// });
// export default App;
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, NativeModules, Platform } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { accessToken } from "./src/constants";
import Geolocation from "@react-native-community/geolocation";

MapboxGL.setAccessToken(accessToken);
const App = () => {
  const [coordinates] = useState([78.9629, 20.5937]);
  const { BatteryModule } = NativeModules;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [isPowerMode, setisPowerMode] = useState(false);
  const [routeCoords, setRouteCoords] = useState([
    [77.5946, 12.9716],
    [80.2707, 13.0827],
  ]);
  const [route, setRoute] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routeCoords,
        },
      },
    ],
  });

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
    if (Platform.OS === "android") {
      BatteryModule.getBatteryOptimisationStatus()
        .then((powersave: boolean) => {
          setisPowerMode(powersave);
        })
        .catch((err) => {
          console.log("exception occurred ", err);
        });
    }
    // Request location permission if necessary
    Geolocation.requestAuthorization();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    // Get the user's current location
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    // Set up location updates
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setPathCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          { latitude, longitude },
        ]);

        setRouteCoords([
          [pathCoordinates[0]?.latitude, pathCoordinates[0]?.longitude],
          [
            pathCoordinates[pathCoordinates.length - 1]?.latitude,
            pathCoordinates[pathCoordinates.length - 1]?.longitude,
          ],
        ]);
        // Handle position update every 10 minutes
      },
      (error) => {
        console.log("position in error", error);
        // Handle errors
      }
    );
  };

  console.log("current location ", currentLocation, pathCoordinates);
  return (
    <View style={styles.page}>
      {/* //This functionality will only work for android */}
      <View style={styles.card}>
        <Text style={styles.text}>Battery Optimisation Status</Text>
        <Text style={styles.text}>
          {isPowerMode ? "Power Saving Mode On" : "Power Saving Mode off"}
        </Text>
      </View>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={4} centerCoordinate={coordinates} />
          <MapboxGL.ShapeSource id="line1" shape={route}>
            <MapboxGL.LineLayer
              id="linelayer1"
              style={{ lineColor: "orange", lineWidth: 5 }}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  card: {
    backgroundColor: "#000",
    height: 100,
    justifyContent: "center",
    borderRadius: 50,
    margin: 20,
    padding: 20,
  },
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    width: 60,
    backgroundColor: "transparent",
    height: 70,
  },
  textContainer: {
    backgroundColor: "grey",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    paddingHorizontal: 5,
    flex: 1,
    color: "white",
  },
});
export default App;
