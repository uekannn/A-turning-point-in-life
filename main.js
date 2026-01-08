import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- 設定項目 ---

// 背景色の設定
const defaultBgColor = new THREE.Color(0xf4f4f4);
const colorF = new THREE.Color(0xf4f4f4);
const colorC = new THREE.Color(0xf7e88d);
const colorD = new THREE.Color(0xf3a061);
const colorE = new THREE.Color(0x8fd2e4);

// カメラ座標の設定
const posA = new THREE.Vector3(-25, 4, 16);
const tarA = new THREE.Vector3(-2, 0, 0);

const posF = new THREE.Vector3(-15, 5, 20); 
const tarF = new THREE.Vector3(-2, -2, 0);

const posB = new THREE.Vector3(0, 1.5, 20);
const tarB = new THREE.Vector3(0, -1, 0);

const posC = new THREE.Vector3(-11.18, 0.85, -0.38);
const tarC = new THREE.Vector3(-11.18, -1, -0.381);

const posD = new THREE.Vector3(0, 0, 2);
const tarD = new THREE.Vector3(0, 0, -10);

const posE = new THREE.Vector3(12.05, 0.1, 1);
const tarE = new THREE.Vector3(12.05, 0.1, -10);

// 現在地管理
let currentLocation = 'A';

// --- HTML要素の取得 ---
const flatContent = document.getElementById('flat-content');

// コンテンツ（テキストボックス）
const contentF       = document.getElementById('content-f');
const contentD       = document.getElementById('content-d');
const contentC       = document.getElementById('content-c');
const contentE       = document.getElementById('content-e');

// 左右のスライド画像
const contentD_Left  = document.getElementById('content-d-left');
const contentD_Right = document.getElementById('content-d-right');
const contentC_Left  = document.getElementById('content-c-left');
const contentC_Right = document.getElementById('content-c-right');
const contentE_Left  = document.getElementById('content-e-left');
const contentE_Right = document.getElementById('content-e-right');

// 全画面画像
const contentB_Center = document.getElementById('content-b-center');
const contentF_Center = document.getElementById('content-f-center');

// 穴マスク
const holeB = document.getElementById('hole-b');

// タイプライター
const typewriterContent = document.getElementById('typewriter-text');
if (typewriterContent) {
    typewriterContent.style.display = 'none';
}

// ヘッダーナビ & スクロール監視
const headerNav = document.querySelector('.site-header'); 
let scrollAmountF = 0; 

// 空間内のボタン
const btnToBFromF = document.getElementById('btn-to-b-from-f'); 
const btnToD = document.getElementById('btn-to-d');
const btnToE = document.getElementById('btn-to-e');
const btnToB = document.getElementById('btn-to-b');

// ヘッダーナビボタン
const navBtnB = document.getElementById('nav-btn-b');
const navBtnF = document.getElementById('nav-btn-f');
const navBtnC = document.getElementById('nav-btn-c');
const navBtnD = document.getElementById('nav-btn-d');
const navBtnE = document.getElementById('nav-btn-e');


// ----------------
// Three.js 初期化
const scene = new THREE.Scene();
scene.background = new THREE.Color(defaultBgColor);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(posA);

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ライト
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(-5, 10, 3);
directionalLight.castShadow = true;
scene.add(directionalLight);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; 
controls.target.copy(tarA);
controls.enablePan = false;
controls.enableZoom = false;
controls.enableRotate = true;
controls.rotateSpeed = 0.5; 

const loader = new GLTFLoader();
loader.load('./model.glb', (gltf) => {
    scene.add(gltf.scene);
}, undefined, (err) => console.error(err));


