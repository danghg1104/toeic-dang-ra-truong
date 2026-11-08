/**
 * Casio fx-570ES PLUS — Super Detailed 12-Layer Procedural 3D Teardown & Pinout Inspector
 * Built with pure procedural Three.js (No external GLB required).
 * 
 * EXACT ARCHITECTURAL BREAKDOWN:
 * 1.  hard_case        : Slide-on Hard Case (ABS, slide rails, 2 inner embossed ribs)
 * 2.  back_case        : Injection-Molded Back Shell (>PS< RT03-2, grid ribs, 6 screw bosses)
 * 3.  battery_assembly : AAA Battery Bay & Spring Terminals (at Top Edge Y=71.5mm, 1.5V R03)
 * 4.  power_wiring     : Hand-Soldered 3D Power Hookup Wires (Red B+, Black B-, solder beads)
 * 5.  solar_module     : TRONY SC1535I Solar Cell Module with solder leads (S+, S-)
 * 6.  main_pcb         : Casio Main PCB (PWB-CY230-1J / GY315-1 FR-4, gold interlocking pads SW301, 8 stakes)
 * 7.  asic_controller  : COB ASIC U101 (Epoxy Blob with 103 pins) & Flash ROM U202 (TSOP-48 MXIC)
 * 8.  smd_components   : CapXon 22uF 6.3V 85°C C7/C302, SMD C1-C10, Resistors 560/330/680, HS401
 * 9.  silicone_membrane: Silicone Rubber Domes with 50 Conductive Carbon Pills
 * 10. heat_seal_cable  : 40-conductor Heat-Seal Zebra Ribbon Cable
 * 11. tinplate_shield  : Galvanized Tinplate LCD Backing Shield (100% light block & rigidity)
 * 12. lcd_assembly     : STN LCD Panel (Canonical Integral formula, EVA foam, polarizer)
 * 13. front_case       : Front Bezel (Lilac Periwinkle #54587c) & Brushed Aluminum Silver Faceplate
 * 14. keycaps_group    : 50 Sculpted Mechanical Keycaps (4 distinct functional zones)
 * 15. casio_gpt_mod    : Casio GPT AI Mod (ESP32-CAM, OV2640 15° lens, LiPo 402030, TP4056 Type-C)
 */

import * as THREE from 'three';
import { CalculatorEngine } from './calculator/CalculatorEngine.js';
import { COMPONENT_DATABASE } from './calculator/ComponentDatabase.js';

export class FrontCaseGroup extends THREE.Group {
    constructor(options = {}) {
        super();
        this.name = 'CasioFx570DigitalTwin';
        this.calculator = new CalculatorEngine();
        this.selectedComponent = null;
        this.isolatedComponentId = null;
        this.isModEnabled = false;

        this.userData = {
            isDigitalTwin: true,
            dimensions: { width: 77.0, height: 161.5, depth: 13.8 },
            explodedFactor: 0,
            keycaps: new Map(),
            components: new Map(),
            calculatorEngine: this.calculator
        };

        this._init(options);
    }

    _init(options) {
        // 1. Protective Slide-on Hard Case
        const hardCase = this._createHardCase();
        this.add(hardCase);
        this.userData.components.set('hard_case', hardCase);

        // 2. Rear Housing with Stiffening Ribs & Battery Recess
        const backCase = this._createBackCase();
        this.add(backCase);
        this.userData.components.set('back_case', backCase);

        // 3. AAA Battery & Spring Terminal Bay at TOP EDGE (Y=71.5mm)
        const batteryAssy = this._createBatteryAssembly();
        this.add(batteryAssy);
        this.userData.components.set('battery_assembly', batteryAssy);

        // 4. Hand-Soldered 3D Power Hookup Wires B+ / B-
        const powerWires = this._createPowerWires();
        this.add(powerWires);
        this.userData.components.set('power_wiring', powerWires);

        // 5. TRONY SC1535I Solar Cell Module (at Top-Right)
        const solarModule = this._createSolarModule();
        this.add(solarModule);
        this.userData.components.set('solar_module', solarModule);

        // 6. Main PCB GY315-1 / PWB-CY230-1J
        const mainPcb = this._createMainPcb();
        this.add(mainPcb);
        this.userData.components.set('main_pcb', mainPcb);

        // 7. Epoxy Blob COB ASIC U101 & Flash ROM U202
        const asicGroup = this._createAsicAndRom();
        this.add(asicGroup);
        this.userData.components.set('asic_controller', asicGroup);

        // 8. SMD Circuitry, CapXon 22uF & HS401 Connector
        const smdGroup = this._createSmdComponents();
        this.add(smdGroup);
        this.userData.components.set('smd_components', smdGroup);

        // 9. Silicone Keypad Membrane with 50 Conductive Carbon Pills
        const siliconeMembrane = this._createSiliconeMembrane();
        this.add(siliconeMembrane);
        this.userData.components.set('silicone_membrane', siliconeMembrane);

        // 10. 40-conductor Flexible Heat-Seal Zebra Ribbon Cable
        const heatSealCable = this._createHeatSealCable();
        this.add(heatSealCable);
        this.userData.components.set('heat_seal_cable', heatSealCable);

        // 11. Galvanized Tinplate LCD Backing Shield
        const tinplateShield = this._createTinplateShield();
        this.add(tinplateShield);
        this.userData.components.set('tinplate_shield', tinplateShield);

        // 12. STN Dot-Matrix LCD Display Assembly
        const lcdAssembly = this._createLcdAssembly();
        this.add(lcdAssembly);
        this.userData.components.set('lcd_assembly', lcdAssembly);

        // 13. Front Bezel Rim & Brushed Aluminum Faceplate (FRONT-FACING GUARANTEED)
        const frontCase = this._createFrontCaseAndFaceplate();
        this.add(frontCase);
        this.userData.components.set('front_case', frontCase);

        // 14. 50 Distinct Sculpted Mechanical Keycaps
        const keycapsGroup = this._create50Keycaps();
        this.add(keycapsGroup);
        this.userData.components.set('keycaps_group', keycapsGroup);

        // 15. Casio GPT AI Hardware Mod Module (Optional ESP32-CAM & Li-Po)
        const gptModGroup = this._createCasioGptMod();
        this.add(gptModGroup);
        gptModGroup.visible = false; // Factory default
        this.userData.components.set('casio_gpt_mod', gptModGroup);

        // Initialize LCD text rendering
        this.updateLcd();
    }

    // ─────────────────────────────────────────────────────────────
    // COMMON CASING ERGONOMIC OUTLINE GENERATOR (161.5 x 77.0 mm)
    // ─────────────────────────────────────────────────────────────
    _getCasingShape(width, height, shoulderX, waistX) {
        const shape = new THREE.Shape();
        const halfH = height / 2;
        const topY = halfH;
        const botY = -halfH;

        shape.moveTo(-shoulderX + 6, topY);
        shape.quadraticCurveTo(0, topY + 1.2, shoulderX - 6, topY);
        shape.quadraticCurveTo(shoulderX, topY - 1, shoulderX, topY - 8);
        shape.quadraticCurveTo(shoulderX, 30, waistX, -10);
        shape.quadraticCurveTo(waistX - 0.2, -45, shoulderX - 0.5, -60);
        shape.quadraticCurveTo(shoulderX - 0.5, botY + 3, shoulderX - 18, botY);
        shape.quadraticCurveTo(0, botY - 1.2, -shoulderX + 18, botY);
        shape.quadraticCurveTo(-shoulderX + 0.5, botY + 3, -shoulderX + 0.5, -60);
        shape.quadraticCurveTo(-waistX + 0.2, -45, -waistX, -10);
        shape.quadraticCurveTo(-shoulderX, 30, -shoulderX, topY - 8);
        shape.quadraticCurveTo(-shoulderX, topY - 1, -shoulderX + 6, topY);

        return shape;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 1: PROTECTIVE SLIDE-ON HARD CASE
    // ─────────────────────────────────────────────────────────────
    _createHardCase() {
        const group = new THREE.Group();
        group.name = 'HardCaseGroup';
        group.userData = { componentId: 'hard_case', isSelectablePart: true };

        const shape = this._getCasingShape(78.5, 163, 38.0, 36.0);
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 1.4,
            bevelEnabled: true,
            bevelSegments: 2,
            bevelSize: 0.6,
            bevelThickness: 0.6
        });
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
            color: 0x484c68,
            roughness: 0.55,
            metalness: 0.1
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.userData = { componentId: 'hard_case' };
        group.add(mesh);

        // 2 Rectangular embossed grip recesses on inner face
        const recessGeo = new THREE.BoxGeometry(22, 14, 0.4);
        const recessMat = new THREE.MeshStandardMaterial({ color: 0x3f425c, roughness: 0.6 });
        [-16, 16].forEach(x => {
            const rMesh = new THREE.Mesh(recessGeo, recessMat);
            rMesh.position.set(x, 20, 1.4);
            rMesh.userData = { componentId: 'hard_case' };
            group.add(rMesh);
        });

        // Slide Guide Rails along both sides
        const railGeo = new THREE.BoxGeometry(1.2, 130, 1.8);
        [-38.2, 38.2].forEach(rx => {
            const rail = new THREE.Mesh(railGeo, mat);
            rail.position.set(rx, -5, 1.2);
            rail.userData = { componentId: 'hard_case' };
            group.add(rail);
        });

