// Eenvoudige tests voor de geometrie in index.html.
// Start met:  node tests/geometry.test.js
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/\/\*GEO-START\*\/([\s\S]*?)\/\*GEO-END\*\//);
if (!m) throw new Error('GEO-blok niet gevonden in index.html');
const Geo = new Function(m[1] + '\nreturn Geo;')();

let failed = 0, passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ok  ' + name); }
  catch (e) { failed++; console.log('  FOUT ' + name + '\n       ' + e.message); }
}
const near = (actual, expected, label, tol = 0.005) =>
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: verwacht ${expected}, kreeg ${actual.toFixed(4)}`);

const noShrink = { krimp: 0, t: 0, ref: 'buiten', marge: false, margeCm: 0 };

console.log('Modus 2: gestapelde rechthoeken (8×6 · 14×10 · 7×5)');
const sec = Geo.sections({
  diamRef: 'hoek',
  levels: [
    { z: 0, type: 'rect', w: 8, d: 6 },
    { z: 15, type: 'rect', w: 14, d: 10 },
    { z: 25, type: 'rect', w: 7, d: 5 },
  ],
}, noShrink);

test('geen fout', () => assert.ok(!sec.error, sec.error));
test('4 kolommen', () => assert.strictEqual(sec.columns.length, 4));
test('voorvlak: breedtes 8 → 14 → 7', () => {
  const w = sec.columns[0].widths;
  near(w[0], 8, 'onder'); near(w[1], 14, 'midden'); near(w[2], 7, 'boven');
});
test('voorvlak: ware hoogtes 15,13 en 10,31', () => {
  near(sec.columns[0].segs[0].h, 15.13, 'segment 1');
  near(sec.columns[0].segs[1].h, 10.31, 'segment 2');
});
test('zijvlak: breedtes 6 → 10 → 5', () => {
  const w = sec.columns[1].widths;
  near(w[0], 6, 'onder'); near(w[1], 10, 'midden'); near(w[2], 5, 'boven');
});
test('zijvlak: ware hoogtes 15,30 en 10,59', () => {
  near(sec.columns[1].segs[0].h, 15.30, 'segment 1');
  near(sec.columns[1].segs[1].h, 10.59, 'segment 2');
});
test('achter = voor, links = rechts', () => {
  near(sec.columns[2].segs[0].h, sec.columns[0].segs[0].h, 'achter', 1e-9);
  near(sec.columns[3].segs[1].h, sec.columns[1].segs[1].h, 'links', 1e-9);
});
test('knik op niveau 2 is een bolle knik', () => {
  assert.strictEqual(sec.columns[0].creases.length, 1);
  assert.strictEqual(sec.columns[0].creases[0].kind, 'bol');
  assert.ok(sec.columns[0].creases[0].knik > 0);
});
test('verticale naad bij rechte doos = 45° afschuinen', () => {
  const box = Geo.sections({ levels: [{ z: 0, type: 'rect', w: 10, d: 10 }, { z: 10, type: 'rect', w: 10, d: 10 }] }, noShrink);
  near(box.columns[0].rightSeam[0].bevel, 45, 'afschuinhoek', 1e-6);
  near(box.columns[0].baseAngle, 90, 'hoek bodem–wand', 1e-6);
});
test('bodemplaat = onderste doorsnede (8 × 6)', () => {
  const L = sec.bottom.lengths;
  near(L[0], 8, 'breedte'); near(L[1], 6, 'diepte');
});

console.log('\nModus 1: omgekeerd trapezium (boven 30, onder 12, hoogte 18, diepte 8, t = 0,8)');
const sil = Geo.silhouette({
  pts: [[9, 0], [21, 0], [30, 18], [0, 18]],
  open: [false, false, true, false],
  depth: 8,
}, Object.assign({}, noShrink, { t: 0.8 }));

test('geen fout', () => assert.ok(!sil.error, sil.error));
test('onderrand 12', () => near(sil.lengths[0], 12, 'onderrand'));
test('schuine zijden 20,12 elk', () => {
  near(sil.lengths[1], 20.12, 'rechts'); near(sil.lengths[3], 20.12, 'links');
});
test('bovenrand open, 30 lang', () => { assert.ok(sil.open[2]); near(sil.lengths[2], 30, 'bovenrand'); });
test('zijstrook: lengte 52,25 × breedte 6,4', () => {
  near(sil.closedLen, 52.25, 'lengte');
  near(sil.stripWidth, 6.4, 'breedte', 1e-9);
  assert.strictEqual(sil.runs.length, 1);
  near(sil.runs[0].length, 52.25, 'strooklengte');
});
test('zijstrook: 2 vouwen op 20,12 en 32,12', () => {
  const f = sil.runs[0].folds;
  assert.strictEqual(f.length, 2);
  near(f[0].at, 20.12, 'vouw 1'); near(f[1].at, 32.12, 'vouw 2');
});
test('hoeken van het paneel tellen op tot 360°', () => {
  near(sil.angles.reduce((a, b) => a + b, 0), 360, 'som', 1e-6);
});

console.log('\nAlgemeen');
test('krimp 12 % vergroot alle maten met 1/0,88', () => {
  const k = Geo.silhouette({ pts: [[0, 0], [10, 0], [10, 10], [0, 10]], open: [false, false, true, false], depth: 8 },
    Object.assign({}, noShrink, { krimp: 12 }));
  near(k.lengths[0], 10 / 0.88, 'zijde', 1e-9);
});
test('binnenmaat: rechthoek wordt 2t groter', () => {
  const b = Geo.sections({ levels: [{ z: 0, type: 'rect', w: 10, d: 6 }, { z: 10, type: 'rect', w: 10, d: 6 }] },
    Object.assign({}, noShrink, { t: 0.8, ref: 'binnen' }));
  near(b.columns[0].widths[0], 11.6, 'breedte', 1e-9);
});
test('holle hoek (zigzag) geeft hoek > 180°', () => {
  const z = Geo.silhouette({ pts: [[0, 0], [10, 0], [10, 10], [5, 5], [0, 10]], open: [false, false, false, false, false], depth: 5 }, noShrink);
  assert.ok(z.angles[3] > 180, 'hoek bij de inham: ' + z.angles[3]);
  assert.strictEqual(z.runs[0].loop, true);
});
test('zeshoek met diameter 10: zijde 5', () => {
  const h = Geo.sections({ levels: [{ z: 0, type: 'ngon', n: 6, diam: 10 }, { z: 10, type: 'ngon', n: 6, diam: 10 }] }, noShrink);
  near(h.columns[0].widths[0], 5, 'zijde', 1e-9);
  near(h.columns[0].rightSeam[0].bevel, 30, 'afschuinhoek', 1e-6);
});

console.log('\nSymmetrie');
test('halve trapezium gespiegeld = volledig trapezium (20,12 · 30 open · 20,12 · 12)', () => {
  const ex = Geo.symExpand({ axis: 0, half: [[6, 0], [15, 18]], hopen: [false], top: true, bottom: false });
  assert.strictEqual(ex.pts.length, 4);
  const L = Geo.edgeLengths(ex.pts);
  near(L[0], 20.12, 'rechts'); near(L[1], 30, 'boven'); near(L[2], 20.12, 'links'); near(L[3], 12, 'onder');
  assert.deepStrictEqual(ex.open, [false, true, false, false]);
  const r = Geo.silhouette({ pts: ex.pts, open: ex.open, depth: 8 }, Object.assign({}, noShrink, { t: 0.8 }));
  near(r.closedLen, 52.25, 'zijstrook'); near(r.stripWidth, 6.4, 'breedte', 1e-9);
});
test('punt op de as wordt niet verdubbeld', () => {
  const ex = Geo.symExpand({ axis: 0, half: [[0, 0], [5, 0], [5, 10], [0, 12]], hopen: [false, false, false] });
  assert.strictEqual(ex.pts.length, 6);
  assert.ok(ex.edges.every(e => e.type === 'half'));
});
test('gespiegelde vorm is echt symmetrisch (hoeken links = rechts)', () => {
  const ex = Geo.symExpand({ axis: 0, half: [[6, 0], [9, 12], [4, 18], [3, 27]], hopen: [false, false, false], top: true });
  const a = Geo.interiorAngles(ex.pts), n = a.length;
  for (let i = 0; i < 4; i++) near(a[i], a[n - 1 - i], 'hoek P' + (i + 1), 1e-9);
});
test('toHalf haalt de rechterhelft uit een volledige vorm (heen en terug)', () => {
  const pts = [[-6, 0], [6, 0], [15, 18], [-15, 18]], open = [false, false, true, false];
  const h = Geo.toHalf(pts, open, 0);
  assert.deepStrictEqual(h.half, [[6, 0], [15, 18]]);
  assert.deepStrictEqual(h.hopen, [false]);
  assert.strictEqual(h.top, true); assert.strictEqual(h.bottom, false);
  const back = Geo.symExpand(h);
  near(Geo.edgeLengths(back.pts).reduce((x, y) => x + y, 0), Geo.edgeLengths(pts).reduce((x, y) => x + y, 0), 'omtrek', 1e-9);
});

console.log(`\n${passed} geslaagd, ${failed} mislukt`);
process.exit(failed ? 1 : 0);
