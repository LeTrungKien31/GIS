

// Cấu hình bản đồ
let config = {
    minZoom: 7,
    maxZoom: 18,
};

// Độ phóng đại khi bản đồ được mở
const zoom = 18;

// Tọa độ trung tâm bản đồ (đặt theo vị trí đầu tiên trong danh sách siêu thị)
const lat = supermarkets.length > 0 ? supermarkets[0].latitude : 10.7965;
const lng = supermarkets.length > 0 ? supermarkets[0].longitude : 106.6668;

// Khởi tạo bản đồ
const map = L.map("map", config).setView([lat, lng], zoom);
map.attributionControl.setPrefix(false);

// Thêm tile layer từ OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href='#'>LT GIS</a> cơ bản',
}).addTo(map);

// Thêm marker cho từng siêu thị
supermarkets.forEach((market) => {
    const marker = new L.marker([market.latitude, market.longitude], {
        draggable: true,
        autoPan: true,
    })
    .bindPopup(market.name)
    .addTo(map);

    // Xử lý kéo thả marker
    marker.on("dragend", function () {
        console.log(`Marker mới: ${marker.getLatLng().lat}, ${marker.getLatLng().lng}`);
    });

    // Hiển thị tọa độ khi nhấp vào bản đồ
    map.on("click", function (e) {
        alert(`Tọa độ: ${e.latlng.lat}, ${e.latlng.lng}`);
    });
});
