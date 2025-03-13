import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet 기본 마커 아이콘 설정 (필수)
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const bounds = L.latLngBounds(
    [32.5, 123.5], // 남서 좌표 (제주 남서쪽)
    [39.0, 132.0] // 북동 좌표 (강원도 북동쪽)
)

const defaultIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function Map({ x, y ,campName}) {
    console.log("Map received x, y:", x, y);
    console.log(campName)
    return (
        <MapContainer
            center={[y, x]} // x, y 값이 중심
            zoom={13} // 초기 줌 레벨
            zoomSnap={0.5} // 줌 레벨 스냅
            maxBounds={bounds} // 최대 경계 설정
            style={{ width: "100%", height: "400px" }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                maxZoom={20}
                minZoom={8.0}
            />

            {/* 마커 표시 */}
            <Marker position={[y, x]} icon={defaultIcon}>
                <Popup>{campName}</Popup>
            </Marker>
        </MapContainer>
    );
}

export default Map;
