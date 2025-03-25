/**
 * geocoding addresses search engine outside the map
 */

window.addEventListener("DOMContentLoaded", function () {
    // Autocomplete
    new Autocomplete("search", {
      delay: 1000,
      selectFirst: true,
      howManyCharacters: 2,
  
      onSearch: function ({ currentValue }) {
        const api = '/data/search?q=' + currentValue;
        return new Promise((resolve) => {
          fetch(api)
            .then((response) => response.json())
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      },
      // nominatim
      onResults: ({ currentValue, matches, template }) => {
        const regex = new RegExp(currentValue, "i");
        // checking if we have results if we don't
        // take data from the noResults method
        return matches === 0
          ? template
          : matches
              .map((element) => {
                return `
                <li class="loupe" role="option">
                  ${element.name.replace(
                    regex,
                    (str) => `<b>${str}</b>`
                  )}
                </li> `;
              })
              .join("");
      },
  
      onSubmit: ({ object }) => {
        // const { display_name } = object.properties;
        // const cord = object.geometry.coordinates;
        // custom id for marker
        const customId = object.id;
        const cord = [object.latitude, object.longitude];
        
        const marker = L.marker(cord, {
          title: object.name,
          id: customId,
        });
  
        marker.addTo(map).bindPopup(object.name + '<br>' + object.address);
  
        map.setView(cord, 8);
  
        map.eachLayer(function (layer) {
          if (layer.options && layer.options.pane === "markerPane") {
            if (layer.options.id !== customId) {
              map.removeLayer(layer);
            }
          }
        });
      },
  
      // get index and data from li element after
      // hovering over li with the mouse or using
      // arrow keys ↓ | ↑
      onSelectedItem: ({ index, element, object }) => {
        console.log("onSelectedItem:", index, element, object);
      },
  
      // the method presents no results
      noResults: ({ currentValue, template }) =>
        template(`<li>No results found: "${currentValue}"</li>`),
    });
  
    // MAP
    const config = {
      minZoom: 6,
      maxZoom: 18,
    };
    // magnification with which the map will start
    const zoom = 3;
    // co-ordinates
    // const lat = 52.22977;
    // const lng = 21.01178;
    var loc = [10.796642767769026, 106.66740823728848];
    // calling map
    const map = L.map("map", config).setView(loc, zoom);
  
    // Used to load and display tile layers on the map
    // Most tile servers require attribution, which you can set under `Layer`
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  });