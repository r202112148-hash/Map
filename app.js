// 1. 初始化地圖，預設中心點設為尖沙咀
const map = L.map('map').setView([22.2988, 114.1722], 14);

// 2. 載入開源 OpenStreetMap 底圖
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let currentMarkers = []; // 存放目前地圖上渲染的大頭針
let currentFilter = 'all';

// 3. 整合數據（為咗避開本地 fetch 權限問題，我哋直接將資料寫成陣列變數）
const allLocations = [
    // --- 電池回收點數據 ---
    {
        type: 'recycle',
        name: '環保署認可 EV 電池處理中心 (尖沙咀站)',
        lat: 22.3020,
        lng: 114.1750,
        provider: '環境保護署認可專門機構',
        details: '收退役電動車鋰電池、鉛酸電池。<br>開放時間：星期一至五 09:00 - 18:00'
    },
    {
        type: 'recycle',
        name: '綠色汽車循環再造廠 (官塘分店)',
        lat: 22.3125,
        lng: 114.2250,
        provider: '合資格回收商',
        details: '專門處理 EV 動力電池組件。<br>開放時間：星期一至六 10:00 - 19:00'
    },
    // --- 模擬政府實時公共充電站數據 ---
    {
        type: 'charging',
        name: '尖沙咀海港城停車場 (海運大廈)',
        lat: 22.2951,
        lng: 114.1668,
        provider: '中電 CLP / 停車場直營',
        details: '快充 (60kW) x 2 | 中充 (7kW) x 10<br><b>實時剩餘車位：12 個</b> (每分鐘更新)'
    },
    {
        type: 'charging',
        name: '中間道兒童遊樂場地下停車場',
        lat: 22.2965,
        lng: 114.1740,
        provider: '政府公共充電站 (EPD)',
        details: '標準充電位 x 15<br><b>實時剩餘車位：5 個</b> (每分鐘更新)'
    }
];

// 4. 渲染大頭針到地圖上
function renderMarkers() {
    // 每次渲染前，先清除舊的大頭針
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];

    allLocations.forEach(loc => {
        // 根據按鈕進行篩選
        if (currentFilter === 'all' || loc.type === currentFilter) {
            
            const badgeClass = loc.type === 'charging' ? 'bg-charge' : 'bg-recycle';
            const badgeText = loc.type === 'charging' ? '⚡ 充電+泊車' : '♻️ 電池回收';
            
            // 完美修復的 Google Maps URL 格式
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;

            // 彈出視窗內容
            const popupHTML = `
                <span class="badge ${badgeClass}">${badgeText}</span>
                <h3 style="margin:4px 0; font-size:16px;">${loc.name}</h3>
                <p style="margin:2px 0; font-size:12px; color:#7f8c8d;">營運/認可機構: ${loc.provider}</p>
                <div style="margin-top:8px; font-size:13px; line-height:1.4;">${loc.details}</div>
                <a href="${mapUrl}" target="_blank" class="popup-route-btn">🧭 導航一條龍帶你去</a>
            `;

            // 建立大頭針並加入地圖
            const marker = L.marker([loc.lat, loc.lng]).bindPopup(popupHTML);
            marker.addTo(map);
            currentMarkers.push(marker); // 存入記錄以便下次清除
        }
    });
}

// 5. 分類篩選控制（按鈕觸發）
function filterMarkers(type) {
    currentFilter = type;
    
    // 更新按鈕的 CSS 高亮狀態
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    if(type === 'all') document.getElementById('btn-all').classList.add('active');
    if(type === 'charging') document.getElementById('btn-charging').classList.add('active');
    if(type === 'recycle') document.getElementById('btn-recycle').classList.add('active');

    // 重新畫大頭針
    renderMarkers();
}

// 首次開啟網頁，直接畫出所有大頭針
renderMarkers();
