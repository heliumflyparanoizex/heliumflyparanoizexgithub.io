const test = require('node:test');
const assert = require('node:assert');

// Mock Node and document globals before requiring script.js to satisfy top-level if needed
// though updateStaticEmailLinks is where they are primarily used.
global.Node = {
    TEXT_NODE: 3
};

class MockNode {
    constructor(type, textContent) {
        this.nodeType = type;
        this.textContent = textContent;
    }
}

class MockElement {
    constructor(attributes = {}, textContent = '', childNodes = []) {
        this.attributes = attributes;
        this.textContent = textContent;
        this.childNodes = childNodes;
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    // Simplified trim for textContent as used in script.js
    get textContentTrimmed() {
        return this.textContent.trim();
    }
}

// Minimal document mock
global.document = {
    querySelectorAll: () => []
};

// Now import the function and constant
const { updateStaticEmailLinks, CONTACT_EMAIL } = require('../script.js');

test('updateStaticEmailLinks updates href and text node when email differs', () => {
    const oldEmail = 'old@example.com';
    const textNode = new MockNode(global.Node.TEXT_NODE, ` ${oldEmail} `);
    const link = new MockElement(
        { href: `mailto:${oldEmail}` },
        ` ${oldEmail} `,
        [textNode]
    );

    // Override querySelectorAll for this test
    const originalQuerySelectorAll = global.document.querySelectorAll;
    global.document.querySelectorAll = (query) => {
        if (query === 'a[href^="mailto:"]') return [link];
        return [];
    };

    updateStaticEmailLinks();

    assert.strictEqual(link.getAttribute('href'), `mailto:${CONTACT_EMAIL}`, 'href should be updated');
    assert.strictEqual(textNode.textContent, ` ${CONTACT_EMAIL} `, 'text node should be updated');

    global.document.querySelectorAll = originalQuerySelectorAll;
});

test('updateStaticEmailLinks preserves other child nodes like icons', () => {
    const oldEmail = 'old@example.com';
    const iconNode = new MockNode(1, ''); // ELEMENT_NODE
    const textNode = new MockNode(global.Node.TEXT_NODE, oldEmail);
    const link = new MockElement(
        { href: `mailto:${oldEmail}` },
        oldEmail,
        [iconNode, textNode]
    );

    const originalQuerySelectorAll = global.document.querySelectorAll;
    global.document.querySelectorAll = (query) => {
        if (query === 'a[href^="mailto:"]') return [link];
        return [];
    };

    updateStaticEmailLinks();

    assert.strictEqual(link.getAttribute('href'), `mailto:${CONTACT_EMAIL}`);
    assert.strictEqual(textNode.textContent, CONTACT_EMAIL);
    // iconNode should remain untouched (or at least still be there)
    assert.strictEqual(link.childNodes[0], iconNode);

    global.document.querySelectorAll = originalQuerySelectorAll;
});

test('updateStaticEmailLinks handles mailto links with subjects/bodies', () => {
    const oldEmail = 'old@example.com';
    const link = new MockElement(
        { href: `mailto:${oldEmail}?subject=test` },
        'Contact Us',
        []
    );

    const originalQuerySelectorAll = global.document.querySelectorAll;
    global.document.querySelectorAll = (query) => {
        if (query === 'a[href^="mailto:"]') return [link];
        return [];
    };

    updateStaticEmailLinks();

    assert.strictEqual(link.getAttribute('href'), `mailto:${CONTACT_EMAIL}?subject=test`);
    // textContent shouldn't change because it doesn't match the old email
    assert.strictEqual(link.textContent, 'Contact Us');

    global.document.querySelectorAll = originalQuerySelectorAll;
});

test('updateStaticEmailLinks does nothing if email already matches', () => {
    const link = new MockElement(
        { href: `mailto:${CONTACT_EMAIL}` },
        CONTACT_EMAIL,
        [new MockNode(global.Node.TEXT_NODE, CONTACT_EMAIL)]
    );

    let setAttributeCalled = false;
    link.setAttribute = () => { setAttributeCalled = true; };

    const originalQuerySelectorAll = global.document.querySelectorAll;
    global.document.querySelectorAll = (query) => {
        if (query === 'a[href^="mailto:"]') return [link];
        return [];
    };

    updateStaticEmailLinks();

    assert.strictEqual(setAttributeCalled, false, 'setAttribute should not be called if email matches');

    global.document.querySelectorAll = originalQuerySelectorAll;
});
