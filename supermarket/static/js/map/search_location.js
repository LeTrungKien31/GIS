
//2 tìm kiếm dựa vào vị trí
window.addEventListener("DOMContentLoaded", function () {
    // Autocomplete
  
        new Autocomplete("search", {
            delay: 1000,
            selectFirst: true,
            howManyCharacters: 2,

            onSearch: function ({ currentValue }) {
                const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
                    currentValue
                )}`;

                /** 
                 * Promise
                 */
                return new Promise((resolve) => {
                    fetch(api)
                        .then((response) => response.json())
                        .then((data) => {
                            resolve(data.features);
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
                                    ${element.properties.display_name.replace(
                                        regex,
                                        (str) => `<b>${str}</b>`
                                    )}
                                </li>`;
                        })
                        .join("");
            },

            onSubmit: ({ object }) => {
                const { display_name } = object.properties;
                const cord = object.geometry.coordinates;
                // custom id for marker
                const customId = Math.random();

                const marker = L.marker([cord[1], cord[0]], {
                    title: display_name,
                    id: customId,
                });

                marker.addTo(map).bindPopup(display_name);

                map.setView([cord[1], cord[0]], 8);

                map.eachLayer(function (layer) {
                    if (layer.options && layer.options.pane === "markerPane") {
                        if (layer.options.id !== customId) {
                            map.removeLayer(layer);
                        }
                    }
                });
            },

            onSelectedItem: ({ index, element, object }) => {
                console.log("onSelectedItem:", index, element, object);
            },

            // the method presents no results
            noResults: ({ currentValue, template }) => 
                template(`<li>No results found: "${currentValue}"</li>`),
            }
        );
        // Cấu hình bản đồ
    let config = {
        minZoom: 7,
        maxZoom: 18,
        fullscreenControl: true,
    };

    // Độ phóng đại khi bản đồ được mở
    const zoom = 18;

    // Tọa độ
    const lat = 10.79650188377228;
    const lng = 106.6668041161385;

    // Khởi tạo bản đồ
    const map = L.map("map", config).setView([lat, lng], zoom);
    map.attributionControl.setPrefix(false);

    // Được dùng để tải và trình các layer trên bản đồ
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="#">LT GIS</a> cơ bản',
    }).addTo(map);

});

