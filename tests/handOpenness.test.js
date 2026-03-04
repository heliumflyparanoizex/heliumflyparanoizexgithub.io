const test = require('node:test');
const assert = require('node:assert');
const { calculateHandOpenness } = require('../script.js');

test('calculateHandOpenness should return 1.0 for null landmarks', () => {
    assert.strictEqual(calculateHandOpenness(null), 1.0);
});

test('calculateHandOpenness should return 1.0 for undefined landmarks', () => {
    assert.strictEqual(calculateHandOpenness(undefined), 1.0);
});

test('calculateHandOpenness should return 1.0 for empty array landmarks', () => {
    assert.strictEqual(calculateHandOpenness([]), 1.0);
});

test('calculateHandOpenness should return 1.0 for landmarks with less than 21 points', () => {
    const incompleteLandmarks = new Array(20).fill({x: 0, y: 0});
    assert.strictEqual(calculateHandOpenness(incompleteLandmarks), 1.0);
});

test('calculateHandOpenness should return 1.0 if required points are missing', () => {
    const landmarks = new Array(21).fill(null);
    assert.strictEqual(calculateHandOpenness(landmarks), 1.0);
});

test('calculateHandOpenness should calculate tension for valid landmarks', () => {
    // Create synthetic landmarks for an open hand
    // wrist at (0,0), tips at (0.5, 0.5) roughly
    const landmarks = new Array(21).fill({x: 0, y: 0});
    landmarks[0] = { x: 0, y: 0 };    // wrist
    landmarks[8] = { x: 0.5, y: 0.5 }; // indexTip
    landmarks[12] = { x: 0.5, y: 0.5 }; // middleTip
    landmarks[16] = { x: 0.5, y: 0.5 }; // ringTip
    landmarks[20] = { x: 0.5, y: 0.5 }; // pinkyTip

    // dist = hypot(0.5, 0.5) = sqrt(0.5) approx 0.707
    // avgDist = 0.707
    // tension = (0.707 - 0.1) * 2.0 + 0.5 = 0.607 * 2 + 0.5 = 1.214 + 0.5 = 1.714

    const result = calculateHandOpenness(landmarks);
    assert.ok(result > 1.0 && result < 2.5);
});

test('calculateHandOpenness should clamp tension between 0.1 and 2.5', () => {
    // Very closed hand
    const closedLandmarks = new Array(21).fill({x: 0, y: 0});
    // avgDist will be 0
    // tension = (0 - 0.1) * 2.0 + 0.5 = -0.2 + 0.5 = 0.3
    assert.strictEqual(calculateHandOpenness(closedLandmarks), 0.3);

    // Extremely open hand
    const superOpenLandmarks = new Array(21).fill({x: 0, y: 0});
    superOpenLandmarks[8] = { x: 5, y: 5 };
    superOpenLandmarks[12] = { x: 5, y: 5 };
    superOpenLandmarks[16] = { x: 5, y: 5 };
    superOpenLandmarks[20] = { x: 5, y: 5 };
    // dist = hypot(5, 5) = 7.07
    // tension = (7.07 - 0.1) * 2.0 + 0.5 = 6.97 * 2 + 0.5 = 13.94 + 0.5 = 14.44
    // clamped to 2.5
    assert.strictEqual(calculateHandOpenness(superOpenLandmarks), 2.5);
});
