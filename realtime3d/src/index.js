import * as THREE from 'three';
import { Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshBasicMaterial, Mesh, AxesHelper} from 'three';    
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import starsTexture from './img/stars.jpg'
import earthTexture from './img/pluto.jpg'
import deviceTexture from './img/uranus.jpg'

const scene = new Scene();
scene.background = new THREE.Color(0x000D0F);

// var thread_counter1 = 10;
// var thread_counter2 = 5;

var center_gateway;

const test = {
    "north": [
        {
            "id": "7",
            "type": "mqtt",
            "remote": "192.168.1.90:1883"
        }
    ],
    "south": [
        {
            "id": "3",
            "type": "rtu",
            "remote": "ttyUSB1",
            "devices": [
                {
                    "id": "202408140001",
                    "hwaddr": 1
                },
                {
                    "id": "202408140002",
                    "hwaddr": 2
                },
                {
                    "id": "202408140003",
                    "hwaddr": 3
                },
                {
                    "id": "202408140004",
                    "hwaddr": 4
                },
                {
                    "id": "202408140005",
                    "hwaddr": 5
                },
                {
                    "id": "202408140006",
                    "hwaddr": 6
                },
                {
                    "id": "202408140007",
                    "hwaddr": 7
                },
                {
                    "id": "202408140008",
                    "hwaddr": 8
                },
                {
                    "id": "202408140009",
                    "hwaddr": 9
                },
                {
                    "id": "202408140010",
                    "hwaddr": 10
                },
                {
                    "id": "202408140011",
                    "hwaddr": 11
                },
                {
                    "id": "202408140012",
                    "hwaddr": 12
                },
                {
                    "id": "202408140014",
                    "hwaddr": 14
                },
                {
                    "id": "202408140015",
                    "hwaddr": 15
                },
                {
                    "id": "202408140016",
                    "hwaddr": 16
                },
                {
                    "id": "202408140017",
                    "hwaddr": 17
                }
            ]
        }
    ]
}

const threads = [
    {
        devices: [
            { id: 1, name: 'Device 1A' },
            { id: 2, name: 'Device 2A' },
            { id: 3, name: 'Device 3A' },
            // { id: 4, name: 'Device 4A' },
            // { id: 5, name: 'Device 5A' }
        ]
    },
    {
        devices: [
            { id: 1, name: 'Device 1A' },
            { id: 2, name: 'Device 2A' },
            { id: 3, name: 'Device 3A' },
            { id: 4, name: 'Device 4A' },
            { id: 5, name: 'Device 5A' }
        ]
    }
];


const camera = new PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
])

camera.position.x = 10;
camera.position.y = 5;
camera.position.z = 10;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// 创建一个中心球体作为网关的替身
const gateway = new SphereGeometry(2, 32, 32);
const gateway_material = new THREE.MeshBasicMaterial({ 
    // color: 0xA0A0A0
    map: textureLoader.load(earthTexture)
});
const gateway_sphere = new THREE.Mesh(gateway, gateway_material);
scene.add(gateway_sphere);

// 添加轨道控制
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.autoRotate = true;

// 添加坐标系
const axesHelper = new AxesHelper(10);
scene.add(axesHelper);

displayDeviceInScene(test.south)

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

function displayDeviceInScene (souths){
    // 根据deivice设备数量绘制外围球体
    const centerSphereRadius = 3;
    const ringSpacing = 7;  // 每个环之间的距离

    souths.forEach((thread, threadIndex) => {
        const deviceCounte = thread.devices.length;
        const ringRadius = centerSphereRadius + (threadIndex + 1) * ringSpacing;    // 计算每个环的半径
        const angleStep = (2 * Math.PI) / deviceCounte;     // 计算每个设备的角度间隔

        // 添加一个array存放球体坐标
        const points = [];

        thread.devices.forEach((device, deviceIndex) => {
            const angle = deviceIndex * angleStep;      // 当前设备在环上的角度
            const x = ringRadius * Math.cos(angle);     // x
            const z = ringRadius * Math.sin(angle);     // y
            const y = 0;

            // 根据设备创建球体
            const geometry = new THREE.SphereGeometry(0.6, 32, 32);
            const material = new THREE.MeshBasicMaterial({ 
                map: textureLoader.load(deviceTexture)
            });
            const sphere = new THREE.Mesh(geometry, material);

            // 设置球体位置
            sphere.position.set(x, 0, z);
            scene.add(sphere);

            points.push(new THREE.Vector3(x, 0, z));
            // 在每个球体上面添加文本显示
            // console.log(device.id, device.hwaddr);
            const sprite = createTextSprite(`${device.id}`);
            sprite.position.set(x, y + 1, z);
            scene.add(sprite);
        });

        // 创建连接球体曲线
        const curve = new THREE.CatmullRomCurve3(points, true);
        const curveGermetry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
        const curveMaterial = new THREE.LineBasicMaterial({
            color: 0xA0A0A0 
        });

        const curveObject = new THREE.Line(curveGermetry, curveMaterial);
        scene.add(curveObject);
    });

}

function createTextSprite(text){
    const canvas = document.createElement('canvas');
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    context.font = '40px Arial';
    context.fillStyle = 'green';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture 
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1, 1, 1);

    return sprite;
}

// 自适应窗口大小变化
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});