const test = require('node:test');
const assert = require('node:assert');
const { generateMailtoLink } = require('../script.js');

test('generateMailtoLink should return a correctly formatted mailto link', () => {
    const serviceName = 'Test Service';
    const expected = 'mailto:artuetr5d@gmail.com?subject=Consulta%20sobre%3A%20Test%20Service&body=Hola%2C%20estoy%20interesado%20en%20el%20servicio%3A%20Test%20Service';
    const result = generateMailtoLink(serviceName);
    assert.strictEqual(result, expected);
});

test('generateMailtoLink should handle special characters in service name', () => {
    const serviceName = 'Service & More!';
    const expected = 'mailto:artuetr5d@gmail.com?subject=Consulta%20sobre%3A%20Service%20%26%20More!&body=Hola%2C%20estoy%20interesado%20en%20el%20servicio%3A%20Service%20%26%20More!';
    const result = generateMailtoLink(serviceName);
    assert.strictEqual(result, expected);
});

test('generateMailtoLink should handle empty service name', () => {
    const serviceName = '';
    const expected = 'mailto:artuetr5d@gmail.com?subject=Consulta%20sobre%3A%20&body=Hola%2C%20estoy%20interesado%20en%20el%20servicio%3A%20';
    const result = generateMailtoLink(serviceName);
    assert.strictEqual(result, expected);
});
