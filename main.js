import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
//  レスポンシブ / 座標管理設定
// ==========================================

// スマホ判定（768px以下）
function isMobile() {
    return window.innerWidth <= 768;
}

// 座標取得用ヘルパー関数
// offX, offY, offZ はスマホ時の位置補正用
function getResponsivePos(x, y, z, offX = 0, offY = 0, offZ = 0) {
    if (isMobile()) {
        return new THREE.Vector3(x + offX, y + offY, z + offZ);
    }
    return new THREE.Vector3(x, y, z);
}

// --- カメラ座標の設定 ---

// A地点: 変更なし
const getPosA = () => getResponsivePos(-25, 4, 16, -10, 0, 35);
const tarA = new THREE.Vector3(-2, 0, 0);

// F地点: 変更なし
const getPosF = () => getResponsivePos(-15, 5, 20, -10, 2, 35);
const tarF = new THREE.Vector3(-2, -2, 0);

// B地点: スマホ時は少し上に(Y+2)、後ろに(Z+45)引いて全体が見えるように調整
const getPosB = () => getResponsivePos(0, 1.5, 20, 0, 2, 45);
const tarB = new THREE.Vector3(0, -1, 0);

// C地点: 変更なし
const getPosC = () => getResponsivePos(-11.18, 0.85, -0.38, 0, 0, 2);
const tarC = new THREE.Vector3(-11.18, -1, -0.381);

// D地点: スマホ時は後ろに大きく引く(Z+25)
const getPosD = () => getResponsivePos(0, 0, 2, 0, 0, 25);
const tarD = new THREE.Vector3(0, 0, -10);

// E地点: スマホ時は後ろに大きく引く(Z+25)
const getPosE = () => getResponsivePos(12.05, 0.1, 1, 0, 0, 25);
const tarE = new THREE.Vector3(12.05, 0.1, -10);


// --- 背景色の設定 ---
const defaultBgColor = new THREE.Color(0xf4f4f4);
const colorF = new THREE.Color(0xf4f4f4);
const colorC = new THREE.Color(0xf7e88d);
const colorD = new THREE.Color(0xf3a061);
const colorE = new THREE.Color(0x8fd2e4);

// 現在地管理
let currentLocation = 'A';

// --- HTML要素の取得 ---
const flatContent = document.getElementById('flat-content');
const contentF       = document.getElementById('content-f');
const contentD       = document.getElementById('content-d');
const contentC       = document.getElementById('content-c');
const contentE       = document.getElementById('content-e');

const contentD_Left  = document.getElementById('content-d-left');
const contentD_Right = document.getElementById('content-d-right');
const contentC_Left  = document.getElementById('content-c-left');
const contentC_Right = document.getElementById('content-c-right');
const contentE_Left  = document.getElementById('content-e-left');
const contentE_Right = document.getElementById('content-e-right');

const contentB_Center = document.getElementById('content-b-center');
const contentF_Center = document.getElementById('content-f-center');
const holeB = document.getElementById('hole-b');

const typewriterContent = document.getElementById('typewriter-text');
if (typewriterContent) {
    typewriterContent.style.display = 'none';
}

// ヘッダーナビ
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
camera.position.copy(getPosA());

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
    if(contentD_Left)  contentD_Left.classList.remove('visible');
    if(contentD_Right) contentD_Right.classList.remove('visible');
    if(contentC_Left)  contentC_Left.classList.remove('visible');
    if(contentC_Right) contentC_Right.classList.remove('visible');
    if(contentE_Left)  contentE_Left.classList.remove('visible');
    if(contentE_Right) contentE_Right.classList.remove('visible');

    if(contentF)       contentF.classList.remove('visible');
    if(contentD)       contentD.classList.remove('visible');
    if(contentC)       contentC.classList.remove('visible');
    if(contentE)       contentE.classList.remove('visible');

    if(holeB) holeB.classList.remove('visible');

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

    if (!location) return;

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

// ==========================================
//  ★追加: 全てのスクロール連動画像を強制的に消す関数
// ==========================================
function resetScrollImages() {
    const visibleImages = document.querySelectorAll('.fade-in-image.is-visible');
    visibleImages.forEach(img => {
        img.classList.remove('is-visible');
    });
}

// ★★★ 移動実行関数 ★★★
function executeMove(targetLook, newLocationName) {
    controls.enabled = false; 
    clearTypewriter();
    updateContentVisibility(null);
    
    // ★追加: 移動開始時にスクロール連動画像をリセット
    resetScrollImages();

    if (headerNav) {
        if (newLocationName === 'F') {
            scrollAmountF = 0;
            if (contentF) contentF.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        } else {
            if (contentF) contentF.style.backgroundColor = '';
        }
    }

    setTimeout(() => {
        let targetColor = defaultBgColor;
        let finalTargetPos;
        if (newLocationName === 'F') { targetColor = colorF; finalTargetPos = getPosF(); }
        else if (newLocationName === 'C') { targetColor = colorC; finalTargetPos = getPosC(); }
        else if (newLocationName === 'D') { targetColor = colorD; finalTargetPos = getPosD(); }
        else if (newLocationName === 'E') { targetColor = colorE; finalTargetPos = getPosE(); }
        else if (newLocationName === 'B') { finalTargetPos = getPosB(); } 
        else { finalTargetPos = getPosA(); }

        gsap.to(scene.background, {
            r: targetColor.r, g: targetColor.g, b: targetColor.b,
            duration: 2.5,
            ease: "power2.inOut"
        });

        const startPos = camera.position.clone();
        const controlPos = startPos.clone().lerp(finalTargetPos, 0.5);
        controlPos.z += 15; 

        const curve = new THREE.QuadraticBezierCurve3(startPos, controlPos, finalTargetPos);
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
                if (headerNav) headerNav.classList.add('visible');

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
                updateContentVisibility(currentLocation);
                console.log(`Moved to: ${currentLocation}`);
            }
        });
    }, 500);
}


