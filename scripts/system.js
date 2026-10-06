// One system, five states: LIFE -> MOLECULES -> DATA -> CODE -> AI.
// The same 180 nodes morph between formations; edges cross-fade per formation.
// Classic script + dynamic import(): works over https and when opened from disk.
(async () => {
    const THREE = await import('three');
    const canvas = document.getElementById('system');
    const hero = document.querySelector('.hero');
    const tip = document.getElementById('node-tip');
    const coordLive = document.getElementById('coord-live');
    const caption = document.getElementById('stage-caption');
    const stageButtons = [...document.querySelectorAll('.stage-list button')];
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
        canvas.remove();
        throw new Error('WebGL unavailable');
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const N = 180;
    const rand = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

    // ---------- formations ----------
    function dna() {
        const p = [], e = [], meta = [];
        const pairs = ['A–T', 'G–C', 'T–A', 'C–G'];
        for (let i = 0; i < 45; i++) {
            const t = i / 44, x = (t - 0.5) * 7.5, a = t * Math.PI * 4.2, r = 0.95;
            p[i] = new THREE.Vector3(x, Math.cos(a) * r, Math.sin(a) * r);
            p[45 + i] = new THREE.Vector3(x, Math.cos(a + Math.PI) * r, Math.sin(a + Math.PI) * r);
            p[90 + i] = p[i].clone().lerp(p[45 + i], 1 / 3);
            p[135 + i] = p[i].clone().lerp(p[45 + i], 2 / 3);
            if (i < 44) e.push([i, i + 1], [45 + i, 46 + i]);
            e.push([i, 90 + i], [90 + i, 135 + i], [135 + i, 45 + i]);
            const bp = pairs[(i * 7) % 4];
            meta[i] = meta[45 + i] = `backbone, bp ${i + 1}`;
            meta[90 + i] = meta[135 + i] = `base pair ${bp}`;
        }
        return { p, e, meta, caption: 'DNA double helix, 45 base pairs' };
    }

    function molecules() {
        // fragments grown on a honeycomb lattice: fused aromatic rings
        const p = [], e = [], meta = [];
        const L = 0.34, v1 = [Math.sqrt(3) * L, 0], v2 = [Math.sqrt(3) / 2 * L, 1.5 * L];
        const key = (a, b, s) => `${a},${b},${s}`;
        const pos = (a, b, s) => [a * v1[0] + b * v2[0], a * v1[1] + b * v2[1] + (s ? L : 0)];
        const nb = (a, b, s) => s === 0 ? [[a, b, 1], [a, b - 1, 1], [a + 1, b - 1, 1]] : [[a, b, 0], [a, b + 1, 0], [a - 1, b + 1, 0]];
        const centers = [[-3.2, 0.9, 0], [-0.9, 1.3, -0.6], [1.6, 0.8, 0.3], [3.3, -0.4, -0.4], [-2.2, -1.2, 0.5], [0.6, -1.3, 0]];
        const elems = ['O', 'N', 'O', 'Cl', 'F', 'S'];
        let idx = 0;
        centers.forEach(([cx, cy, cz], m) => {
            const chosen = new Map([[key(0, 0, 0), [0, 0, 0]]]);
            const frontier = [[0, 0, 0]];
            while (chosen.size < 30) {
                const [a, b, s] = frontier[Math.floor(rand() * frontier.length)];
                const opts = nb(a, b, s).filter((n) => !chosen.has(key(...n)));
                if (!opts.length) continue;
                const n = opts[Math.floor(rand() * opts.length)];
                chosen.set(key(...n), n);
                frontier.push(n);
            }
            const local = [...chosen.values()];
            const rot = new THREE.Euler(rand() * 0.8 - 0.4, rand() * 1.2 - 0.6, rand() * 6.28);
            const ids = new Map();
            local.forEach((n) => {
                const [x, y] = pos(...n);
                p[idx] = new THREE.Vector3(x, y, 0).applyEuler(rot).add(new THREE.Vector3(cx, cy, cz));
                ids.set(key(...n), idx++);
            });
            local.forEach((n) => {
                const deg = nb(...n).filter((k) => ids.has(key(...k))).length;
                nb(...n).forEach((k) => {
                    const j = ids.get(key(...k)), i = ids.get(key(...n));
                    if (j !== undefined && i < j) e.push([i, j]);
                });
                meta[ids.get(key(...n))] = deg === 1 ? `atom ${elems[(m + deg) % elems.length]}, terminal` : `atom C, sp², degree ${deg}`;
            });
        });
        return { p, e, meta, caption: 'Molecular graphs, 6 structures, 180 atoms' };
    }

    function data() {
        const p = [], e = [], meta = [];
        for (let i = 0; i < N; i++) {
            const u = rand() * 2 - 1, th = rand() * Math.PI * 2, r = Math.cbrt(rand());
            const s = Math.sqrt(1 - u * u);
            p[i] = new THREE.Vector3(s * Math.cos(th) * 3.6 * r, u * 1.7 * r, s * Math.sin(th) * 1.7 * r);
        }
        const seen = new Set(), deg = new Array(N).fill(0);
        for (let i = 0; i < N; i++) {
            const near = p.map((q, j) => [q.distanceToSquared(p[i]), j]).sort((a, b) => a[0] - b[0]).slice(1, 3);
            near.forEach(([, j]) => {
                const k = i < j ? `${i}-${j}` : `${j}-${i}`;
                if (!seen.has(k)) { seen.add(k); e.push([i, j]); deg[i]++; deg[j]++; }
            });
        }
        for (let i = 0; i < N; i++) meta[i] = `node ${String(i).padStart(3, '0')}, degree ${deg[i]}`;
        return { p, e, meta, caption: 'Data graph, k-nearest neighbours, k = 2' };
    }

    function code() {
        const p = [], e = [], meta = [];
        const tokens = ['import', 'rdkit', 'def', 'predict', '(mol)', 'return', 'model', '.fit', 'for', 'in', 'smiles', 'score', '=', 'np', 'tox', 'if', 'self', 'load'];
        const lines = [[0, 4], [0, 3], [0, 0], [0, 5], [1, 6], [1, 4], [2, 7], [2, 5], [1, 3], [0, 0], [0, 6], [1, 8], [2, 6], [3, 9], [2, 5], [1, 7], [1, 4], [0, 0], [0, 5], [1, 9], [1, 6], [0, 5]];
        const lh = 0.2, cw = 0.2, top = (lines.length - 1) * lh / 2;
        let idx = 0;
        lines.forEach(([indent, len], li) => {
            for (let k = 0; k < len && idx < N; k++) {
                p[idx] = new THREE.Vector3(-1.2 + (indent * 2 + k) * cw, top - li * lh, 0);
                meta[idx] = `token "${tokens[(li * 3 + k) % tokens.length]}", line ${li + 1}`;
                if (k > 0) e.push([idx - 1, idx]);
                idx++;
            }
        });
        // spare nodes park as a blinking cursor column
        while (idx < N) {
            p[idx] = new THREE.Vector3(-1.2 + 10 * cw, top - (lines.length + 0.2) * lh, (idx % 7) * 0.001);
            meta[idx++] = 'cursor';
        }
        return { p, e, meta, caption: 'Source code, 22 lines' };
    }

    function ai() {
        const p = [], e = [], meta = [];
        const layers = [10, 24, 36, 40, 36, 24, 10];
        const start = [];
        let idx = 0;
        layers.forEach((n, l) => {
            start[l] = idx;
            const x = (l - (layers.length - 1) / 2) * 1.15;
            const rr = 0.25 + n * 0.042;
            for (let k = 0; k < n; k++) {
                const a = (k / n) * Math.PI * 2;
                p[idx] = new THREE.Vector3(x, Math.cos(a) * rr, Math.sin(a) * rr * 0.6);
                meta[idx] = `neuron L${l}.${k}, σ(wx + b)`;
                idx++;
            }
        });
        layers.forEach((n, l) => {
            if (l === layers.length - 1) return;
            for (let k = 0; k < n; k++) {
                for (let c = 0; c < 2; c++) e.push([start[l] + k, start[l + 1] + Math.floor(rand() * layers[l + 1])]);
            }
        });
        return { p, e, meta, caption: 'Neural network, 7 layers, 180 neurons' };
    }

    const formations = [dna(), molecules(), data(), code(), ai()];
    const palettes = {
        light: [0x1f9d63, 0x0e8fa8, 0x2f5bea, 0x1a1c1f, 0x7a55f0].map((c) => new THREE.Color(c)),
        dark: [0x5bd69a, 0x4fd1e8, 0x3b6cff, 0xededed, 0x9b7bff].map((c) => new THREE.Color(c)),
    };
    let dark = document.documentElement.dataset.theme === 'dark';
    let tints = dark ? palettes.dark : palettes.light;

    // ---------- nodes ----------
    const sprite = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grd.addColorStop(0, 'rgba(255,255,255,1)');
        grd.addColorStop(0.35, 'rgba(255,255,255,0.9)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    })();

    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({
        size: 0.11, map: sprite, vertexColors: true, transparent: true, depthWrite: false,
    }));

    const lineMats = [];
    function applyTheme() {
        dark = document.documentElement.dataset.theme === 'dark';
        tints = dark ? palettes.dark : palettes.light;
        // glow (additive) only reads on a dark background
        const blend = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
        [nodes.material, ...lineMats].forEach((mt) => { mt.blending = blend; mt.needsUpdate = true; });
    }
    addEventListener('themechange', applyTheme);

    const system = new THREE.Group();
    system.add(nodes);
    scene.add(system);

    // one line set per formation, cross-faded
    const edgeSets = formations.map((f) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(f.e.length * 6), 3));
        const mat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
        lineMats.push(mat);
        const lines = new THREE.LineSegments(geo, mat);
        system.add(lines);
        return { lines, mat, pairs: f.e };
    });

    // ---------- timeline ----------
    const HOLD = 3.2, MORPH = 1.8;
    let from = 0, to = 0, morphStart = -Infinity, holdUntil = HOLD, paused = false;
    const current = formations[0].p.map((v) => v.clone());
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function goTo(stage, now) {
        if (stage === to && now - morphStart > MORPH) return;
        from = to;
        to = stage;
        morphStart = now;
        holdUntil = now + MORPH + HOLD;
        stageButtons.forEach((b, i) => b.classList.toggle('active', i === stage));
        caption.textContent = t(formations[stage].caption, stage);
    }

    applyTheme();

    // translations for captions and node labels
    const t = (en, i) => (window.I18N && window.I18N.lang === 'pt' ? window.I18N.pt['caption.' + i] : en);
    const ptLabel = (s) => window.I18N && window.I18N.lang === 'pt'
        ? s.replace('backbone', 'esqueleto').replace('base pair', 'par de bases').replace('atom', 'átomo').replace('terminal', 'terminal')
            .replace('degree', 'grau').replace('node', 'nó').replace('line', 'linha').replace('neuron', 'neurônio').replace('cursor', 'cursor')
        : s;
    const syncCaption = () => { caption.textContent = t(formations[to].caption, to); };
    addEventListener('langchange', syncCaption);
    syncCaption();

    const clock = new THREE.Clock();
    stageButtons.forEach((b, i) => b.addEventListener('click', () => {
        goTo(i, clock.getElapsedTime());
        holdUntil = clock.getElapsedTime() + MORPH + HOLD * 2.5;
    }));

    // ---------- pointer ----------
    const pointer = { x: 0, y: 0, px: -9999, py: -9999 };
    hero.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        pointer.px = e.clientX - r.left;
        pointer.py = e.clientY - r.top;
        pointer.x = (pointer.px / r.width) * 2 - 1;
        pointer.y = (pointer.py / r.height) * 2 - 1;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { pointer.px = pointer.py = -9999; tip.classList.remove('on'); });

    // ---------- layout ----------
    let narrow = false;
    function resize() {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        narrow = w / h < 1;
        camera.position.z = narrow ? 15 : 9;
        camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(canvas);
    resize();

    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(hero);

    // ---------- loop ----------
    const tmp = new THREE.Vector3(), col = new THREE.Color(), screen = new THREE.Vector3();
    let rotY = 0, rotX = 0;

    function frame() {
        requestAnimationFrame(frame);
        if (!visible) return;
        const t = clock.getElapsedTime();

        if (!reduceMotion && !paused && t > holdUntil) goTo((to + 1) % formations.length, t);

        const m = Math.min(Math.max((t - morphStart) / MORPH, 0), 1);
        const k = ease(m);
        const A = formations[from].p, B = formations[to].p;
        col.copy(tints[from]).lerp(tints[to], k);

        // nearest node to the cursor, in screen space
        let hover = -1, best = 26 * 26;
        const w = canvas.clientWidth, h = canvas.clientHeight;

        for (let i = 0; i < N; i++) {
            tmp.copy(A[i]).lerp(B[i], k);
            // gentle drift while morphing, so the change reads as a flow
            const wob = Math.sin(m * Math.PI) * 0.35;
            tmp.y += Math.sin(i * 1.7 + t * 1.3) * wob * 0.4;
            tmp.z += Math.cos(i * 2.3 + t) * wob;
            if (!reduceMotion) tmp.y += Math.sin(t * 0.8 + i * 0.15) * 0.02;
            current[i].copy(tmp);
            positions[i * 3] = tmp.x; positions[i * 3 + 1] = tmp.y; positions[i * 3 + 2] = tmp.z;

            screen.copy(tmp).applyMatrix4(system.matrixWorld).project(camera);
            const sx = (screen.x + 1) / 2 * w, sy = (1 - screen.y) / 2 * h;
            const d = (sx - pointer.px) ** 2 + (sy - pointer.py) ** 2;
            if (d < best) { best = d; hover = i; }
        }

        for (let i = 0; i < N; i++) {
            const c = i === hover ? (dark ? 1.6 : 0.4) : 1;
            colors[i * 3] = col.r * c; colors[i * 3 + 1] = col.g * c; colors[i * 3 + 2] = col.b * c;
        }
        nodeGeo.attributes.position.needsUpdate = true;
        nodeGeo.attributes.color.needsUpdate = true;

        // edges: old set fades out in the first half, new set fades in during the second
        edgeSets.forEach((s, i) => {
            let o = 0;
            if (i === to) o = from === to ? 1 : Math.max(0, (m - 0.5) * 2);
            if (i === from && from !== to) o = Math.max(o, 1 - m * 2);
            s.mat.opacity = o * (dark ? 0.42 : 0.5);
            s.mat.color.copy(col);
            s.lines.visible = o > 0.001;
            if (!s.lines.visible) return;
            const arr = s.lines.geometry.attributes.position.array;
            s.pairs.forEach(([a, b], j) => {
                const pa = current[a], pb = current[b];
                arr[j * 6] = pa.x; arr[j * 6 + 1] = pa.y; arr[j * 6 + 2] = pa.z;
                arr[j * 6 + 3] = pb.x; arr[j * 6 + 4] = pb.y; arr[j * 6 + 5] = pb.z;
            });
            s.lines.geometry.attributes.position.needsUpdate = true;
        });

        // tooltip reveals what each node is in the current state
        if (hover >= 0 && m === 1) {
            tip.textContent = ptLabel(formations[to].meta[hover]);
            tip.style.transform = `translate(${pointer.px + 12}px, ${pointer.py + 12}px)`;
            tip.classList.add('on');
        } else {
            tip.classList.remove('on');
        }
        coordLive.innerHTML = `x ${pointer.x.toFixed(3)}<br>y ${(-pointer.y).toFixed(3)}`;

        // camera-ish motion: slow orbit plus pointer parallax
        const tx = reduceMotion ? 0 : pointer.y * 0.25;
        const ty = (reduceMotion ? 0 : Math.sin(t * 0.15) * 0.35) + pointer.x * 0.4;
        rotX += (tx - rotX) * 0.05;
        rotY += (ty - rotY) * 0.05;
        system.rotation.set(rotX, rotY, 0);
        system.position.set(narrow ? 0 : 1.4, narrow ? 1.2 : 0.2, 0);

        renderer.render(scene, camera);
    }
    frame();
})();
