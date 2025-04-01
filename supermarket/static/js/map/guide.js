/* eslint-disable no-undef */
/**
 * Distance between cities on map
 */

// config map
let config = {
    minZoom: 2,
    maxZoom: 18,
  };
  // magnification with which the map will start
  const zoom = 7;
  // co-ordinates
  const lat = 52.22977;
  const lng = 21.01178;
  
  // calling map
  const map = L.map("map", config).setView([lat, lng], zoom);
  
  // Used to load and display tile layers on the map
  // Most tile servers require attribution, which you can set under `Layer`
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  map
  .locate({
    // https://leafletjs.com/reference-1.7.1.html#locate-options-option
    setView: true,
    enableHighAccuracy: true,
  })
  // if location found show marker and circle
  .on("locationfound", (e) => {
    console.log(e);
    // marker
    const marker = L.marker([e.latitude, e.longitude]).bindPopup(
      "Your are here :)"
    );
    // circle
    const circle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
      weight: 2,
      color: "red",
      fillColor: "red",
      fillOpacity: 0.1,
    });
    // add marker
    map.addLayer(marker);
    // add circle
    map.addLayer(circle);
  })
  // if error show alert
  .on("locationerror", (e) => {
    console.log(e);
    alert("Location access denied.");
  });
  
  const length = document.querySelector(".length");
  const cityA = document.querySelector("#cityA");
  const cityB = document.querySelector("#cityB");
  const clearButton = document.querySelector(".clear-distance");
  
  let markers = [];
  let featureGroups = [];
  
  function results({ currentValue, matches, template }) {
    const regex = new RegExp(currentValue, "i");
    // checking if we have results if we don't
    // take data from the noResults method
    return matches === 0
      ? template
      : matches
          .map((element) => {
            return `
            <li class="autocomplete-item" role="option" aria-selected="false">
              <p>${element.name.replace(
                regex,
                (str) => `<b>${str}</b>`
              )}</p>
            </li> `;
          })
          .join("");
  }
  
  function nominatim(currentValue) {
    // const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
    //   currentValue
    // )}`;
  
    return new Promise((resolve) => {
      fetch('/api/supermarkets/')
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
  
  function addMarkerToMap(object) {
    const  display_name = object['name'];
    const arr = [object['latitude'], object['longitude']];
  
    const customId = object['id'];
  
    const marker = L.marker(arr, {
      title: display_name,
      id: customId,
    });
  
    // add marker to map
    marker.addTo(map).bindPopup(display_name);
  
    map.setView(arr, 8);
  
    // add marker to array markers
    markers.push(arr);
  
    // add marker to array featureGroup
    featureGroups.push(marker);
  
    if (markers.length == 2) {
      // add polyline between cities
      L.polyline(markers, {
        color: "red",
      }).addTo(map);
  
      // matching all markers to the map view
      let group = new L.featureGroup(featureGroups);
      map.fitBounds(group.getBounds(), {
        padding: [10, 10], // adding padding to map
      });
  
      // add text 'Length (in kilometers):'
      distanceBetweenMarkers();
    }
  
    if (markers.length > 2) {
      clearData();
    }
  }
  
  function clearData() {
    // clear array
    markers = [];
  
    // back to default coordinate
    map.panTo([lat, lng]);
  
    // set info ;)
    length.textContent = "Markers and plines have been removed";
  
    // remove polyline
    for (i in map._layers) {
      if (map._layers[i]._path != undefined) {
        try {
          map.removeLayer(map._layers[i]);
        } catch (e) {
          console.log("problem with " + e + map._layers[i]);
        }
      }
    }
  
    // remove markers
    map.eachLayer((layer) => {
      if (layer.options && layer.options.pane === "markerPane") {
        map.removeLayer(layer);
      }
    });
  }
  
  function distanceBetweenMarkers() {
    const from = L.marker(markers[0]).getLatLng();
    const to = L.marker(markers[1]).getLatLng();
  
    // in km
    const distance = from.distanceTo(to) / 1000;
  
    length.textContent = `Length (in kilometers): ${distance.toFixed(5)}`;
  }
  
  window.addEventListener("DOMContentLoaded", function () {
    ["cityA", "cityB"].forEach((city) => {
      const auto = new Autocomplete(city, {
        clearButton: false,
        howManyCharacters: 2,
  
        onSearch: ({ currentValue }) => nominatim(currentValue),
  
        onResults: (object) => results(object),
  
        onSubmit: ({ object }) => addMarkerToMap(object),
  
        // the method presents no results
        noResults: ({ currentValue, template }) =>
          template(`<li>No results found: "${currentValue}"</li>`),
      });
  
      clearButton.addEventListener("click", () => {
        clearData();
  
        // destroy method
        auto.destroy();
  
        // focus on first input
        document.querySelector("#cityA").focus();
      });
    });
  });




  /* eslint-disable no-undef */
/**
 * Distance between any selected location and supermarket/market
 */

// Cấu hình bản đồ
// let config = {
//     minZoom: 2,
//     maxZoom: 18,
//   };
//   const zoom = 7; // Mức zoom mặc định
  
//   // Khởi tạo bản đồ
//   const map = L.map("map", config).setView([21.0285, 105.8542], zoom); // Mặc định ở Hà Nội
  
//   // Thêm tile layer từ OpenStreetMap
//   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(map);
  
//   // DOM Elements
//   const lengthDisplay = document.querySelector(".length");
//   const cityAInput = document.querySelector("#cityA");
//   const cityBInput = document.querySelector("#cityB");
//   const clearButton = document.querySelector(".clear-distance");
  
//   let markers = [];
//   let featureGroups = [];
  
//   // Hàm tìm kiếm địa điểm
//   function nominatim(query) {
//     return new Promise((resolve) => {
//       fetch('/api/supermarkets/') // Gọi API lấy danh sách siêu thị
//         .then((response) => response.json())
//         .then((data) => resolve(data))
//         .catch((error) => console.error(error));
//     });
//   }
  
//   // Hiển thị kết quả tìm kiếm
//   function results({ currentValue, matches, template }) {
//     const regex = new RegExp(currentValue, "i");
//     return matches === 0
//       ? template
//       : matches
//           .map((element) => `<li class="autocomplete-item">${element.name.replace(regex, (str) => `<b>${str}</b>`)}</li>`)
//           .join("");
//   }
  
//   // Thêm marker vào bản đồ
//   function addMarkerToMap(object, isCityA = false) {
//     const display_name = object['name'];
//     const coordinates = [object['latitude'], object['longitude']];
  
//     const marker = L.marker(coordinates, { title: display_name }).bindPopup(display_name);
//     marker.addTo(map);
//     map.setView(coordinates, 10);
  
//     markers.push(coordinates);
//     featureGroups.push(marker);
  
//     // Nếu đã chọn đủ 2 điểm, tính khoảng cách
//     if (markers.length === 2) {
//       L.polyline(markers, { color: "red" }).addTo(map);
//       let group = new L.featureGroup(featureGroups);
//       map.fitBounds(group.getBounds(), { padding: [10, 10] });
//       calculateDistance();
//     }
  
//     if (markers.length > 2) clearData();
//   }
  
//   // Tính khoảng cách giữa cityA và cityB
//   function calculateDistance() {
//     const from = L.marker(markers[0]).getLatLng();
//     const to = L.marker(markers[1]).getLatLng();
//     const distance = from.distanceTo(to) / 1000;
//     lengthDisplay.textContent = `Distance: ${distance.toFixed(2)} km`;
//   }
  
//   // Xóa dữ liệu cũ
//   function clearData() {
//     markers = [];
//     map.eachLayer((layer) => {
//       if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer);
//     });
//     lengthDisplay.textContent = "Select locations";
//   }
  
//   // Khởi tạo autocomplete
//   window.addEventListener("DOMContentLoaded", function () {
//     ["cityA", "cityB"].forEach((inputId) => {
//       const auto = new Autocomplete(inputId, {
//         clearButton: false,
//         howManyCharacters: 2,
//         onSearch: ({ currentValue }) => nominatim(currentValue),
//         onResults: (object) => results(object),
//         onSubmit: ({ object }) => addMarkerToMap(object, inputId === "cityA"),
//         noResults: ({ currentValue, template }) => template(`<li>No results found: "${currentValue}"</li>`),
//       });
  
//       clearButton.addEventListener("click", () => {
//         clearData();
//         auto.destroy();
//         document.querySelector("#cityA").focus();
//       });
//     });
//   });
  