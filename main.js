import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- 設定項目 ---

// 背景色の設定
const defaultBgColor = new THREE.Color(0xf4f4f4);
const colorC = new THREE.Color(0xE8DB7D);
const colorD = new THREE.Color(0xE8974E);
const colorE = new THREE.Color(0x6AC9DE);

// カメラ座標の設定
const posA = new THREE.Vector3(-22, 2, 14);
const tarA = new THREE.Vector3(-2, 0, 0);

const posB = new THREE.Vector3(0, 3, 20);
const tarB = new THREE.Vector3(0, -1, 0);

const posC = new THREE.Vector3(-11.18, 0.3, -0.38);
const tarC = new THREE.Vector3(-11.18, -1, -0.381);

const posD = new THREE.Vector3(0, 0, 1.5);
const tarD = new THREE.Vector3(0, 0, -10);

const posE = new THREE.Vector3(10.92, 0, 1.3);
const tarE = new THREE.Vector3(10.92, 0, -10);

// 現在地管理
let currentLocation = 'A';

// --- HTML要素の取得 ---
const flatContent = document.getElementById('flat-content');

// コンテンツ（テキストなど）
const contentD       = document.getElementById('content-d');
const contentC       = document.getElementById('content-c');
const contentE       = document.getElementById('content-e');

// 左右のスライド画像たち
const contentD_Left  = document.getElementById('content-d-left');
const contentD_Right = document.getElementById('content-d-right');

const contentC_Left  = document.getElementById('content-c-left');
const contentC_Right = document.getElementById('content-c-right');

const contentE_Left  = document.getElementById('content-e-left');
const contentE_Right = document.getElementById('content-e-right');


// タイプライター用の要素
const typewriterContent = document.getElementById('typewriter-text');
if (typewriterContent) {
    typewriterContent.style.display = 'none';
}

// 空間内のボタン
const btnToD = document.getElementById('btn-to-d');
const btnToE = document.getElementById('btn-to-e');
const btnToB = document.getElementById('btn-to-b');

// ヘッダーのナビゲーションボタン
const navBtnB = document.getElementById('nav-btn-b');
const navBtnC = document.getElementById('nav-btn-c');
const navBtnD = document.getElementById('nav-btn-d');
const navBtnE = document.getElementById('nav-btn-e');

// ----------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(defaultBgColor);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(posA);

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ライトの設定
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
    // 1. まず全部隠す
    if(contentD_Left)  contentD_Left.classList.remove('visible');
    if(contentD_Right) contentD_Right.classList.remove('visible');
    
    if(contentC_Left)  contentC_Left.classList.remove('visible');
    if(contentC_Right) contentC_Right.classList.remove('visible');
    
    if(contentE_Left)  contentE_Left.classList.remove('visible');
    if(contentE_Right) contentE_Right.classList.remove('visible');

    if(contentD)       contentD.classList.remove('visible');
    if(contentC)       contentC.classList.remove('visible');
    if(contentE)       contentE.classList.remove('visible');

    // 引数が null なら全部消した状態で終了（移動開始時など）
    if (!location) return;

    // 2. 現在地に合わせて表示
    if (location === 'D') {
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

// --- タイプライター関数 ---
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
            typewriterTimeout = setTimeout(typing, 100); 
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


// ★★★ 移動実行関数（修正版：消えてから動く） ★★★
function executeMove(targetPos, targetLook, newLocationName) {
    controls.enabled = false; 
    
    // 1. まずタイプライターと、すべてのオーバーレイ画像を消す
    clearTypewriter();
    updateContentVisibility(null); // 全部非表示にする

    // 2. CSSの「消えるアニメーション」が終わるまで待つ
    // CSSで opacity 0.5s と transform 0.5s になっているので、
    // 余裕を持って 800ms (0.8秒) 待ちます。
    setTimeout(() => {

        // --- ここからカメラ移動開始 ---

        let targetColor = defaultBgColor;
        if (newLocationName === 'C') targetColor = colorC;
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
                } else if (['C', 'D', 'E'].includes(currentLocation)) {
                    controls.enableRotate = false;
                } else {
                    controls.enableRotate = true;
                    controls.rotateSpeed = 0.5;
                }

                // 3. 移動が終わったら、新しい地点の画像を表示する
                updateContentVisibility(currentLocation);
                console.log(`Moved to: ${currentLocation}`);
            }
        });

    }, 200); // ★ここが待ち時間（ミリ秒）です
}


// --- 空間内のボタン ---
if (btnToD) {
    btnToD.addEventListener('click', (e) => {
        e.stopPropagation(); 
        executeMove(posD, tarD, 'D');
    });
}
if (btnToE) {
    btnToE.addEventListener('click', (e) => {
        e.stopPropagation();
        executeMove(posE, tarE, 'E');
    });
}
if (btnToB) {
    btnToB.addEventListener('click', (e) => {
        e.stopPropagation();
        executeMove(posB, tarB, 'B');
    });
}

// --- ヘッダーメニュー ---
if (navBtnB) {
    navBtnB.addEventListener('click', (e) => {
        e.stopPropagation();
        executeMove(posB, tarB, 'B');
    });
}
if (navBtnC) {
    navBtnC.addEventListener('click', (e) => {
        e.stopPropagation();
        executeMove(posC, tarC, 'C');
    });
}
if (navBtnD) {
    navBtnD.addEventListener('click', (e) => {
        e.stopPropagation();
        executeMove(posD, tarD, 'D');
    });
}
if (navBtnE) {
    navBtnE.addEventListener('click', (e) => {
        e.stopPropagation();
        executeMove(posE, tarE, 'E');
    });
}


// --- Welcome画面からのスタート ---
let hasStarted = false;

function startExperience() {
    if (hasStarted) return; 
    hasStarted = true;

    if (flatContent) {
        flatContent.classList.add('hidden');
    }
    // ここも executeMove を使うので、「少し待ってから移動」になります。
    // A地点にはオーバーレイがないので待つ必要はないですが、
    // 統一された動き（タメてから飛ぶ）として違和感はないはずです。
    executeMove(posB, tarB, 'B');
}

window.addEventListener('wheel', () => {
    if (!hasStarted) startExperience();
});
window.addEventListener('touchstart', () => {
    if (!hasStarted) startExperience();
});
if (flatContent) {
    flatContent.addEventListener('click', () => {
        if (!hasStarted) startExperience();
    });
}


// --- 画面全体のクリック ---
let isDragging = false;
window.addEventListener('mousedown', () => { isDragging = false; });
window.addEventListener('mousemove', () => { isDragging = true; });

window.addEventListener('mouseup', (event) => {
    if (isDragging) return;
    if (!controls.enabled) return;
    if (!hasStarted) return;
    if (event.target.tagName === 'BUTTON') return;

    const clickRatio = event.clientX / window.innerWidth;

    if (currentLocation === 'A') {
        executeMove(posB, tarB, 'B');
    } 
    else if (currentLocation === 'B') {
        if (clickRatio < 0.33) executeMove(posC, tarC, 'C');
        else if (clickRatio > 0.66) executeMove(posE, tarE, 'E');
        else executeMove(posD, tarD, 'D');
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