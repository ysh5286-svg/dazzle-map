import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// 🔥 [추가됨] 인증 관련 도구 가져오기
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// 🔥 [추가됨] 인증 기능 내보내기
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signOut, onAuthStateChanged };

// 2. 지도 초기화
export function initMap() {
    return new naver.maps.Map('map', {
        center: new naver.maps.LatLng(35.8693, 128.5955),
        zoom: 16,
        zoomControl: false,
        mapTypeControl: false
    });
}

// 🔥 [색상 팔레트]
const categoryColors = {
    "한식": "#e74c3c", "중식": "#f39c12", "일식": "#3498db", "양식": "#2ecc71",
    "분식": "#e67e22", "고기/구이": "#d35400", "회/해산물": "#1abc9c", "아시안": "#16a085",
    "술집": "#9b59b6", "카페/디저트": "#e056fd", "빵집": "#fd79a8", "패스트푸드": "#f1c40f",
    "포장/배달": "#95a5a6", "default": "#34495e"
};

// 3. 마커 생성 함수
export function createMarker(map, shopList, onClick, options) {
    if (!shopList || shopList.length === 0) return null;
    var opts = options || {};
    var mainShop = shopList[0];
    var categoryName = Array.isArray(mainShop.category) ? mainShop.category[0] : (mainShop.category || '맛집');
    var pointColor = categoryColors[categoryName] || categoryColors["default"];
    var badgeHtml = shopList.length > 1 ? `<span class="count-badge" style="background:${pointColor}">+${shopList.length - 1}</span>` : '';
    var isHot = mainShop.isHot === true;
    var hotClass = isHot ? 'hot-marker' : '';
    var fireIconHtml = isHot ? `<div class="hot-fire-crown">🔥</div>` : '';
    var themeCheckHtml = opts.themeChecked ? `<span style="position:absolute;top:-6px;right:-6px;background:#2ecc71;color:#fff;border-radius:50%;width:18px;height:18px;font-size:11px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.3);z-index:10;">✓</span>` : '';
    var dimStyle = opts.themeDim ? 'opacity:0.35;' : '';

    var contentHtml = `
        <div class="marker-label ${hotClass}" style="border: 2px solid ${pointColor}; will-change: transform; transform: translate(-50%, -100%); ${dimStyle}">
            ${themeCheckHtml}
            ${fireIconHtml}
            <span class="overlay-badge" style="color: ${pointColor};">${categoryName}</span>
            <span class="overlay-name">${mainShop.name} ${badgeHtml}</span>
            <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${pointColor};"></div>
        </div>`;

    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(mainShop.lat, mainShop.lng),
        map: map,
        icon: { content: contentHtml, size: new naver.maps.Size(0, 0), anchor: new naver.maps.Point(0, 0) },
        zIndex: isHot ? 9999 : (opts.themeChecked ? 5000 : 100)
    });

    naver.maps.Event.addListener(marker, 'mouseover', function() { marker.setZIndex(20000); });
    naver.maps.Event.addListener(marker, 'mouseout', function() { marker.setZIndex(isHot ? 9999 : 100); });
    if (onClick) { naver.maps.Event.addListener(marker, 'click', function(e) { onClick(shopList); }); }
    return marker;
}