// ★★★ 表示切り替え関数 ★★★
function updateContentVisibility(location) {
    // --- 1. 他の要素を隠す処理 ---
    
    // 左右スライド画像
    if(contentD_Left)  contentD_Left.classList.remove('visible');
    if(contentD_Right) contentD_Right.classList.remove('visible');
    if(contentC_Left)  contentC_Left.classList.remove('visible');
    if(contentC_Right) contentC_Right.classList.remove('visible');
    if(contentE_Left)  contentE_Left.classList.remove('visible');
    if(contentE_Right) contentE_Right.classList.remove('visible');

    // テキストボックス
    if(contentF)       contentF.classList.remove('visible');
    if(contentD)       contentD.classList.remove('visible');
    if(contentC)       contentC.classList.remove('visible');
    if(contentE)       contentE.classList.remove('visible');

    // 穴マスク
    if(holeB) holeB.classList.remove('visible');

    // --- 全画面画像の退場アニメーション処理 ---
    if(contentB_Center) {
        if (contentB_Center.classList.contains('visible')) {
            contentB_Center.classList.remove('visible');
            contentB_Center.classList.add('hiding');
        } else {
            contentB_Center.classList.remove('visible');
        }
    }
    
    if(contentF_Center) {
        if (contentF_Center.classList.contains('visible')) {
            contentF_Center.classList.remove('visible');
            contentF_Center.classList.add('hiding');
        } else {
            contentF_Center.classList.remove('visible');
        }
    }

    if (!location) return; // 移動開始直後の呼び出しならここで終了

    // --- 2. 現在地に合わせて表示する処理 ---
    if (location === 'B') {
        if(contentB_Center) {
            contentB_Center.classList.remove('hiding');
            contentB_Center.classList.add('visible');
        }
        if(holeB) holeB.classList.add('visible');
    }
    else if (location === 'F') {
        if(contentF) contentF.classList.add('visible');
        if(contentF_Center) {
            contentF_Center.classList.remove('hiding');
            contentF_Center.classList.add('visible');
        }
    }
    else if (location === 'D') {
        if(contentD_Left)  contentD_Left.classList.add('visible');
        if(contentD_Right) contentD_Right.classList.add('visible');
        if(contentD)       contentD.classList.add('visible');
    } 
    else if (location === 'C') {
        if(contentC_Left)  contentC_Left.classList.add('visible');
        if(contentC_Right) contentC_Right.classList.add('visible');
        if(contentC)       contentC.classList.add('visible');
    } 
    else if (location === 'E') {
        if(contentE_Left)  contentE_Left.classList.add('visible');
        if(contentE_Right) contentE_Right.classList.add('visible');
        if(contentE)       contentE.classList.add('visible');
    }
}

// --- タイプライター ---
let typewriterTimeout;
function startTypewriter(text) {
    if (!typewriterContent) return;
    typewriterContent.style.display = 'block';
    typewriterContent.innerHTML = '';
    clearTimeout(typewriterTimeout);
    let i = 0;
    function typing() {
        if (i < text.length) {
            typewriterContent.innerHTML += text.charAt(i);
            i++;
            typewriterTimeout = setTimeout(typing, 80); 
        }
    }
    typing();
}
function clearTypewriter() {
    if (typewriterContent) {
        typewriterContent.style.display = 'none';
        typewriterContent.innerHTML = '';
        clearTimeout(typewriterTimeout);
    }
}


