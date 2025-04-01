

// Cấu hình bản đồ
let config = {
    minZoom: 7,
    maxZoom: 18,
    fullscreenControl: true,
};

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

// Mảng các tọa độ và popupText
const pointsCho = [
    [10.7721, 106.6983, "Chợ Bến Thành", "cho1.jpg"],
    [10.7480, 106.6591, "Chợ Bình Tây", "cho2.jpg"],
    [10.7565, 106.6770, "Chợ An Đông", "cho3.jpg"],
    [10.7885, 106.6928, "Chợ Tân Định", "cho4.jpg"],
    [10.8050, 106.6906, "Chợ Bà Chiểu", "cho5.jpg"],
    [10.8389, 106.6650, "Chợ Hạnh Thông Tây", "cho6.jpg"],
    [10.7560, 106.6608, "Chợ Kim Biên", "cho7.jpg"],
    [10.7769, 106.6497, "Chợ Tân Bình", "cho8.jpg"],
    [10.7705, 106.6820, "Chợ Bàn Cờ", "cho9.jpg"],
    [10.8015, 106.6653, "Chợ Hoàng Hoa Thám", "cho10.jpg"],
    [10.7976, 106.6478, "Chợ Bà Hoa", "cho11.jpg"],
];

const pointsSupermarket = [
    [10.8384, 106.6708, "LOTTE Mart Gò Vấp", "1.jpg"],
    [10.8232, 106.6934, "Emart Gò Vấp", "2.jpg"],
    [10.7808, 106.7020, "Winmart Đồng Khởi", "3.jpg"],
    [10.8007, 106.6581, "Winmart Cộng Hòa", "4.jpg"],
    [10.8258, 106.6807, "GO! Gò Vấp", "5.jpg"],
    [10.8016, 106.6173, "AEON Tân Phú Celadon", "6.jpg"],
    [10.7428, 106.6119, "AEON Bình Tân", "7.jpg"],
    [10.7783, 106.6654, "Big C Miền Đông", "8.jpg"],
    [10.7307, 106.6038, "Big C An Lạc", "9.jpg"],
    [10.8002, 106.7432, "MM Mega Market An Phú", "10.jpg"],
    [10.7425, 106.6311, "MM Mega Market Bình Phú", "11.jpg"],
    [10.8024, 106.7409, "Vincom Mega Mall Thảo Điền", "12.jpg"],
    [10.7724, 106.7228, "Emart Sala", "13.jpg"],
];



// Sử dụng `LayerGroup` để quản lý các điểm
const pA = new L.FeatureGroup();
const pB = new L.FeatureGroup();
const allMarkers = new L.FeatureGroup();

for (let i = 0; i < pointsCho.length; i++) {
    let marker = L.marker([pointsCho[i][0], pointsCho[i][1]])
    .bindPopup(`<b>${pointsCho[i][2]}
`);
    pA.addLayer(marker);
}

// Thêm marker đến layer pB (Siêu thị)
for (let i = 0; i < pointsSupermarket.length; i++) {
    let marker = L.marker([pointsSupermarket[i][0], pointsSupermarket[i][1]])
        .bindPopup(`<b>${pointsSupermarket[i][2]}
`);
    pB.addLayer(marker);
}

// Thêm các layer vào bản đồ
allMarkers.addLayer(pA).addLayer(pB);

const overlayMaps = {
    "Chợ": pA,
    "Siêu Thị": pB,
};

map.on("layeradd layremove", function () {
    // tạo các đường biên rỗng
    let bounds = new L.LatLngBounds();
    // Lặp lại các layer của bản đồ
    map.eachLayer(function (layer) {
        // Kiểm tra xem lớp có phải là FeatureGroup không
        if (layer instanceof L.FeatureGroup) {
            // Mở rộng bounds với group’s bounds
            bounds.extend(layer.getBounds());
        }
    });

    // Kiểm tra xem các đường biên có hợp lệ không
    if (bounds.isValid()) {
        map.flyToBounds(bounds);
    }
});

L.Control.CustomButtons = L.Control.Layers.extend({
    onAdd: function () {
        this._initLayout();
        this._addMarker();
        this._removeMarker();
        this._update();
        return this._container;
    },
    _addMarker: function () {
        this.createButton("Thêm", "add-button");
    },
    _removeMarker: function () {
        this.createButton("Xóa", "remove-button");
    },
    createButton: function (type, className) {
        const elements = this._container.getElementsByClassName(
            "leaflet-control-layers-list"
        );
        const button = L.DomUtil.create(
            "button",
            `btn-markers ${className}`,
            elements[0]
        );
        button.textContent = `${type} markers`;

        L.DomEvent.on(button, "click", function (e) {
            const checkbox = document.querySelectorAll(
                ".leaflet-control-layers-overlays input[type=checkbox]"
            );

            // Remove/add all layer from map when click on button
            [].slice.call(checkbox).map((el) => {
                el.checked = type === "Thêm" ? false : true;
                el.click();
            });
        });
    },
});

new L.Control.CustomButtons(null, overlayMaps, { collapsed: false }).addTo(map);
