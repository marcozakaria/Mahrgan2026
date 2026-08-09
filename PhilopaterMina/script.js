let zIndexCounter = 10;

// 1. فتح وإغلاق النوافذ والتحكم في الطبقات والسحب
function openApp(appId) {
    const win = document.getElementById(appId);
    win.style.display = 'block';
    win.style.zIndex = ++zIndexCounter;
}
function closeApp(appId) { document.getElementById(appId).style.display = 'none'; }

document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => { win.style.zIndex = ++zIndexCounter; });
});

document.querySelectorAll('.window').forEach(makeDraggable);
function makeDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = elmnt.querySelector(".title-bar");
    if (header) { header.onmousedown = dragMouseDown; }

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX; pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
        pos3 = e.clientX; pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
}

// 2. كود الساعة
function updateClock() {
    const now = new Date();
    document.getElementById('clock-display').innerText = now.toLocaleTimeString('ar-EG');
}
setInterval(updateClock, 1000);
updateClock();

// 3. كود الآلة الحاسبة
const calcDisplay = document.getElementById('calc-display');
function calcInput(val) { calcDisplay.value = calcDisplay.value === '0' ? val : calcDisplay.value + val; }
function calcClear() { calcDisplay.value = '0'; }
function calcResult() { try { calcDisplay.value = eval(calcDisplay.value); } catch (e) { calcDisplay.value = 'خطأ'; } }

// 4. كود الطقس
async function getWeather() {
    document.getElementById('weather-desc').innerText = "جاري التحميل...";
    try {
        let response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=30.0444&longitude=31.2357&current_weather=true");
        let data = await response.json();
        document.getElementById('weather-temp').innerText = data.current_weather.temperature + "°C";
        document.getElementById('weather-desc').innerText = "تم تحديث طقس القاهرة!";
    } catch (error) {
        document.getElementById('weather-desc').innerText = "خطأ في الاتصال!";
    }
}

// 5. كود لعبة X O
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

function makeMove(cell, index) {
    if (board[index] === "" && gameActive) {
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if(gameActive) document.getElementById("game-status").innerText = "دور اللاعب: " + currentPlayer;
    }
}
function checkWinner() {
    const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById("game-status").innerText = "🎉 الفائز هو: " + board[a];
            gameActive = false; return;
        }
    }
    if (!board.includes("")) { document.getElementById("game-status").innerText = "تعادل!"; gameActive = false; }
}
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""]; currentPlayer = "X"; gameActive = true;
    document.getElementById("game-status").innerText = "دور اللاعب: X";
    document.querySelectorAll('.cell').forEach(cell => cell.innerText = "");
}

// 6. كود المفكرة
const notepadText = document.getElementById('notepad-text');
if(localStorage.getItem('bronto_note')) { notepadText.value = localStorage.getItem('bronto_note'); }
function saveNote() { localStorage.setItem('bronto_note', notepadText.value); alert('تم الحفظ بنجاح!'); }



// 7. كود شريط الأخبار الشامل (العالم ومصر) لنظام Bronto OS 2
async function fetchLiveNews() {
    const newsTextElement = document.getElementById('news-text');
    newsTextElement.innerText = "📰 جاري تحديث شريط الأخبار العالمي والمصري... 🌐";
    
    try {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        // الـ API العالمي المستقر من ويكيبيديا لجلب الأحداث العامة باللغة العربية
        let response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/ar/onthisday/all/${month}/${day}`);
        let data = await response.json();
        
        if (data.selected && data.selected.length > 0) {
            let newsIndex = 0;
            
            if(window.newsTimer) clearInterval(window.newsTimer);
            
            // تدوير الأخبار العامة كل 5 ثوانٍ
            window.newsTimer = setInterval(() => {
                let text = data.selected[newsIndex].text;
                
                // تمييز الأخبار: لو النص يخص الشأن المحلي نضع علم مصر، وإلا نضع الكرة الأرضية لأي حدث عالمي
                let prefix = "🌍 خبر عالمي: ";
                if (text.includes("مصر") || text.includes("القاهرة") || text.includes("المصرية") || text.includes("الإسكندرية")) {
                    prefix = "🇪🇬 حدث في مصر: ";
                }
                
                newsTextElement.innerText = prefix + text;
                newsIndex = (newsIndex + 1) % Math.min(data.selected.length, 15); // تدوير أول 15 خبر
            }, 5000);
            
        } else {
            showFallbackNews();
        }
    } catch (error) {
        // الخطة البديلة المدمجة للنظام عند انقطاع الاتصال
        showFallbackNews();
    }
}

// دالة النشرة الإخبارية الرسمية لمميزات Bronto OS 2 (الاحتياطية المدمجة)
function showFallbackNews() {
    const newsTextElement = document.getElementById('news-text');
    const backupNews = [
        "🚀 إطلاق نظام التشغيل Bronto OS 2 رسمياً بالتحديث الجذري الجديد كلياً!",
        "🌐 إصدار Bronto OS 2 يأتي مدمجاً بمتصفح إنترنت متكامل يدعم تصفح المواقع الإلكترونية.",
        "🎨 إضافة تطبيق 'الرسام' الجديد كلياً مع لوحة رسم (Canvas) وأدوات مسح متطورة.",
        "🎮 تفعيل لعبة X O الكلاسيكية مدمجة داخل النظام مع نظام ذكي لتحديد الفائز وحساب التعادل.",
        "📝 تحديث تطبيق المفكرة (Notepad) مع ميزة الحفظ التلقائي في الذاكرة المحلية (Local Storage).",
        "🎵 إطلاق مشغل الموسيقى الرسمي (Music Player) داخل النظام لدعم تشغيل المسارات الصوتية.",
        "⚙️ إضافة لوحة الإعدادات المتقدمة لتخصيص مظهر النظام وتغيير الخلفيات (طبيعة، فضاء، وضع مظلم).",
        "🕒 نظام الطقس والساعة في Bronto OS 2 يعملان الآن بتحديثات حية ومباشرة."
    ];
    
    let backupIndex = 0;
    if(window.newsTimer) clearInterval(window.newsTimer);
    
    window.newsTimer = setInterval(() => {
        newsTextElement.innerText = "📰 " + backupNews[backupIndex];
        backupIndex = (backupIndex + 1) % backupNews.length;
    }, 4000);
}

// إقلاع شريط الأخبار فوراً عند فتح النظام
fetchLiveNews();

// 8. كود المتصفح
function loadUrl() {
    let url = document.getElementById('browser-url').value;
    // التأكد من وجود http أو https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    document.getElementById('browser-iframe').src = url;
}

// 9. كود الرسام (Canvas)
const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', (e) => { isDrawing = true; draw(e); });
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => { isDrawing = false; ctx.beginPath(); });

function draw(e) {
    if (!isDrawing) return;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2c3e50';

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}
function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

// 10. كود الإعدادات (تغيير الخلفية)
function changeBg(type) {
    if (type === 'nature') {
        document.body.style.background = "url('https://images.unsplash.com/photo-1506744626753-df830113f8ce?q=80&w=2070') no-repeat center center/cover";
    } else if (type === 'space') {
        document.body.style.background = "url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2070') no-repeat center center/cover";
    } else if (type === 'dark') {
        document.body.style.background = "#1e1e1e";
    }
}