// ★★★ 移動実行関数 ★★★
function executeMove(targetPos, targetLook, newLocationName) {
    controls.enabled = false; 
    clearTypewriter();
    
    // 移動開始（画像の退場アニメ開始）
    updateContentVisibility(null); 

    // ▼▼▼ ヘッダーと背景透明度のリセット処理 ▼▼▼
    if (headerNav) {
        // ★変更点: 場所に関係なくヘッダーは常に表示 (.visible を追加)
        headerNav.classList.add('visible');

        if (newLocationName === 'F') {
            // Fへ行く時: スクロール量をリセット
            scrollAmountF = 0;

            // Fの背景を初期値（半透明 0.2）に戻す
            if (contentF) {
                contentF.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }
        } else {
            // それ以外へ行く時:
            // 背景色のスタイルをリセット（CSS定義に戻す）
            if (contentF) {
                contentF.style.backgroundColor = '';
            }
        }
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 0.5秒待ってから移動
    setTimeout(() => {
        let targetColor = defaultBgColor;
        if (newLocationName === 'F') targetColor = colorF;
        else if (newLocationName === 'C') targetColor = colorC;
        else if (newLocationName === 'D') targetColor = colorD;
        else if (newLocationName === 'E') targetColor = colorE;

        gsap.to(scene.background, {
            r: targetColor.r, g: targetColor.g, b: targetColor.b,
            duration: 2.5,
            ease: "power2.inOut"
        });

        const startPos = camera.position.clone();
        const controlPos = startPos.clone().lerp(targetPos, 0.5);
        controlPos.z += 15; 

        const curve = new THREE.QuadraticBezierCurve3(startPos, controlPos, targetPos);
        const progress = { value: 0 };

        gsap.to(progress, {
            value: 1,
            duration: 2.5,
            ease: "power2.inOut",
            onUpdate: () => {
                const point = curve.getPoint(progress.value);
                camera.position.copy(point);
            }
        });

        gsap.to(controls.target, {
            x: targetLook.x, y: targetLook.y, z: targetLook.z,
            duration: 2.5,
            ease: "power2.inOut",
            onUpdate: () => controls.update(),
            onComplete: () => {
                currentLocation = newLocationName;
                controls.enabled = true;

                if (currentLocation === 'B') {
                    controls.enableRotate = true;
                    controls.rotateSpeed = 0.2; 
                    startTypewriter("Click anywhere to begin");
                } 
                else if (currentLocation === 'F') {
                    controls.enableRotate = true;
                    controls.rotateSpeed = 0.2;
                }
                else if (['C', 'D', 'E'].includes(currentLocation)) {
                    controls.enableRotate = false;
                } else {
                    controls.enableRotate = true;
                    controls.rotateSpeed = 0.5;
                }

                // 移動完了後（画像の入場アニメ開始）
                updateContentVisibility(currentLocation);
                console.log(`Moved to: ${currentLocation}`);
            }
        });
    }, 500);
}


// --- ボタンイベント ---

// 空間内のボタン
if (btnToBFromF) {
    btnToBFromF.addEventListener('click', (e) => {
        e.stopPropagation();
        executeMove(posB, tarB, 'B');
    });
}
if (btnToD) { btnToD.addEventListener('click', (e) => { e.stopPropagation(); executeMove(posD, tarD, 'D'); }); }
if (btnToE) { btnToE.addEventListener('click', (e) => { e.stopPropagation(); executeMove(posE, tarE, 'E'); }); }
if (btnToB) { btnToB.addEventListener('click', (e) => { e.stopPropagation(); executeMove(posB, tarB, 'B'); }); }

// ヘッダーナビボタン
if (navBtnB) { navBtnB.addEventListener('click', (e) => { e.stopPropagation(); executeMove(posB, tarB, 'B'); }); }
if (navBtnF) { navBtnF.addEventListener('click', (e) => { e.stopPropagation(); executeMove(posF, tarF, 'F'); }); }
if (navBtnC) { navBtnC.addEventListener('click', (e) => { e.stopPropagation(); executeMove(posC, tarC, 'C'); }); }
if (navBtnD) { navBtnD.addEventListener('click', (e) => { e.stopPropagation(); executeMove(posD, tarD, 'D'); }); }
if (navBtnE) { navBtnE.addEventListener('click', (e) => { e.stopPropagation(); executeMove(posE, tarE, 'E'); }); }


// --- Welcome画面からのスタート ---
let hasStarted = false;

function startExperience() {
    if (hasStarted) return; 
    hasStarted = true;

    if (flatContent) {
        flatContent.classList.add('hidden');
    }
    
    // ★追加点: 開始時にヘッダーを必ず表示
    if (headerNav) {
        headerNav.classList.add('visible');
    }

    // 最初は F (プロローグ) へ
    executeMove(posF, tarF, 'F');
}

window.addEventListener('wheel', (e) => { 
    if (!hasStarted) startExperience(); 

    // ▼▼▼ F地点：背景透明度の制御のみ残す（ヘッダー制御は削除） ▼▼▼
    if (currentLocation === 'F') {
        // 下にスクロール(deltaY > 0)で加算
        scrollAmountF += e.deltaY;
        if (scrollAmountF < 0) scrollAmountF = 0; // マイナス防止
        
        // ヘッダー表示制御のif文は削除済み

        // 背景透明度の制御（0.2 〜 1.0 に変化）
        if (contentF) {
            // 0px〜500pxの間で変化させる
            const maxScroll = 300;
            const ratio = Math.min(scrollAmountF / maxScroll, 1);
            const newAlpha = 0.2 + (ratio * 0.8);
            contentF.style.backgroundColor = `rgba(255, 255, 255, ${newAlpha})`;
        }
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
});

window.addEventListener('touchstart', () => { if (!hasStarted) startExperience(); });
if (flatContent) {
    flatContent.addEventListener('click', () => { if (!hasStarted) startExperience(); });
}


// --- 画面クリック ---
let isDragging = false;
window.addEventListener('mousedown', () => { isDragging = false; });
window.addEventListener('mousemove', () => { isDragging = true; });

window.addEventListener('mouseup', (event) => {
    if (isDragging) return;
    if (!controls.enabled) return;
    if (!hasStarted) return;
    if (event.target.tagName === 'BUTTON') return;

    // 現在地ごとのクリック時の移動先設定
    if (currentLocation === 'A') {
        executeMove(posF, tarF, 'F');
    }
    else if (currentLocation === 'F') {
        executeMove(posB, tarB, 'B');
    }
    else if (currentLocation === 'B') {
        executeMove(posC, tarC, 'C');
    } 
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.onload = function() {
    const loadingScreen = document.getElementById('loading');
    const loopVideo = document.getElementById('video-loop');
    const introVideo = document.getElementById('video-intro');

    // 安全策：要素がなければ強制スタート
    if (!loopVideo || !introVideo) {
        if(loadingScreen) loadingScreen.classList.add('loaded');
        startExperience();
        return;
    }

    // ▼ STEP 1: ロード完了！選手交代 ▼
    // ループ動画を止めて隠す
    loopVideo.pause();
    loopVideo.style.display = 'none';

    // イントロ動画を表示して再生
    introVideo.style.display = 'block';
    introVideo.play().catch(e => console.log("再生エラー:", e));

    // ▼ STEP 2: イントロ動画が終わったら ▼
    introVideo.onended = function() {
        // 1. ローディング画面全体をフェードアウト
        if(loadingScreen) loadingScreen.classList.add('loaded');

        // 2. Three.jsのカメラ移動スタート（少し遅らせて余韻を作る）
        setTimeout(() => {
            startExperience();
        }, 500); 
    };
}