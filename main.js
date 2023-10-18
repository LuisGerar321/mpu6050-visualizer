import * as THREE from "three";
import io from "socket.io-client";

const socket = io("http://54.241.53.6");

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Coloca la cámara en el centro de la escena
camera.position.set(0, 0, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 0.25, 1);
const material = new THREE.MeshBasicMaterial({ color: "gray" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Agregar un material para los bordes
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

// Crear una segunda malla que representará los bordes
const edges = new THREE.EdgesGeometry(geometry);
const edgeMesh = new THREE.LineSegments(edges, edgeMaterial);

scene.add(edgeMesh);

const originAxes = new THREE.Object3D();

// Eje X (rojo)
const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(15, 0, 0),
]);
const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0x888888 }); // Cambia el color a gris
const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);

originAxes.add(xAxis);

// Eje Y (verde)
const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 15, 0),
]);
const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x888888 }); // Cambia el color a gris
const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
originAxes.add(yAxis);

// Eje Z (azul)
const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 15),
]);
const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x888888 }); // Cambia el color a gris
const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
originAxes.add(zAxis);

scene.add(originAxes);
const axesHelper = new THREE.AxesHelper(3); // La longitud de los ejes es 2 unidades

scene.add(axesHelper);

// Establece la posición de la cámara
camera.position.z = 10;
camera.position.x = 4;
camera.position.y = 1.5;
// Establece la rotación de la cámara en 45 grados en el eje X

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += degreesToRadians(1);
  // cube.rotation.y += degreesToRadians(1);
  // cube.rotation.z += degreesToRadians(1);
  // edgeMesh.rotation.copy(cube.rotation);
  // axesHelper.rotation.copy(cube.rotation);
  renderer.render(scene, camera);
}

socket.on("newRotation", (data) => {
  // Maneja el evento "newRotation" aquí
  console.log("Nuevo evento de rotación recibido:", data);

  // Puedes actualizar la rotación del cubo u otra acción aquí
  // Por ejemplo:
  cube.rotation.x = degreesToRadians(data.x);
  cube.rotation.y = degreesToRadians(data.y);
  cube.rotation.z = degreesToRadians(data.z);

  // Asegúrate de llamar a render para actualizar la vista
  renderer.render(scene, camera);
});

animate();
