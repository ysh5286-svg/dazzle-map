import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBjzTIUtmGRVPXRy8Qppta1O2C1FjAvmeE",
    authDomain: "dazzle-map-dd970.firebaseapp.com",
    projectId: "dazzle-map-dd970",
    storageBucket: "dazzle-map-dd970.firebasestorage.app",
    messagingSenderId: "786425160276",
    appId: "1:786425160276:web:aa7ba3c32268cf9a3643c1",
    measurementId: "G-DVWDHQVJJL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function initMap() {
    return new naver.maps.Map('map', {
        center: new naver.maps.LatLng(35.8693, 128.5955),
        zoom: 16,
        zoomControl: false,
        mapTypeControl: false
    });
}

// 🔥 [위치 오차 해결] 앵커 포인트 수정됨
export function createMarker(map, options) {
    var categoryName = Array.isArray(options.category) ? options.category[0] : (options.category || '맛집');
    
    var contentHtml = `
        <div class="marker-label">
            <span class="overlay-badge">${categoryName}</span>
            <span class="overlay-name">${options.name}</span>
        </div>
    `;

    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(options.lat, options.lng),
        map: map,
        icon: {
            content: contentHtml,
            size: new naver.maps.Size(100, 50),
            anchor: new naver.maps.Point(0, 0) // 🔥 기준점을 0,0으로 변경 (CSS로 위치 제어)
        }
    });

    if (options.onClick) {
        naver.maps.Event.addListener(marker, 'click', function(e) {
            options.onClick(options); 
        });
    }

    return marker;
}