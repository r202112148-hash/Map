// 1. 初始化地圖，設定中心點為香港（以尖沙咀為例：22.2988, 114.1722）
const map = L.map('map').setView([22.2988, 114.1722], 14);

// 2. 載入開源的 OpenStreetMap 地圖底圖
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 儲存所有大頭針的陣列，方便之後做篩選清除
let markerList = [];

// 3. 模擬從政府 API (DATA.GOV.HK) 及自建 JSON 抓取的數據
// 為了讓你直觀理解，我先用靜態數據封裝
const locations = [
    {
        type: 'charging',
        name: '尖沙咀海港城停車場',
        lat: 22.2951,
        lng: 114.1668,
        info: '中速/快速充電位 | 實時剩餘車位: 15'
    },
    {
        type: 'recycle',
        name: '尖沙咀區 EV 電池回收站 A',
        lat: 22.3020,
        lng: 114.1750,
        info: '政府認可機構 | 開放時間: 09:00-18:00'
    }
];

// 4. 渲染大頭針的 Function
function renderMarkers(typeFilter) {
    // 先清除現有的大頭針
    markerList.forEach(marker => map.removeLayer(marker));
    markerList = [];

    // 根據篩選條件決定要顯示哪些點
    locations.forEach(loc => {
        if (typeFilter === 'all' || loc.type === typeFilter) {
            
            // 建立導航連結 (利用 URL Scheme 呼叫手機導航)
            const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
            
            const popupContent = `
                <h3>${loc.name}</h3>
                <p>${loc.info}</p>
                <a href="${googleMapUrl}" target="_blank" style="display:inline-block; background:#007bff; color:#fff; padding:5px 10px; text-decoration:none; border-radius:3px;">
                    🧭 導航一條龍帶你去
                </a>
            `;

            // 在地圖上加上大頭針
            const marker = L.marker([loc.lat, loc.lng])
                .bindPopup(popupContent);
            
            marker.addTo(map);
            markerList.push(marker); // 存入陣列
        }
    });
}

// 5. 按鈕切換篩選
function filterMarkers(type) {
    renderMarkers(type);
}

// 首次載入顯示全部
renderMarkers('all');
