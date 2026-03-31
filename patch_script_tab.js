const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

const search = `
        pdfTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all
                pdfTabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked
                tab.classList.add('active');

                // Load PDF
                const url = tab.getAttribute('data-doc');
                loadPDF(url);
            });
        });
`;

const replace = `
        const pdfViewport = document.getElementById('pdf-viewport');

        pdfTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all
                pdfTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                // Add active to clicked
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                if (pdfViewport) {
                    pdfViewport.setAttribute('aria-labelledby', tab.id);
                }

                // Load PDF
                const url = tab.getAttribute('data-doc');
                loadPDF(url);
            });

            // Add keyboard navigation for tabs
            tab.addEventListener('keydown', (e) => {
                const tabsArray = Array.from(pdfTabs);
                const index = tabsArray.indexOf(tab);
                let nextIndex;

                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    nextIndex = (index + 1) % tabsArray.length;
                    tabsArray[nextIndex].focus();
                    tabsArray[nextIndex].click();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    nextIndex = (index - 1 + tabsArray.length) % tabsArray.length;
                    tabsArray[nextIndex].focus();
                    tabsArray[nextIndex].click();
                }
            });
        });
`;

content = content.replace(search, replace);
fs.writeFileSync('script.js', content, 'utf8');
