import * as THREE from 'three';
import { Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshBasicMaterial, Mesh, AxesHelper} from 'three';    
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 

const scene = new Scene();
scene.background = new THREE.Color(0x000D0F);

var thread_counter1 = 10;
var thread_counter2 = 5;

const camera = new PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建一个中心球体作为网关的替身
const gateway = new SphereGeometry(2, 32, 32);
const gateway_material = new MeshBasicMaterial({ color: 0xA0A0A0 });
const gateway_sphere = new Mesh(gateway, gateway_material);
scene.add(gateway_sphere);

// 添加轨道控制
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

// 添加坐标系
const axesHelper = new AxesHelper(10);
scene.add(axesHelper);

function animate(){
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// function displayDeviceInScene (count, devices_info){
//     // 根据deivice设备数量绘制外围球体
//     for(let i = 1; i < count + 1; i++){
        
//     }
// }

// 自适应窗口大小变化
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});