// --- ボタンイベント ---
if (btnToBFromF) {
    btnToBFromF.addEventListener('click', (e) => {
        e.stopPropagation();
        executeMove(tarB, 'B');
    });
}
if (btnToD) { btnToD.addEventListener('click', (e) => { e.stopPropagation(); executeMove(tarD, 'D'); }); }
if (btnToE) { btnToE.addEventListener('click', (e) => { e.stopPropagation(); executeMove(tarE, 'E'); }); }
if (btnToB) { btnToB.addEventListener('click', (e) => { e.stopPropagation(); executeMove(tarB, 'B'); }); }

if (navBtnB) { navBtnB.addEventListener('click', (e) => { e.stopPropagation(); executeMove(tarB, 'B'); }); }
if (navBtnF) { navBtnF.addEventListener('click', (e) => { e.stopPropagation(); executeMove(tarF, 'F'); }); }
if (navBtnC) { navBtnC.addEventListener('click', (e) => { e.stopPropagation(); executeMove(tarC, 'C'); }); }
if (navBtnD) { navBtnD.addEventListener('click', (e) => { e.stopPropagation(); executeMove(tarD, 'D'); }); }
if (navBtnE) { navBtnE.addEventListener('click', (e) => { e.stopPropagation(); executeMove(tarE, 'E'); }); }


// --- Welcome画面からのスタート ---
let hasStarted = false;
function startExperience() {
    if (hasStarted) return; 
    hasStarted = true;
    if (flatContent) flatContent.classList.add('hidden');
    
    executeMove(tarF, 'F');
}

// --- スクロール・タッチ操作 ---
function updateFLocationEffect(delta) {
    if (currentLocation !== 'F') return;
    scrollAmountF += delta;
    if (scrollAmountF < 0) scrollAmountF = 0; 
    
    if (contentF) {
        const maxScroll = 300;
        const ratio = Math.min(scrollAmountF / maxScroll, 1);
        const newAlpha = 0.2 + (ratio * 0.8);
        contentF.style.backgroundColor = `rgba(255, 255, 255, ${newAlpha})`;
    }
}
window.addEventListener('wheel', (e) => { 
    if (!hasStarted) startExperience(); 
    updateFLocationEffect(e.deltaY);
});
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    if (!hasStarted) startExperience();
    touchStartY = e.touches[0].clientY;
});
window.addEventListener('touchmove', (e) => {
    if (currentLocation !== 'F') return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY; 
    updateFLocationEffect(diff * 2.0);
    touchStartY = currentY;
});
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
    if (event.target.closest('button')) return; // ボタン要素の中身をクリックした場合も考慮
    if (event.target.closest('.hamburger-btn') || event.target.closest('.nav-menu')) return;

    // ★ F地点での移動禁止（ボタン以外）
    if (currentLocation === 'F') {
        return; 
    }

    // 他の地点の移動ロジック
    if (currentLocation === 'A') {
        executeMove(tarF, 'F');
    }
    else if (currentLocation === 'B') {
        executeMove(tarC, 'C');
    }
});

// --- リサイズ処理 ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (controls.enabled && hasStarted) {
        let newPos;
        switch(currentLocation) {
            case 'F': newPos = getPosF(); break;
            case 'B': newPos = getPosB(); break;
            case 'C': newPos = getPosC(); break;
            case 'D': newPos = getPosD(); break;
            case 'E': newPos = getPosE(); break;
            default:  newPos = getPosA();
        }
        gsap.to(camera.position, {
            x: newPos.x, y: newPos.y, z: newPos.z,
            duration: 0.5,
            ease: "power2.out"
        });
    }
});

// --- ハンバーガーメニュー制御 ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');
const navButtons = document.querySelectorAll('.nav-menu button');

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            hamburgerBtn.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });
}

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

    if (!loopVideo || !introVideo) {
        if(loadingScreen) loadingScreen.classList.add('loaded');
        startExperience();
        return;
    }

    loopVideo.pause();
    loopVideo.style.display = 'none';

    introVideo.style.display = 'block';
    introVideo.play().catch(e => console.log("再生エラー:", e));

    introVideo.onended = function() {
        if(loadingScreen) loadingScreen.classList.add('loaded');
        setTimeout(() => {
            startExperience();
        }, 500); 
    };
}


function initScrollTriggers() {
    const observerOptions = {
        root: null,        // 画面全体を基準
        rootMargin: '-10% 0px -45% 0px', // 画面の上下10%は「見えていない」とみなす
        threshold: 0       // ほんの少しでも見えたら反応開始
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // HTMLの data-target 属性で指定された画像IDを取得
            const targetId = entry.target.getAttribute('data-target');
            const targetImage = document.getElementById(targetId);

            if (targetImage) {
                // 文章が画面内にあるかチェック
                if (entry.isIntersecting) {
                    // 見えている時：クラスをつける
                    targetImage.classList.add('is-visible');
                } else {
                    // 見えなくなった時：クラスを外す
                    targetImage.classList.remove('is-visible');
                }
            }
        });
    }, observerOptions);

    // .text-trigger クラスがついている全ての要素を監視
    const triggers = document.querySelectorAll('.text-trigger');
    triggers.forEach(trigger => observer.observe(trigger));
}

document.addEventListener('DOMContentLoaded', () => {
    initScrollTriggers();
});