        group.position.z = -6.8;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 2: INJECTION-MOLDED REAR HOUSING (>PS< RT03-2)
    // ─────────────────────────────────────────────────────────────
    _createBackCase() {
        const group = new THREE.Group();
        group.name = 'BackCaseGroup';
        group.userData = { componentId: 'back_case', isSelectablePart: true };

        const shape = this._getCasingShape(77, 161.5, 37.5, 35.5);
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 3.8,
            bevelEnabled: true,
            bevelSegments: 3,
            bevelSize: 1.0,
            bevelThickness: 1.0
        });
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
            color: 0x505478,
            roughness: 0.5,
            metalness: 0.12
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.userData = { componentId: 'back_case' };
        group.add(mesh);

        // Internal Structural Grid Ribs (>PS< RT03-2 CY845)
        const ribMat = new THREE.MeshStandardMaterial({ color: 0x474b6e, roughness: 0.65 });
        
        // Central circular reinforcing ring
        const centerRingGeo = new THREE.RingGeometry(14, 16.5, 32);
        const centerRing = new THREE.Mesh(centerRingGeo, ribMat);
        centerRing.position.set(0, -6, 0.6);
        centerRing.userData = { componentId: 'back_case' };
        group.add(centerRing);

        // Checkerboard grid ribs in lower half
        for (let y = -62; y <= 10; y += 14) {
            const hRib = new THREE.Mesh(new THREE.BoxGeometry(56, 1.0, 1.4), ribMat);
            hRib.position.set(0, y, 0.7);
            hRib.userData = { componentId: 'back_case' };
            group.add(hRib);
        }
        [-20, 0, 20].forEach(x => {
            const vRib = new THREE.Mesh(new THREE.BoxGeometry(1.0, 72, 1.4), ribMat);
            vRib.position.set(x, -26, 0.7);
            vRib.userData = { componentId: 'back_case' };
            group.add(vRib);
        });

        // Top Battery Cradle Wall at Y = 64
        const cradleWall = new THREE.Mesh(new THREE.BoxGeometry(54, 1.2, 3.2), ribMat);
        cradleWall.position.set(0, 63.5, 1.6);
        cradleWall.userData = { componentId: 'back_case' };
        group.add(cradleWall);

        // 6 Screw Standoff Bosses
        const bossGeo = new THREE.CylinderGeometry(1.8, 2.2, 3.2, 16);
        const bossMat = new THREE.MeshStandardMaterial({ color: 0x434763, roughness: 0.5 });
        const bossPositions = [
            [-30, 68], [30, 68],
            [-29, 0], [29, 0],
            [-28, -68], [28, -68]
        ];
        bossPositions.forEach(p => {
            const boss = new THREE.Mesh(bossGeo, bossMat);
            boss.rotation.x = Math.PI / 2;
            boss.position.set(p[0], p[1], 1.6);
            boss.userData = { componentId: 'back_case' };
            group.add(boss);
        });

        // Pinhole RESET Guide Column
        const resetPin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 3.2, 12), bossMat);
        resetPin.rotation.x = Math.PI / 2;
        resetPin.position.set(18, -48, 1.6);
        resetPin.userData = { componentId: 'back_case' };
        group.add(resetPin);

        // Factory Decal Label on outer rear face
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 1024; labelCanvas.height = 512;
        const lctx = labelCanvas.getContext('2d');
        lctx.fillStyle = '#1c1f2e';
        lctx.fillRect(0, 0, 1024, 512);
        lctx.fillStyle = '#e2e8f0';
        lctx.font = 'bold 36px monospace';
        lctx.fillText('CASIO COMPUTER CO., LTD.', 60, 80);
        lctx.font = 'bold 44px sans-serif';
        lctx.fillText('fx-570ES PLUS', 60, 140);
        lctx.font = '30px monospace';
        lctx.fillText('RATING: DC 1.5V --- 0.0002W', 60, 200);
        lctx.fillText('BATTERY: 1x AAA (R03/LR03)', 60, 250);
        lctx.fillText('MOULD: >PS< RT03-2 CY845', 60, 300);
        lctx.fillText('BATCH: 5W 05 12 / MADE IN THAILAND', 60, 350);
        lctx.fillStyle = '#38bdf8';
        lctx.fillText('● RESET [PUSH PINHOLE]', 60, 420);

        const labelTex = new THREE.CanvasTexture(labelCanvas);
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(50, 25), new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.4 }));
        labelMesh.position.set(0, -10, 4.0);
        labelMesh.userData = { componentId: 'back_case' };
        group.add(labelMesh);

        group.position.z = -4.2;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 3: AAA BATTERY BAY (TOP EDGE Y=71.5mm)
    // ─────────────────────────────────────────────────────────────
    _createBatteryAssembly() {
        const group = new THREE.Group();
        group.name = 'BatteryAssemblyGroup';
        group.userData = { componentId: 'battery_assembly', isSelectablePart: true };

        // 1x AAA Battery (Length 44.5mm, Diameter 10.5mm) at Y = 71.5mm
        const batteryGeo = new THREE.CylinderGeometry(5.0, 5.0, 44.5, 32);
        
        const bCanvas = document.createElement('canvas');
        bCanvas.width = 512; bCanvas.height = 256;
        const bctx = bCanvas.getContext('2d');
        const bGrad = bctx.createLinearGradient(0, 0, 512, 0);
        bGrad.addColorStop(0, '#1e3a8a');
        bGrad.addColorStop(0.35, '#3b82f6');
        bGrad.addColorStop(0.7, '#d97706');
        bGrad.addColorStop(1, '#f59e0b');
        bctx.fillStyle = bGrad;
        bctx.fillRect(0, 0, 512, 256);
        bctx.fillStyle = '#ffffff';
        bctx.font = 'bold 36px monospace';
        bctx.fillText('AAA  1.5V  R03', 40, 100);
        bctx.font = '28px sans-serif';
        bctx.fillText('CASIO ALKALINE POWER', 40, 160);
        bctx.fillText('[-] ─────── (+)', 40, 210);

        const bTex = new THREE.CanvasTexture(bCanvas);
        const bMat = new THREE.MeshStandardMaterial({ map: bTex, metalness: 0.65, roughness: 0.25 });
        const batteryMesh = new THREE.Mesh(batteryGeo, bMat);
        batteryMesh.rotation.z = Math.PI / 2;
        batteryMesh.position.set(0, 71.5, 0);
        batteryMesh.userData = { componentId: 'battery_assembly' };
        group.add(batteryMesh);

        // Positive Button Terminal (+) on right (X = 23.2, Y = 71.5)
        const posNipple = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.8, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 }));
        posNipple.rotation.z = Math.PI / 2;
        posNipple.position.set(23.2, 71.5, 0);
        posNipple.userData = { componentId: 'battery_assembly' };
        group.add(posNipple);

        // Negative Spring Contact (-) on left (X = -23.0, Y = 71.5)
        const negSpring = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.2, 3.5, 16, 4, true), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.2, wireframe: true }));
        negSpring.rotation.z = Math.PI / 2;
        negSpring.position.set(-23.8, 71.5, 0);
        negSpring.userData = { componentId: 'battery_assembly' };
        group.add(negSpring);

        group.position.z = -3.2;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 4: HAND-SOLDERED 3D POWER HOOKUP WIRES (B+ & B-)
    // ─────────────────────────────────────────────────────────────
    _createPowerWires() {
        const group = new THREE.Group();
        group.name = 'PowerWiresGroup';
        group.userData = { componentId: 'power_wiring', isSelectablePart: true };

        const wireMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4, metalness: 0.1 });
        const wireMatBlack = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.1 });
        const solderMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.15 });

        // Red Wire (B+): From Positive Terminal (+ on right) to PCB Pad B+ at (-24, 52)
        const redCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(23.0, 71.5, -2.5),
            new THREE.Vector3(28.0, 68.0, -2.0),
            new THREE.Vector3(30.0, 58.0, -1.6),
            new THREE.Vector3(20.0, 54.0, -1.3),
            new THREE.Vector3(-10.0, 53.0, -1.2),
            new THREE.Vector3(-24.0, 52.0, -1.0)
        ]);
        const redWireGeo = new THREE.TubeGeometry(redCurve, 40, 0.45, 8, false);
        const redWireMesh = new THREE.Mesh(redWireGeo, wireMatRed);
        redWireMesh.userData = { componentId: 'power_wiring' };
        group.add(redWireMesh);

        const redSolder = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), solderMat);
        redSolder.position.set(-24.0, 52.0, -1.0);
        redSolder.userData = { componentId: 'power_wiring' };
        group.add(redSolder);

        // Black Wire (B-): From Negative Spring to PCB Pad B- at (-24, -54)
        const blackCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-24.0, 71.5, -2.5),
            new THREE.Vector3(-31.0, 65.0, -2.0),
            new THREE.Vector3(-32.0, 20.0, -1.5),
            new THREE.Vector3(-32.0, -20.0, -1.4),
            new THREE.Vector3(-30.0, -48.0, -1.2),
            new THREE.Vector3(-24.0, -54.0, -1.0)
        ]);
        const blackWireGeo = new THREE.TubeGeometry(blackCurve, 50, 0.45, 8, false);
        const blackWireMesh = new THREE.Mesh(blackWireGeo, wireMatBlack);
        blackWireMesh.userData = { componentId: 'power_wiring' };
        group.add(blackWireMesh);

        const blackSolder = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), solderMat);
        blackSolder.position.set(-24.0, -54.0, -1.0);
        blackSolder.userData = { componentId: 'power_wiring' };
        group.add(blackSolder);

        group.position.z = -2.2;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 5: TRONY SC1535I SOLAR CELL MODULE
    // ─────────────────────────────────────────────────────────────
    _createSolarModule() {
        const group = new THREE.Group();
        group.name = 'SolarModuleGroup';
        group.userData = { componentId: 'solar_module', isSelectablePart: true };

        // Position: Top-right recess (X = 18, Y = 64)
        const sw = 20, sh = 9.5;
        const solarCanvas = document.createElement('canvas');
        solarCanvas.width = 256; solarCanvas.height = 128;
        const sctx = solarCanvas.getContext('2d');

        // Front photovoltaic silicon panels
        sctx.fillStyle = '#1c1b29';
        sctx.fillRect(0, 0, 256, 128);
        sctx.fillStyle = '#2d2b45';
        for (let i = 8; i < 240; i += 58) {
            sctx.fillRect(i, 8, 52, 112);
        }
        sctx.fillStyle = '#8b5cf6';
        for (let i = 8; i < 240; i += 58) {
            sctx.fillRect(i, 62, 52, 3);
        }

        const solarTex = new THREE.CanvasTexture(solarCanvas);
        const solarMat = new THREE.MeshStandardMaterial({
            map: solarTex,
            roughness: 0.15,
            metalness: 0.8
        });
        const solarGlass = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), solarMat);
        solarGlass.position.set(18, 64, 0.1);
        solarGlass.userData = { componentId: 'solar_module' };
        group.add(solarGlass);

        // Rear Amber/Brown PCB with 'TRONY SC1535I 15 01'
        const rearCanvas = document.createElement('canvas');
        rearCanvas.width = 256; rearCanvas.height = 128;
        const rctx = rearCanvas.getContext('2d');
        rctx.fillStyle = '#854d0e';
        rctx.fillRect(0, 0, 256, 128);
        rctx.fillStyle = '#fbbf24';
        rctx.font = 'bold 24px monospace';
        rctx.fillText('TRONY', 30, 45);
        rctx.font = 'bold 18px monospace';
        rctx.fillText('SC1535I 15 01', 30, 80);
        rctx.fillStyle = '#ef4444'; rctx.fillText('(+) S+', 30, 110);
        rctx.fillStyle = '#e2e8f0'; rctx.fillText('(-) S-', 150, 110);

        const rearTex = new THREE.CanvasTexture(rearCanvas);
        const rearPlate = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), new THREE.MeshStandardMaterial({ map: rearTex, roughness: 0.4 }));
        rearPlate.rotation.y = Math.PI;
        rearPlate.position.set(18, 64, -0.1);
        rearPlate.userData = { componentId: 'solar_module' };
        group.add(rearPlate);

        // 2 Solder leads (+ red, - yellow)
        const wireMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
        const wireMatYellow = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
        
        const redLead = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 8), wireMatRed);
        redLead.position.set(12, 59, -0.4);
        redLead.userData = { componentId: 'solar_module' };
        group.add(redLead);

        const yelLead = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 8), wireMatYellow);
        yelLead.position.set(24, 59, -0.4);
        yelLead.userData = { componentId: 'solar_module' };
        group.add(yelLead);

        group.position.z = -1.8;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 6: MAIN PCB (PWB-CY230-1J / GY315-1 FR-4)
    // ─────────────────────────────────────────────────────────────
    _createMainPcb() {
        const group = new THREE.Group();
        group.name = 'MainPcbGroup';
        group.userData = { componentId: 'main_pcb', isSelectablePart: true };

        const shape = this._getCasingShape(72, 156.5, 35.0, 33.0);
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 0.8,
            bevelEnabled: true,
            bevelSegments: 1,
            bevelSize: 0.2,
            bevelThickness: 0.2
        });
        geo.computeVertexNormals();

        const pcbTexture = this._generatePcbTexture();
        const pos = geo.attributes.position;
        const uv = geo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            uv.setXY(i, (pos.getX(i) + 36.0) / 72.0, (pos.getY(i) + 78.2) / 156.5);
        }
        uv.needsUpdate = true;

        const mat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: pcbTexture,
            roughness: 0.35,
            metalness: 0.35
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData = { componentId: 'main_pcb' };
        group.add(mesh);

        // 8 Heat-staked white plastic retention posts (chốt nhựa trắng tán nhiệt)
        const postGeo = new THREE.CylinderGeometry(1.4, 1.4, 1.2, 16);
        const postMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
        const postCoords = [
            [-28, 40], [28, 40],
            [-30, 10], [30, 10],
            [-30, -25], [30, -25],
            [-26, -65], [26, -65]
        ];
        postCoords.forEach(p => {
            const post = new THREE.Mesh(postGeo, postMat);
            post.rotation.x = Math.PI / 2;
            post.position.set(p[0], p[1], 0.9);
            post.userData = { componentId: 'main_pcb' };
            group.add(post);
        });

        // 4 Metal Screws with Washers (4 ốc kim loại kèm vòng đệm)
        const screwPadPositions = [
            [-22, 48], [22, 48],
            [-20, -58], [20, -58]
        ];
        const ringGeo = new THREE.RingGeometry(1.6, 3.4, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9, side: THREE.DoubleSide });
        const pcbScrewGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 12);
        const pcbScrewMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });

        screwPadPositions.forEach(p => {
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(p[0], p[1], 0.81);
            ring.userData = { componentId: 'main_pcb' };
            group.add(ring);

            const screw = new THREE.Mesh(pcbScrewGeo, pcbScrewMat);
            screw.rotation.x = Math.PI / 2;
            screw.position.set(p[0], p[1], 0.95);
            screw.userData = { componentId: 'main_pcb' };
            group.add(screw);
        });

        group.position.z = -1.2;
        return group;
    }

    _generatePcbTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048; canvas.height = 4096;
        const ctx = canvas.getContext('2d');

        // FR-4 Dark Green Solder Mask
        ctx.fillStyle = '#145727';
        ctx.fillRect(0, 0, 2048, 4096);

        // Fiber weave lines
        ctx.fillStyle = '#18632e';
        for (let y = 0; y < 4096; y += 12) ctx.fillRect(0, y, 2048, 4);

        const toX = (x) => ((x + 36.0) / 72.0) * 2048;
        const toY = (y) => ((78.2 - y) / 156.5) * 4096;

        // Gold & Copper Interlocking Finger Pads (50 Pairs of SW301)
        const drawInterlockingPad = (x, y, radius = 44) => {
            const cx = toX(x), cy = toY(y);
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();

            // Interdigitated combs
            ctx.lineWidth = 3.5;
            for (let i = -radius + 8; i <= radius - 8; i += 10) {
                ctx.beginPath(); ctx.moveTo(cx - radius + 10, cy + i); ctx.lineTo(cx + 4, cy + i); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx - 4, cy + i + 5); ctx.lineTo(cx + radius - 10, cy + i + 5); ctx.stroke();
            }
        };

        // Keypad Matrix
        [[-24, 23], [-15, 16], [0, 18], [15, 16], [24, 23]].forEach(p => drawInterlockingPad(p[0], p[1], 46));
        [[-24, 5.5], [-12, 5.5], [12, 5.5], [24, 5.5]].forEach(p => drawInterlockingPad(p[0], p[1], 38));
        [-25, -15, -5, 5, 15, 25].forEach(x => {
            drawInterlockingPad(x, -2.5, 34); drawInterlockingPad(x, -10.5, 34); drawInterlockingPad(x, -18.5, 34);
        });
        [-25, -12.5, 0, 12.5, 25].forEach(x => {
            drawInterlockingPad(x, -30.5, 48); drawInterlockingPad(x, -42.5, 48); drawInterlockingPad(x, -54.5, 48); drawInterlockingPad(x, -66.5, 48);
        });

        // Thousands of tiny Via Holes (Lỗ xuyên mạch)
        ctx.fillStyle = '#f59e0b';
        for (let i = 0; i < 180; i++) {
            const vx = 180 + (i * 37) % 1700;
            const vy = 1200 + (i * 53) % 2700;
            ctx.beginPath(); ctx.arc(vx, vy, 6, 0, Math.PI * 2); ctx.fill();
        }

        // Intricate copper bus traces fanning out
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        for (let x = 200; x < 1850; x += 85) {
            ctx.beginPath();
            ctx.moveTo(x, 1100);
            ctx.lineTo(x + 40, 2200);
            ctx.lineTo(x - 20, 3600);
            ctx.stroke();
        }

        // Exact Silkscreen Markings (from ref_9)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 58px monospace';
        ctx.fillText('GY315-1', 1450, 3750);
        ctx.font = 'bold 36px monospace';
        ctx.fillText('HA210303A-2', 1450, 3820);
        ctx.fillText('(WL)', 1750, 3750);
        ctx.fillText('JC-94V0 14-15', 280, 3820);
        ctx.fillText('PWB-CY230-1J', 280, 3880);

        // Solder Pad Labels: B+, B-, S+, BRESET
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText('B+ (P171)', toX(-24) - 80, toY(52) - 30);
        ctx.fillText('B- (VSS)', toX(-24) - 80, toY(-54) + 50);
        ctx.fillText('S+ (SOLAR)', toX(18) - 40, toY(52) - 30);
        ctx.fillText('BRESET', toX(18) - 40, toY(-48) + 40);

        // Gold Test Pads K01 to K34
        ctx.fillStyle = '#f59e0b';
        ctx.font = '28px monospace';
        for (let i = 1; i <= 24; i++) {
            const tx = 1350 + (i % 3) * 160;
            const ty = 1400 + Math.floor(i / 3) * 110;
            ctx.beginPath(); ctx.arc(tx, ty, 14, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`K${i < 10 ? '0' + i : i}`, tx + 20, ty + 8);
            ctx.fillStyle = '#f59e0b';
        }

        // Central White Silkscreen Frame for Epoxy Blob COB (ref_9)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.strokeRect(toX(0) - 180, toY(10) - 150, 360, 300);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px monospace';
        ctx.fillText('U101 (ASIC)', toX(0) - 90, toY(10) + 185);
        ctx.fillText('1PIN', toX(0) - 170, toY(10) - 165);

        // Die Pin Wire-bonding Labels around ASIC
        const pinLabels = ['1', '10', '20', '26', '30', '40', '50', '60', '70', '75', '90', '100', '103'];
        ctx.font = '22px monospace';
        pinLabels.forEach((lbl, idx) => {
            const angle = (idx / pinLabels.length) * Math.PI * 2;
            const px = toX(0) + Math.cos(angle) * 230;
            const py = toY(10) + Math.sin(angle) * 190;
            ctx.fillText(lbl, px - 15, py);
        });

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 8;
        return tex;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 7: CENTRAL COB ASIC U101 & FLASH ROM U202
    // ─────────────────────────────────────────────────────────────
    _createAsicAndRom() {
        const group = new THREE.Group();
        group.name = 'AsicAndRomGroup';
        group.userData = { componentId: 'asic_controller', isSelectablePart: true };

        // 1. Epoxy Blob (COB ASIC U101 as seen in ref_2, ref_5, ref_9):
        // Rounded glossy black dome / pillow (16mm x 14mm)
        const blobGeo = new THREE.SphereGeometry(8.5, 32, 16);
        blobGeo.scale(1.0, 0.85, 0.22);
        const blobMat = new THREE.MeshPhysicalMaterial({
            color: 0x09090b,
            roughness: 0.12,
            metalness: 0.35,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1
        });
        const blobMesh = new THREE.Mesh(blobGeo, blobMat);
        blobMesh.position.set(0, 10, 0.3);
        blobMesh.userData = { componentId: 'asic_controller' };
        group.add(blobMesh);

        // 2. Flash ROM U202: TSOP-48 MXIC MX29LV320EBTI-70G (ref_3)
        const flashGeo = new THREE.BoxGeometry(18, 12, 1.2);
        const fCanvas = document.createElement('canvas');
        fCanvas.width = 256; fCanvas.height = 128;
        const fctx = fCanvas.getContext('2d');
        fctx.fillStyle = '#18181b';
        fctx.fillRect(0, 0, 256, 128);
        fctx.fillStyle = '#e2e8f0';
        fctx.font = 'bold 24px monospace';
        fctx.fillText('MXIC', 25, 45);
        fctx.font = 'bold 18px monospace';
        fctx.fillText('MX29LV320EBTI-70G', 25, 80);
        fctx.fillText('3X568100 TAIWAN', 25, 110);
        fctx.fillStyle = '#ef4444';
        fctx.beginPath(); fctx.arc(15, 20, 6, 0, Math.PI * 2); fctx.fill(); // pin 1 dot

        const flashTex = new THREE.CanvasTexture(fCanvas);
        const flashMat = new THREE.MeshStandardMaterial({ map: flashTex, roughness: 0.35, metalness: 0.2 });
        const flashMesh = new THREE.Mesh(flashGeo, flashMat);
        flashMesh.position.set(-20, 22, 0.4);
        flashMesh.userData = { componentId: 'asic_controller' };
        group.add(flashMesh);

        // Gull-wing silver pins for TSOP-48
        const pinMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
        for (let i = -7.5; i <= 7.5; i += 0.8) {
            const pL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.4), pinMat);
            pL.position.set(-29.6, 22 + i, 0.1);
            pL.userData = { componentId: 'asic_controller' };
            group.add(pL);

            const pR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.4), pinMat);
            pR.position.set(-10.4, 22 + i, 0.1);
            pR.userData = { componentId: 'asic_controller' };
            group.add(pR);
        }

        group.position.z = -0.5;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 8: SMD CIRCUITRY, CAPXON 22uF & HS401 CONNECTOR
    // ─────────────────────────────────────────────────────────────
    _createSmdComponents() {
        const group = new THREE.Group();
        group.name = 'SmdComponentsGroup';
        group.userData = { componentId: 'smd_components', isSelectablePart: true };

        // 1. CapXon 22µF 6.3V Electrolytic Filter Capacitor (C7/C105 horizontal)
        const capGeo = new THREE.CylinderGeometry(2.2, 2.2, 7.5, 20);
        const capCanvas = document.createElement('canvas');
        capCanvas.width = 128; capCanvas.height = 64;
        const capCtx = capCanvas.getContext('2d');
        capCtx.fillStyle = '#0f172a';
        capCtx.fillRect(0, 0, 128, 64);
        capCtx.fillStyle = '#38bdf8';
        capCtx.fillRect(0, 0, 20, 64); // negative stripe
        capCtx.fillStyle = '#ffffff';
        capCtx.font = 'bold 12px sans-serif';
        capCtx.fillText('22µF 6.3V', 28, 30);
        capCtx.fillText('85°C', 28, 50);
        const capTex = new THREE.CanvasTexture(capCanvas);
        const capMat = new THREE.MeshStandardMaterial({ map: capTex, roughness: 0.4 });
        const capMesh = new THREE.Mesh(capGeo, capMat);
        capMesh.rotation.z = Math.PI / 2;
        capMesh.position.set(-6, -2, 0.5);
        capMesh.userData = { componentId: 'smd_components' };
        group.add(capMesh);

        // Two silver wire leads for C7
        const leadMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
        [-9.8, -2.2].forEach(lx => {
            const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8), leadMat);
            lead.position.set(lx, -2, -0.1);
            lead.userData = { componentId: 'smd_components' };
            group.add(lead);
        });

        // 2. SMD 0805 Ceramic Capacitors C1-C10 around ASIC
        const smdPositions = [
            [-12, 18], [12, 18],
            [-13, 2], [13, 2],
            [-11, -8], [11, -8],
            [18, -4], [-18, -4]
        ];
        const smdBodyGeo = new THREE.BoxGeometry(2.0, 1.2, 0.7);
        const smdBodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
        const smdEndGeo = new THREE.BoxGeometry(0.5, 1.25, 0.75);
        const smdEndMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.2 });

        smdPositions.forEach(p => {
            const body = new THREE.Mesh(smdBodyGeo, smdBodyMat);
            body.position.set(p[0], p[1], 0.2);
            body.userData = { componentId: 'smd_components' };
            group.add(body);

            const endL = new THREE.Mesh(smdEndGeo, smdEndMat);
            endL.position.set(p[0] - 0.9, p[1], 0.2);
            endL.userData = { componentId: 'smd_components' };
            group.add(endL);

            const endR = new THREE.Mesh(smdEndGeo, smdEndMat);
            endR.position.set(p[0] + 0.9, p[1], 0.2);
            endR.userData = { componentId: 'smd_components' };
            group.add(endR);
        });

        // 3. Black Resistors with printed numbers (560, 330, 680)
        const resCodes = ['560', '330', '680', '102'];
        resCodes.forEach((code, idx) => {
            const resCanvas = document.createElement('canvas');
            resCanvas.width = 64; resCanvas.height = 32;
            const rctx = resCanvas.getContext('2d');
            rctx.fillStyle = '#09090b';
            rctx.fillRect(0, 0, 64, 32);
            rctx.fillStyle = '#e2e8f0';
            rctx.font = 'bold 16px monospace';
            rctx.fillText(code, 12, 22);
            const rTex = new THREE.CanvasTexture(resCanvas);

            const resMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.6), new THREE.MeshStandardMaterial({ map: rTex, roughness: 0.4 }));
            resMesh.position.set(-18 + idx * 8, 30, 0.2);
            resMesh.userData = { componentId: 'smd_components' };
            group.add(resMesh);
        });

        // 4. HS401 20-pin White Connector Header (as seen in ref_3)
        const hsGeo = new THREE.BoxGeometry(22, 5, 2.0);
        const hsMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
        const hsMesh = new THREE.Mesh(hsGeo, hsMat);
        hsMesh.position.set(16, 26, 0.4);
        hsMesh.userData = { componentId: 'smd_components' };
        group.add(hsMesh);

        // 20 metal pins inside HS401
        for (let i = -9; i <= 9; i += 1.0) {
            const pin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.5, 0.5), leadMat);
            pin.position.set(16 + i, 26, 0.9);
            pin.userData = { componentId: 'smd_components' };
            group.add(pin);
        }

        // 5. 32.768kHz Tubular Quartz Crystal
        const crystalGeo = new THREE.CylinderGeometry(1.0, 1.0, 6.0, 16);
        const crystalMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.2 });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.rotation.z = Math.PI / 3;
        crystal.position.set(-20, 2, 0.4);
        crystal.userData = { componentId: 'smd_components' };
        group.add(crystal);

        group.position.z = -0.5;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 9: SILICONE MEMBRANE WITH 50 CONDUCTIVE CARBON PILLS
    // ─────────────────────────────────────────────────────────────
    _createSiliconeMembrane() {
        const group = new THREE.Group();
        group.name = 'SiliconeMembraneGroup';
        group.userData = { componentId: 'silicone_membrane', isSelectablePart: true };

        const shape = this._getCasingShape(70, 112, 34.0, 32.0);
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 0.5,
            bevelEnabled: true,
            bevelSegments: 1,
            bevelSize: 0.2,
            bevelThickness: 0.2
        });
        geo.computeVertexNormals();

        const mat = new THREE.MeshPhysicalMaterial({
            color: 0xe2e8f0,
            transparent: true,
            opacity: 0.78,
            roughness: 0.45,
            transmission: 0.4
        });

        const sheetMesh = new THREE.Mesh(geo, mat);
        sheetMesh.position.set(0, -22, 0);
        sheetMesh.userData = { componentId: 'silicone_membrane' };
        group.add(sheetMesh);

        // 50 Conductive Carbon Pills under each dome (as in ref_8 diagram)
        const pillGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.25, 12);
        const pillMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 }); // matte black carbon

        const pillCoords = [
            // Top pills
            [-24, 23], [-15, 16], [0, 18], [15, 16], [24, 23],
            // Sci pills
            [-24, 5.5], [-12, 5.5], [12, 5.5], [24, 5.5],
            // Rows 1-3
            ...[-25, -15, -5, 5, 15, 25].flatMap(x => [[x, -2.5], [x, -10.5], [x, -18.5]]),
            // Numpad pills
            ...[-25, -12.5, 0, 12.5, 25].flatMap(x => [[x, -30.5], [x, -42.5], [x, -54.5], [x, -66.5]])
        ];

        pillCoords.forEach(c => {
            const pill = new THREE.Mesh(pillGeo, pillMat);
            pill.rotation.x = Math.PI / 2;
            pill.position.set(c[0], c[1], -0.15); // underside of membrane
            pill.userData = { componentId: 'silicone_membrane' };
            group.add(pill);
        });

        group.position.z = -0.1;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 10: 40-CONDUCTOR HEAT-SEAL ZEBRA RIBBON CABLE
    // ─────────────────────────────────────────────────────────────
    _createHeatSealCable() {
        const group = new THREE.Group();
        group.name = 'HeatSealCableGroup';
        group.userData = { componentId: 'heat_seal_cable', isSelectablePart: true };

        // 40-conductor ribbon linking LCD at Y=28 down to PCB at Y=26
        const cableGeo = new THREE.PlaneGeometry(48, 10);
        const cableCanvas = document.createElement('canvas');
        cableCanvas.width = 512; cableCanvas.height = 128;
        const cctx = cableCanvas.getContext('2d');
        cctx.fillStyle = '#f1f5f9';
        cctx.fillRect(0, 0, 512, 128);

        // 40 Silver conductive stripes (zebra lines)
        cctx.fillStyle = '#475569';
        for (let i = 8; i < 504; i += 12) {
            cctx.fillRect(i, 0, 6, 128);
        }

        const cableTex = new THREE.CanvasTexture(cableCanvas);
        const cableMat = new THREE.MeshStandardMaterial({
            map: cableTex,
            roughness: 0.5,
            metalness: 0.25,
            side: THREE.DoubleSide
        });

        const cableMesh = new THREE.Mesh(cableGeo, cableMat);
        cableMesh.position.set(0, 27.5, 0);
        cableMesh.userData = { componentId: 'heat_seal_cable' };
        group.add(cableMesh);

        group.position.z = 0.25;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 11: GALVANIZED TINPLATE LCD BACKING SHIELD
    // ─────────────────────────────────────────────────────────────
    _createTinplateShield() {
        const group = new THREE.Group();
        group.name = 'TinplateShieldGroup';
        group.userData = { componentId: 'tinplate_shield', isSelectablePart: true };

        // Metal backing sheet directly behind LCD
        const plateGeo = new THREE.BoxGeometry(57.5, 29.5, 0.4);
        const plateMat = new THREE.MeshStandardMaterial({
            color: 0xd8dce6,
            metalness: 0.88,
            roughness: 0.28
        });
        const plateMesh = new THREE.Mesh(plateGeo, plateMat);
        plateMesh.position.set(0, 42, 0);
        plateMesh.userData = { componentId: 'tinplate_shield' };
        group.add(plateMesh);

        // Bent edge tabs for structural clamping
        const tabGeo = new THREE.BoxGeometry(1.2, 29.5, 1.2);
        [-28.8, 28.8].forEach(tx => {
            const tab = new THREE.Mesh(tabGeo, plateMat);
            tab.position.set(tx, 42, -0.4);
            tab.userData = { componentId: 'tinplate_shield' };
            group.add(tab);
        });

        group.position.z = 0.35;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 12: STN DOT-MATRIX LCD DISPLAY ASSEMBLY
    // ─────────────────────────────────────────────────────────────
    _createLcdAssembly() {
        const group = new THREE.Group();
        group.name = 'LcdAssemblyGroup';
        group.userData = { componentId: 'lcd_assembly', isSelectablePart: true };

        // 1. Shock-absorbing Black Foam Cushion (Đệm mút đen chống sốc)
        const foamGeo = new THREE.PlaneGeometry(56, 28);
        const foamMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
        const foamMesh = new THREE.Mesh(foamGeo, foamMat);
        foamMesh.position.set(0, 42, -0.15);
        foamMesh.userData = { componentId: 'lcd_assembly' };
        group.add(foamMesh);

        // 2. Reflective Polarizer Backing (Tấm lá nhôm phản quang)
        const polGeo = new THREE.PlaneGeometry(56, 28);
        const polMat = new THREE.MeshStandardMaterial({
            color: 0xa4b6a5, // Vintage STN greenish grey
            roughness: 0.25,
            metalness: 0.2
        });
        const polarizer = new THREE.Mesh(polGeo, polMat);
        polarizer.position.set(0, 42, -0.05);
        polarizer.userData = { componentId: 'lcd_assembly' };
        group.add(polarizer);

        // 3. STN Dot-Matrix LCD Canvas (1024x512)
        this.lcdCanvas = document.createElement('canvas');
        this.lcdCanvas.width = 1024;
        this.lcdCanvas.height = 512;
        this.lcdCtx = this.lcdCanvas.getContext('2d');

        this.lcdTexture = new THREE.CanvasTexture(this.lcdCanvas);
        this.lcdTexture.generateMipmaps = true;
        this.lcdTexture.minFilter = THREE.LinearMipmapLinearFilter;
        this.lcdTexture.magFilter = THREE.LinearFilter;
        this.lcdTexture.anisotropy = 16;

        const lcdGeo = new THREE.PlaneGeometry(55.2, 27.2);
        const lcdMat = new THREE.MeshBasicMaterial({
            map: this.lcdTexture,
            transparent: false
        });
        const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
        lcdMesh.position.set(0, 42, 0.05);
        lcdMesh.name = 'LcdScreenMesh';
        lcdMesh.userData = { componentId: 'lcd_assembly' };
        group.add(lcdMesh);

        // 4. Anti-Glare Front Glass Window
        const glassGeo = new THREE.PlaneGeometry(56, 28);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xf8fafc,
            transparent: true,
            opacity: 0.08,
            roughness: 0.45,
            metalness: 0.02,
            clearcoat: 0.1
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.set(0, 42, 0.18);
        glassMesh.userData = { componentId: 'lcd_assembly' };
        group.add(glassMesh);

        group.position.z = 0.50;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 13: FRONT BEZEL RIM & BRUSHED ALUMINUM FACEPLATE
    // (CRITICAL: FRONT-FACING, 100% VISIBLE, NEVER DROWNED IN BEZEL)
    // ─────────────────────────────────────────────────────────────
    _createFrontCaseAndFaceplate() {
        const group = new THREE.Group();
        group.name = 'FrontCaseGroup';
        group.userData = { componentId: 'front_case', isSelectablePart: true };

        // 1. Lilac Periwinkle Ergonomic Perimeter Bumper Edges
        // Cut out center aperture so faceplate is inlaid and 100% visible
        const bezelShape = this._getCasingShape(77, 161.5, 38.5, 36.5);
        const aperture = this._getCasingShape(69.0, 153.5, 34.5, 32.5);
        const aptPts = aperture.getPoints(16);
        const aptPath = new THREE.Path();
        aptPath.moveTo(aptPts[0].x, aptPts[0].y);
        for (let i = 1; i < aptPts.length; i++) aptPath.lineTo(aptPts[i].x, aptPts[i].y);
        aptPath.closePath();
        bezelShape.holes.push(aptPath);

        const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, {
            depth: 1.0,
            bevelEnabled: true,
            bevelSegments: 2,
            bevelSize: 0.4,
            bevelThickness: 0.4
        });
        bezelGeo.computeVertexNormals();

        const bezelMat = new THREE.MeshStandardMaterial({
            color: 0x54587c, // Authentic Casio lilac periwinkle
            roughness: 0.45,
            metalness: 0.15
        });
        const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
        bezelMesh.position.z = 0.0;
        bezelMesh.castShadow = true;
        bezelMesh.userData = { componentId: 'front_case' };
        group.add(bezelMesh);

        // 2. Full Brushed Aluminum Faceplate (Front Surface, completely in front!)
        const faceShape = this._getCasingShape(70.0, 154.5, 35.0, 33.0);

        // Cutout for the LCD Screen (55.5x27.5mm at Y=42)
        const screenHole = new THREE.Path();
        const sw = 55.5, sh = 27.5, sy = 42;
        screenHole.moveTo(-sw / 2, sy - sh / 2);
        screenHole.lineTo(-sw / 2, sy + sh / 2);
        screenHole.lineTo(sw / 2, sy + sh / 2);
        screenHole.lineTo(sw / 2, sy - sh / 2);
        screenHole.closePath();
        faceShape.holes.push(screenHole);

        const faceGeo = new THREE.ExtrudeGeometry(faceShape, {
            depth: 0.3,
            bevelEnabled: true,
            bevelSegments: 2,
            bevelSize: 0.08,
            bevelThickness: 0.08
        });
        faceGeo.computeVertexNormals();

        // Normalize UV coordinates [X: -35.0..35.0, Y: -77.25..77.25]
        const pos = faceGeo.attributes.position;
        const uv = faceGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            uv.setXY(i, (pos.getX(i) + 35.0) / 70.0, (pos.getY(i) + 77.25) / 154.5);
        }
        uv.needsUpdate = true;

        const texture = this._generateFaceplateDecals();
        const faceMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: texture,
            roughness: 0.30,
            metalness: 0.45
        });

        const faceMesh = new THREE.Mesh(faceGeo, faceMat);
        faceMesh.name = 'SilverFaceplate';
        faceMesh.position.z = 0.70; // Sits flush with bezel rim
        faceMesh.castShadow = true;
        faceMesh.userData = { componentId: 'front_case' };
        group.add(faceMesh);
        this.faceMesh = faceMesh;

        return group;
    }

    _generateFaceplateDecals() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 4096;
        const ctx = canvas.getContext('2d');

        // 1. Brushed Aluminum Silver Base
        const grad = ctx.createLinearGradient(0, 0, 2048, 4096);
        grad.addColorStop(0, '#edf0f6');
        grad.addColorStop(0.3, '#d8dce6');
        grad.addColorStop(0.7, '#e4e7f0');
        grad.addColorStop(1, '#d5d9e4');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 2048, 4096);

        // Micro hairline brushed texture
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        for (let y = 0; y < 4096; y += 4) {
            if (Math.random() > 0.4) ctx.fillRect(0, y, 2048, 1);
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        for (let y = 0; y < 4096; y += 6) {
            if (Math.random() > 0.5) ctx.fillRect(0, y, 2048, 1);
        }

        const toX = (x) => ((x + 35.0) / 70.0) * 2048;
        const toY = (y) => ((77.25 - y) / 154.5) * 4096;

        // 2. Top Header Brand Markings
        // CASIO Logo
        ctx.fillStyle = '#111827';
        ctx.font = '900 115px "Arial", "Helvetica Neue", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('CASIO', toX(-27), toY(64));

        // NATURAL-V.P.A.M. (Emerald Green)
        ctx.fillStyle = '#059669';
        ctx.font = 'italic bold 64px "Arial", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NATURAL-V.P.A.M.', toX(-4), toY(64));

        // Model Code: fx-570ES PLUS
        ctx.fillStyle = '#1e293b';
        ctx.font = 'italic bold 86px "Times New Roman", serif';
        ctx.textAlign = 'right';
        ctx.fillText('fx-570ES PLUS', toX(30), toY(64));

        // 3. LCD Screen Bezel Border Frame (window border at Y=42)
        const lx = toX(-28), ly = toY(56), lw = toX(28) - toX(-28), lh = toY(28) - toY(56);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 14;
        ctx.strokeRect(lx - 8, ly - 8, lw + 16, lh + 16);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.strokeRect(lx - 2, ly - 2, lw + 4, lh + 4);

        // 4. Secondary Key Labels (SHIFT gold, ALPHA red, MATH teal)
        const drawLabel = (text, x, y, color = '#fbbf24', font = 'bold 36px sans-serif') => {
            ctx.fillStyle = color;
            ctx.font = font;
            ctx.textAlign = 'center';
            ctx.fillText(text, toX(x), toY(y));
        };

        // Top Key Labels
        drawLabel('SHIFT', -24, 27.5, '#d97706');
        drawLabel('ALPHA', -15, 20.5, '#e11d48');
        drawLabel('MODE', 15, 20.5, '#475569');
        drawLabel('SETUP', 15, 22.5, '#d97706', 'bold 26px sans-serif');
        drawLabel('ON', 24, 27.5, '#475569');

        // Replay Pad Label
        drawLabel('REPLAY', 0, 18.2, '#64748b', 'bold 30px sans-serif');

        // Sci Key Row 1 Labels
        drawLabel('SOLVE =', -24, 9.8, '#d97706');
        drawLabel('d/dx :', -12, 9.8, '#d97706');
        drawLabel('x!', 12, 9.8, '#d97706');
        drawLabel('Σ', 24, 9.8, '#d97706');

        // Sci Key Row 2 Labels
        drawLabel('■/□', -25, 1.2, '#475569');
        drawLabel('³√■', -15, 1.2, '#d97706');
        drawLabel('x³', -5, 1.2, '#d97706');
        drawLabel('ⁿ√■', 5, 1.2, '#d97706');
        drawLabel('10ⁿ', 15, 1.2, '#d97706');
        drawLabel('eⁿ', 25, 1.2, '#d97706');

        // Sci Key Row 3 Labels
        drawLabel('A', -25, -6.8, '#e11d48');
        drawLabel('B', -15, -6.8, '#e11d48');
        drawLabel('C', -5, -6.8, '#e11d48');
        drawLabel('sin⁻¹ D', 5, -6.8, '#d97706');
        drawLabel('cos⁻¹ E', 15, -6.8, '#d97706');
        drawLabel('tan⁻¹ F', 25, -6.8, '#d97706');

        // Sci Key Row 4 Labels
        drawLabel('STO', -25, -14.8, '#d97706');
        drawLabel('←', -15, -14.8, '#d97706');
        drawLabel('%', -5, -14.8, '#d97706');
        drawLabel(',', 5, -14.8, '#d97706');
        drawLabel('a b/c ⇔ d/c', 15, -14.8, '#d97706');
        drawLabel('M-', 25, -14.8, '#d97706');

        // Numeric Keypad Labels
        drawLabel('CONST', -25, -25.5, '#d97706');
        drawLabel('CONV', -12.5, -25.5, '#d97706');
        drawLabel('CLR', 0, -25.5, '#d97706');
        drawLabel('INS', 12.5, -25.5, '#d97706');
        drawLabel('OFF', 25, -25.5, '#d97706');

        drawLabel('MATRIX', -25, -37.5, '#d97706');
        drawLabel('VECTOR', -12.5, -37.5, '#d97706');
        drawLabel('nPr', 12.5, -37.5, '#d97706');
        drawLabel('nCr', 25, -37.5, '#d97706');

        drawLabel('STAT', -25, -49.5, '#d97706');
        drawLabel('CMPLX', -12.5, -49.5, '#d97706');
        drawLabel('BASE', 0, -49.5, '#d97706');
        drawLabel('Pol', 12.5, -49.5, '#d97706');
        drawLabel('Rec', 25, -49.5, '#d97706');

        drawLabel('Rnd', -25, -61.5, '#d97706');
        drawLabel('Ran#', -12.5, -61.5, '#d97706');
        drawLabel('π', 0, -61.5, '#d97706');
        drawLabel('DRG▶', 12.5, -61.5, '#d97706');

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 16;
        return tex;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 14: 50 SCULPTED MECHANICAL KEYCAPS
    // ─────────────────────────────────────────────────────────────
    _create50Keycaps() {
        const keycapsGroup = new THREE.Group();
        keycapsGroup.name = 'Keycaps50Group';
        keycapsGroup.userData = { componentId: 'keycaps_group', isSelectablePart: true };

        // Replay Pad (Circular concave pad with 4 direction arrows)
        const replayMesh = this._createReplayPad();
        keycapsGroup.add(replayMesh);
        this.userData.keycaps.set('key_replay', replayMesh);

        const dirs = [
            { id: 'key_replay_up', label: '▲', x: 0, y: 23 },
            { id: 'key_replay_down', label: '▼', x: 0, y: 13 },
            { id: 'key_replay_left', label: '◀', x: -6.5, y: 18 },
            { id: 'key_replay_right', label: '▶', x: 6.5, y: 18 }
        ];
        dirs.forEach(d => {
            const hotSpot = new THREE.Object3D();
            hotSpot.name = d.id;
            hotSpot.position.set(d.x, d.y, 2.0);
            hotSpot.userData = { id: d.id, label: d.label, isReplayDir: true };
            keycapsGroup.add(hotSpot);
            this.userData.keycaps.set(d.id, hotSpot);
        });

        // Top Navigation Oval Keys
        const TOP_KEYS = [
            { id: 'key_shift', label: 'SHIFT', x: -24, y: 23, w: 9.0, h: 5.5, color: 0x54587c, textColor: '#fbbf24' },
            { id: 'key_alpha', label: 'ALPHA', x: -15, y: 16, w: 9.0, h: 5.5, color: 0x54587c, textColor: '#f43f5e' },
            { id: 'key_mode',  label: 'MODE',  x: 15,  y: 16, w: 9.0, h: 5.5, color: 0x54587c, textColor: '#ffffff' },
            { id: 'key_on',    label: 'ON',    x: 24,  y: 23, w: 9.0, h: 5.5, color: 0x54587c, textColor: '#ffffff' }
        ];
        TOP_KEYS.forEach(k => {
            const mesh = this._createPillKeycap(k);
            keycapsGroup.add(mesh);
            this.userData.keycaps.set(k.id, mesh);
        });

        // Sci Function Keys
        const SCI_KEYS = [
            { id: 'key_calc',     label: 'CALC', x: -24, y: 5.5, w: 9.0, h: 5.2, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_integral', label: '∫dx',  x: -12, y: 5.5, w: 9.0, h: 5.2, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_x_inv',    label: 'x⁻¹',  x: 12,  y: 5.5, w: 9.0, h: 5.2, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_log_ab',   label: 'log_a',x: 24,  y: 5.5, w: 9.0, h: 5.2, color: 0x242732, textColor: '#ffffff' },

            { id: 'key_frac', label: '■/□', x: -25,  y: -2.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_sqrt', label: '√■',  x: -15,  y: -2.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_x2',   label: 'x²',  x: -5,   y: -2.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_xy',   label: 'xⁿ',  x: 5,    y: -2.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_log',  label: 'log', x: 15,   y: -2.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_ln',   label: 'ln',  x: 25,   y: -2.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },

            { id: 'key_neg',  label: '(-)', x: -25,  y: -10.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_deg',  label: '°\'"',x: -15,  y: -10.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_hyp',  label: 'hyp', x: -5,   y: -10.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_sin',  label: 'sin', x: 5,    y: -10.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_cos',  label: 'cos', x: 15,   y: -10.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_tan',  label: 'tan', x: 25,   y: -10.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },

            { id: 'key_sto',  label: 'RCL', x: -25,  y: -18.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_eng',  label: 'ENG', x: -15,  y: -18.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_lpar', label: '(',   x: -5,   y: -18.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_rpar', label: ')',   x: 5,    y: -18.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_sd',   label: 'S⇔D', x: 15,   y: -18.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' },
            { id: 'key_mplus',label: 'M+',  x: 25,   y: -18.5, w: 7.6, h: 5.0, color: 0x242732, textColor: '#ffffff' }
        ];
        SCI_KEYS.forEach(k => {
            const mesh = this._createPillKeycap(k);
            keycapsGroup.add(mesh);
            this.userData.keycaps.set(k.id, mesh);
        });

        // Numeric Keypad
        const KEYPAD_KEYS = [
            { id: 'key_7',   label: '7',   x: -25,  y: -30.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_8',   label: '8',   x: -12.5,y: -30.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_9',   label: '9',   x: 0,    y: -30.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_del', label: 'DEL', x: 12.5, y: -30.5, color: 0xf97316, textColor: '#ffffff' },
            { id: 'key_ac',  label: 'AC',  x: 25,   y: -30.5, color: 0xf97316, textColor: '#ffffff' },

            { id: 'key_4',   label: '4',   x: -25,  y: -42.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_5',   label: '5',   x: -12.5,y: -42.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_6',   label: '6',   x: 0,    y: -42.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_mul', label: '×',   x: 12.5, y: -42.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_div', label: '÷',   x: 25,   y: -42.5, color: 0xf3f5f8, textColor: '#1e293b' },

            { id: 'key_1',   label: '1',   x: -25,  y: -54.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_2',   label: '2',   x: -12.5,y: -54.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_3',   label: '3',   x: 0,    y: -54.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_add', label: '+',   x: 12.5, y: -54.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_sub', label: '-',   x: 25,   y: -54.5, color: 0xf3f5f8, textColor: '#1e293b' },

            { id: 'key_0',   label: '0',   x: -25,  y: -66.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_dot', label: '•',   x: -12.5,y: -66.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_exp', label: 'x10ⁿ',x: 0,    y: -66.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_ans', label: 'Ans', x: 12.5, y: -66.5, color: 0xf3f5f8, textColor: '#1e293b' },
            { id: 'key_eq',  label: '=',   x: 25,   y: -66.5, color: 0xf3f5f8, textColor: '#1e293b' }
        ];
        KEYPAD_KEYS.forEach(k => {
            const mesh = this._createRectKeycap(k);
            keycapsGroup.add(mesh);
            this.userData.keycaps.set(k.id, mesh);
        });

        keycapsGroup.position.z = 1.0;
        return keycapsGroup;
    }

    _createReplayPad() {
        const radius = 9.8;
        const geo = new THREE.CylinderGeometry(radius, radius, 1.8, 36);
        geo.computeVertexNormals();

        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        grad.addColorStop(0, '#787da4');
        grad.addColorStop(0.7, '#54587c');
        grad.addColorStop(1, '#393c59');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(256, 256, 256, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#1c1f2e';
        ctx.beginPath(); ctx.moveTo(256, 55); ctx.lineTo(232, 90); ctx.lineTo(280, 90); ctx.fill();
        ctx.beginPath(); ctx.moveTo(256, 457); ctx.lineTo(232, 422); ctx.lineTo(280, 422); ctx.fill();
        ctx.beginPath(); ctx.moveTo(55, 256); ctx.lineTo(90, 232); ctx.lineTo(90, 280); ctx.fill();
        ctx.beginPath(); ctx.moveTo(457, 256); ctx.lineTo(422, 232); ctx.lineTo(422, 280); ctx.fill();

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, roughness: 0.35, metalness: 0.25 });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = 'key_replay';
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(0, 18, 0);
        mesh.castShadow = false;
        mesh.userData = { id: 'key_replay', label: 'REPLAY', baseZ: 0, componentId: 'keycaps_group' };
        return mesh;
    }

    _createPillKeycap(spec) {
        const shape = new THREE.Shape();
        const w = spec.w, h = spec.h, r = Math.min(w, h) / 2.2;
        shape.moveTo(-w/2 + r, -h/2);
        shape.lineTo(w/2 - r, -h/2);
        shape.absarc(w/2 - r, -h/2 + r, r, -Math.PI/2, 0, false);
        shape.lineTo(w/2, h/2 - r);
        shape.absarc(w/2 - r, h/2 - r, r, 0, Math.PI/2, false);
        shape.lineTo(-w/2 + r, h/2);
        shape.absarc(-w/2 + r, h/2 - r, r, Math.PI/2, Math.PI, false);
        shape.lineTo(-w/2, -h/2 + r);
        shape.absarc(-w/2 + r, -h/2 + r, r, Math.PI, Math.PI * 1.5, false);

        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 1.8,
            bevelEnabled: true,
            bevelSegments: 2,
            bevelSize: 0.3,
            bevelThickness: 0.3
        });
        geo.computeVertexNormals();

        const pos = geo.attributes.position;
        const uv = geo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            uv.setXY(i, (pos.getX(i) + w/2) / w, (pos.getY(i) + h/2) / h);
        }
        uv.needsUpdate = true;

        const colorHex = '#' + spec.color.toString(16).padStart(6, '0');
        const texture = this._generateKeycapTexture(spec.label, colorHex, spec.textColor || '#ffffff');
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: texture,
            roughness: 0.38,
            metalness: 0.15
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = spec.id;
        mesh.position.set(spec.x, spec.y, 0);
        mesh.castShadow = false;
        mesh.userData = { id: spec.id, label: spec.label, baseZ: 0, componentId: 'keycaps_group' };
        return mesh;
    }

    _createRectKeycap(spec) {
        const shape = new THREE.Shape();
        const w = 10.2, h = 7.6, r = 1.4;
        shape.moveTo(-w/2 + r, -h/2);
        shape.lineTo(w/2 - r, -h/2);
        shape.absarc(w/2 - r, -h/2 + r, r, -Math.PI/2, 0, false);
        shape.lineTo(w/2, h/2 - r);
        shape.absarc(w/2 - r, h/2 - r, r, 0, Math.PI/2, false);
        shape.lineTo(-w/2 + r, h/2);
        shape.absarc(-w/2 + r, h/2 - r, r, Math.PI/2, Math.PI, false);
        shape.lineTo(-w/2, -h/2 + r);
        shape.absarc(-w/2 + r, -h/2 + r, r, Math.PI, Math.PI * 1.5, false);

        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 1.8,
            bevelEnabled: true,
            bevelSegments: 2,
            bevelSize: 0.3,
            bevelThickness: 0.3
        });
        geo.computeVertexNormals();

        const pos = geo.attributes.position;
        const uv = geo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            uv.setXY(i, (pos.getX(i) + w/2) / w, (pos.getY(i) + h/2) / h);
        }
        uv.needsUpdate = true;

        const colorHex = '#' + spec.color.toString(16).padStart(6, '0');
        const texture = this._generateKeycapTexture(spec.label, colorHex, spec.textColor || '#1e293b');
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: texture,
            roughness: 0.35,
            metalness: 0.1
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = spec.id;
        mesh.position.set(spec.x, spec.y, 0);
        mesh.castShadow = false;
        mesh.userData = { id: spec.id, label: spec.label, baseZ: 0, componentId: 'keycaps_group' };
        return mesh;
    }

    _generateKeycapTexture(label, bgColorHex = '#242732', textColorHex = '#ffffff') {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = bgColorHex;
        ctx.fillRect(0, 0, 128, 128);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fillRect(0, 0, 128, 8);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
        ctx.fillRect(0, 120, 128, 8);

        ctx.fillStyle = textColorHex;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (label.length > 4) ctx.font = 'bold 26px "JetBrains Mono", sans-serif';
        else if (label.length > 2) ctx.font = 'bold 36px "JetBrains Mono", sans-serif';
        else if (label.length > 1) ctx.font = 'bold 44px "JetBrains Mono", sans-serif';
        else ctx.font = 'bold 56px "JetBrains Mono", sans-serif';

        ctx.fillText(label, 64, 64);
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        return tex;
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 15: CASIO GPT AI HARDWARE MOD (ESP32-CAM & Li-Po)
    // ─────────────────────────────────────────────────────────────
    _createCasioGptMod() {
        const group = new THREE.Group();
        group.name = 'CasioGptModGroup';
        group.userData = { componentId: 'casio_gpt_mod', isSelectablePart: true };

        // 1. ESP32-CAM Board (27 x 40.5 x 4.5 mm)
        const pcbGeo = new THREE.BoxGeometry(27, 40, 1.2);
        const pcbMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.4 });
        const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
        pcbMesh.position.set(0, 52, 0);
        pcbMesh.userData = { componentId: 'casio_gpt_mod' };
        group.add(pcbMesh);

        // Metal RF Shield on ESP32
        const shieldGeo = new THREE.BoxGeometry(16, 18, 1.4);
        const shieldMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.2 });
        const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        shieldMesh.position.set(0, 56, 1.0);
        shieldMesh.userData = { componentId: 'casio_gpt_mod' };
        group.add(shieldMesh);

        // MicroSD Slot
        const sdGeo = new THREE.BoxGeometry(14, 15, 1.2);
        const sdMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.85, roughness: 0.25 });
        const sdMesh = new THREE.Mesh(sdGeo, sdMat);
        sdMesh.position.set(0, 38, 0.9);
        sdMesh.userData = { componentId: 'casio_gpt_mod' };
        group.add(sdMesh);

        // 2. OV2640 Camera Lens tilted 15° (positioned in the Solar aperture)
        const lensBase = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 4), new THREE.MeshStandardMaterial({ color: 0x18181b }));
        const lensCyl = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 3, 16), new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.8 }));
        lensCyl.rotation.x = Math.PI / 2;
        lensCyl.position.z = 2.0;
        const camUnit = new THREE.Group();
        camUnit.add(lensBase);
        camUnit.add(lensCyl);
        camUnit.position.set(18, 64, 1.0);
        camUnit.rotation.x = -15 * (Math.PI / 180); // 15° tilt
        camUnit.userData = { componentId: 'casio_gpt_mod' };
        group.add(camUnit);

        // 3. Li-Po 402030 Battery Pack (3.7V 250mAh)
        const lipoGeo = new THREE.BoxGeometry(20, 30, 4.0);
        const lipoMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3, metalness: 0.4 }); // Golden Kapton wrap
        const lipoMesh = new THREE.Mesh(lipoGeo, lipoMat);
        lipoMesh.position.set(-18, 52, 0.5);
        lipoMesh.userData = { componentId: 'casio_gpt_mod' };
        group.add(lipoMesh);

        // 4. TP4056 Type-C Charger Module with USB-C Port
        const tpGeo = new THREE.BoxGeometry(16, 25, 1.0);
        const tpMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
        const tpMesh = new THREE.Mesh(tpGeo, tpMat);
        tpMesh.position.set(0, -68, 0.4);
        tpMesh.userData = { componentId: 'casio_gpt_mod' };
        group.add(tpMesh);

        // USB-C Connector shell
        const usbcGeo = new THREE.BoxGeometry(8.5, 6, 2.8);
        const usbcMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15 });
        const usbcMesh = new THREE.Mesh(usbcGeo, usbcMat);
        usbcMesh.position.set(0, -78, 0.4);
        usbcMesh.userData = { componentId: 'casio_gpt_mod' };
        group.add(usbcMesh);

        // 5. Enamelled copper jumper wires (0.1mm) to phím CALC (GPIO12) & Replay (GPIO15)
        const jumperMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3, metalness: 0.9 });
        const jCurve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(5, 42, 1.0),
            new THREE.Vector3(-10, 20, 1.2),
            new THREE.Vector3(-24, 5.5, 1.2) // Phím CALC
        ]);
        const wire1 = new THREE.Mesh(new THREE.TubeGeometry(jCurve1, 30, 0.25, 6, false), jumperMat);
        wire1.userData = { componentId: 'casio_gpt_mod' };
        group.add(wire1);

        const jCurve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(8, 42, 1.0),
            new THREE.Vector3(5, 28, 1.2),
            new THREE.Vector3(0, 18, 1.2) // Phím REPLAY
        ]);
        const wire2 = new THREE.Mesh(new THREE.TubeGeometry(jCurve2, 20, 0.25, 6, false), jumperMat);
        wire2.userData = { componentId: 'casio_gpt_mod' };
        group.add(wire2);

        group.position.z = -0.2;
        return group;
    }

    // ─────────────────────────────────────────────────────────────
    // LCD DISPLAY RENDERER (HIGH CONTRAST NATURAL-V.P.A.M.)
    // ─────────────────────────────────────────────────────────────
    updateLcd() {
        if (!this.lcdCtx) return;
        const ctx = this.lcdCtx;
        const w = 1024, h = 512;

        // Vintage STN greenish-grey background
        ctx.fillStyle = '#a2b4a3';
        ctx.fillRect(0, 0, w, h);

        // Dot matrix grid pixels
        ctx.fillStyle = 'rgba(15, 23, 16, 0.04)';
        for (let x = 0; x < w; x += 12) {
            ctx.fillRect(x, 0, 2, h);
        }
        for (let y = 0; y < h; y += 12) {
            ctx.fillRect(0, y, w, 2);
        }

        const state = this.calculator.getDisplayState();

        // Status indicators on top line
        ctx.fillStyle = '#1c2e1e';
        ctx.font = 'bold 36px "JetBrains Mono", monospace';
        let flagX = 35;
        if (state.shiftActive) { ctx.fillText('S', flagX, 42); }
        flagX += 45;
        if (state.alphaActive) { ctx.fillText('A', flagX, 42); }
        flagX += 45;
        if (state.hasMemory) { ctx.fillText('M', flagX, 42); }
        flagX += 45;
        if (state.stoActive) { ctx.fillText('STO', flagX, 42); }
        
        ctx.fillText(state.angleUnit || 'D', w - 240, 42);
        ctx.fillText('Math ▲▼', w - 160, 42);

        ctx.fillStyle = '#0f1710';

        if (state.isDefaultFormula) {
            // Canonical integral matching reference image 1
            ctx.font = '160px serif';
            ctx.fillText('∫', 50, 310);

            ctx.font = 'bold 44px "JetBrains Mono", sans-serif';
            ctx.fillText('π', 125, 155);
            ctx.fillRect(115, 170, 40, 5);
            ctx.fillText('3', 125, 215);

            ctx.font = 'bold 48px "JetBrains Mono", sans-serif';
            ctx.fillText('0', 110, 350);

            ctx.font = 'bold 84px "JetBrains Mono", sans-serif';
            ctx.fillText('sin(X)dx', 210, 275);

            // Result = 1/2
            ctx.font = 'bold 78px "JetBrains Mono", sans-serif';
            ctx.fillText('1', w - 150, 230);
            ctx.fillRect(w - 170, 252, 70, 7);
            ctx.fillText('2', w - 150, 320);

        } else {
            // Live interactive expression and evaluation
            ctx.font = 'bold 64px "JetBrains Mono", monospace';
            const exprText = state.expression || '0';
            ctx.fillText(exprText, 45, 190);

            if (state.resultFormatted) {
                if (state.fraction) {
                    const numStr = state.fraction.num.toString();
                    const denStr = state.fraction.den.toString();
                    ctx.font = 'bold 72px "JetBrains Mono", monospace';
                    ctx.textAlign = 'right';
                    ctx.fillText(numStr, w - 60, 340);
                    const barW = Math.max(numStr.length, denStr.length) * 48 + 20;
                    ctx.fillRect(w - 60 - barW, 362, barW, 6);
                    ctx.fillText(denStr, w - 60, 440);
                    ctx.textAlign = 'left';
                } else {
                    ctx.font = 'bold 88px "JetBrains Mono", monospace';
                    ctx.textAlign = 'right';
                    ctx.fillText(state.resultFormatted, w - 60, 410);
                    ctx.textAlign = 'left';
                }
            }
        }

        if (this.lcdTexture) {
            this.lcdTexture.needsUpdate = true;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // EXPLODED VIEW LAYER SEPARATION (PROPORTIONAL 0% - 100%)
    // ─────────────────────────────────────────────────────────────
    setExplodedOffset(factor = 0) {
        this.userData.explodedFactor = factor;
        const t = Math.max(0, Math.min(1, factor));

        const hardCase = this.userData.components.get('hard_case');
        const backCase = this.userData.components.get('back_case');
        const battery = this.userData.components.get('battery_assembly');
        const powerWires = this.userData.components.get('power_wiring');
        const solarModule = this.userData.components.get('solar_module');
        const pcb = this.userData.components.get('main_pcb');
        const asic = this.userData.components.get('asic_controller');
        const smd = this.userData.components.get('smd_components');
        const silicone = this.userData.components.get('silicone_membrane');
        const heatSeal = this.userData.components.get('heat_seal_cable');
        const tinplate = this.userData.components.get('tinplate_shield');
        const lcd = this.userData.components.get('lcd_assembly');
        const frontCase = this.userData.components.get('front_case');
        const keycaps = this.userData.components.get('keycaps_group');
        const gptMod = this.userData.components.get('casio_gpt_mod');

        // Smooth non-clashing separation along Z:
        if (hardCase) hardCase.position.z = -6.8 - t * 50.0;
        if (backCase) backCase.position.z = -4.2 - t * 36.0;
        if (battery) battery.position.z = -3.0 - t * 26.0;
        if (powerWires) powerWires.position.z = -2.2 - t * 20.0;
        if (solarModule) solarModule.position.z = -1.8 - t * 16.0;
        if (pcb) pcb.position.z = -1.2 - t * 12.0;
        if (asic) asic.position.z = -0.5 - t * 7.0;
        if (smd) smd.position.z = -0.5 - t * 7.0;
        if (silicone) silicone.position.z = -0.1 + t * 4.0;
        if (heatSeal) heatSeal.position.z = 0.25 + t * 8.0;
        if (tinplate) tinplate.position.z = 0.35 + t * 12.0;
        if (lcd) lcd.position.z = 0.50 + t * 16.0;
        if (frontCase) frontCase.position.z = 0.0 + t * 20.0;
        if (this.faceMesh) this.faceMesh.position.z = 0.70 + t * 4.0;
        if (keycaps) keycaps.position.z = 1.05 + t * 28.0;
        if (gptMod && gptMod.visible) gptMod.position.z = -0.2 - t * 4.0;
    }

    // ─────────────────────────────────────────────────────────────
    // GHOST MODE / COMPONENT ISOLATION (TRANSPARENCY 0.14)
    // ─────────────────────────────────────────────────────────────
    setGhostMode(activeCompId) {
        this.isolatedComponentId = activeCompId;

        this.traverse(obj => {
            if (!obj.isMesh) return;

            // Clone material if not already cloned to prevent shared state bugs
            if (!obj.userData._hasClonedMat) {
                obj.material = obj.material.clone();
                obj.userData._hasClonedMat = true;
                obj.userData._origOpacity = obj.material.opacity !== undefined ? obj.material.opacity : 1.0;
                obj.userData._origTransparent = obj.material.transparent !== undefined ? obj.material.transparent : false;
                obj.userData._origEmissive = obj.material.emissive ? obj.material.emissive.getHex() : 0x000000;
            }

            if (!activeCompId || activeCompId === 'all') {
                // Restore all materials
                obj.material.opacity = obj.userData._origOpacity;
                obj.material.transparent = obj.userData._origTransparent;
                obj.material.depthWrite = true;
                if (obj.material.emissive) {
                    obj.material.emissive.setHex(obj.userData._origEmissive);
                    obj.material.emissiveIntensity = 0.0;
                }
            } else {
                // Find parent componentId
                let parentCompId = obj.userData.componentId;
                let cur = obj.parent;
                while (cur && cur !== this && !parentCompId) {
                    if (cur.userData && cur.userData.componentId) {
                        parentCompId = cur.userData.componentId;
                        break;
                    }
                    cur = cur.parent;
                }

                if (parentCompId === activeCompId) {
                    // Selected component: 100% opaque + glowing cyan/purple edge
                    obj.material.opacity = 1.0;
                    obj.material.transparent = false;
                    obj.material.depthWrite = true;
                    if (obj.material.emissive) {
                        obj.material.emissive.setHex(0x38bdf8);
                        obj.material.emissiveIntensity = 0.45;
                    }
                } else {
                    // Non-selected: Ghost mode transparent (opacity: 0.14)
                    obj.material.opacity = 0.14;
                    obj.material.transparent = true;
                    obj.material.depthWrite = false;
                    if (obj.material.emissive) {
                        obj.material.emissive.setHex(0x000000);
                        obj.material.emissiveIntensity = 0.0;
                    }
                }
            }
        });
    }

    // ─────────────────────────────────────────────────────────────
    // TOGGLE MOD MODE: FACTORY ZIN VS CASIO GPT AI
    // ─────────────────────────────────────────────────────────────
    setModMode(isMod) {
        this.isModEnabled = !!isMod;
        const gptMod = this.userData.components.get('casio_gpt_mod');
        const solarModule = this.userData.components.get('solar_module');
        if (gptMod) gptMod.visible = this.isModEnabled;
        // When AI mod is active, camera replaces the solar cell
        if (solarModule) solarModule.visible = !this.isModEnabled;
    }

    // ─────────────────────────────────────────────────────────────
    // KEY TRAVEL & INTERACTIVE CLICK ANIMATION
    // ─────────────────────────────────────────────────────────────
    pressKey(keyId, duration = 120) {
        const mesh = this.userData.keycaps.get(keyId);
        if (mesh && mesh.userData && mesh.userData.baseZ !== undefined) {
            const baseZ = mesh.userData.baseZ;
            mesh.position.z = baseZ - 1.0;
            setTimeout(() => {
                mesh.position.z = baseZ;
            }, duration);
        } else if (keyId.startsWith('key_replay')) {
            const replayDisc = this.userData.keycaps.get('key_replay');
            if (replayDisc) {
                replayDisc.position.z = -0.6;
                setTimeout(() => { replayDisc.position.z = 0; }, duration);
            }
        }

        this.calculator.pressKey(keyId);
        this.updateLcd();
    }

    updateLcdDisplay(customText) {
        if (customText === 'formula') {
            this.calculator.setDefaultFormula();
        } else if (customText !== undefined) {
            this.calculator.rawInput = customText;
            this.calculator.executeCalculation();
        }
        this.updateLcd();
    }
}

// Factory export
export function createFrontCaseGroup(options = {}) {
    return new FrontCaseGroup(options);
}
