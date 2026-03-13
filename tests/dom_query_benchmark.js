
const ITERATIONS = 1000000;
const NUM_BUTTONS = 10;

// Mocking the DOM environment
const mockButtons = Array.from({ length: NUM_BUTTONS }, (_, i) => ({
    classList: {
        remove: () => {},
        add: () => {}
    },
    dataset: {
        shape: 'fireworks',
        palette: 'lvu'
    }
}));

const documentMock = {
    querySelectorAll: (selector) => {
        // In a real browser, this would involve DOM traversal
        // We simulate it by returning our mock array
        return mockButtons;
    }
};

function benchmarkRedundant() {
    console.time('Redundant Query');
    for (let i = 0; i < ITERATIONS; i++) {
        // Simulating the click handler logic: document.querySelectorAll('.template-btn').forEach(...)
        const btns = documentMock.querySelectorAll('.template-btn');
        btns.forEach(b => {
            b.classList.remove('bg-white/10', 'border-white/20');
        });
    }
    console.timeEnd('Redundant Query');
}

function benchmarkCached() {
    console.time('Cached Query');
    const cachedBtns = documentMock.querySelectorAll('.template-btn');
    for (let i = 0; i < ITERATIONS; i++) {
        // Optimized logic using the cached NodeList
        cachedBtns.forEach(b => {
            b.classList.remove('bg-white/10', 'border-white/20');
        });
    }
    console.timeEnd('Cached Query');
}

console.log(`Running benchmark with ${ITERATIONS} iterations and ${NUM_BUTTONS} buttons...`);
benchmarkRedundant();
benchmarkCached();
