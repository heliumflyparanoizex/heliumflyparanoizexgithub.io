const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const search = `
                <div class="codex-tabs">
                    <button class="codex-tab active" data-doc="assets/docs/Codice_Sintergico.pdf" data-es="Manifiesto" data-en="Manifesto">Manifiesto</button>
                    <button class="codex-tab" data-doc="assets/docs/Propuesta_LCOS.pdf" data-es="LCOS OS" data-en="LCOS OS">LCOS OS</button>
                    <button class="codex-tab" data-doc="assets/docs/Informe_TCC.pdf" data-es="Informe TCC" data-en="TCC Report">Informe TCC</button>
                    <button class="codex-tab" data-doc="assets/docs/EIDOLON_Anatomy_of_Awakening.pdf" data-es="EIDOLON" data-en="EIDOLON">EIDOLON</button>
                </div>
`;

const replace = `
                <div class="codex-tabs" role="tablist" aria-label="Documentos del Códice">
                    <button class="codex-tab active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" role="tab" aria-selected="true" aria-controls="pdf-viewport" id="tab-manifiesto" data-doc="assets/docs/Codice_Sintergico.pdf" data-es="Manifiesto" data-en="Manifesto">Manifiesto</button>
                    <button class="codex-tab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" role="tab" aria-selected="false" aria-controls="pdf-viewport" id="tab-lcos" data-doc="assets/docs/Propuesta_LCOS.pdf" data-es="LCOS OS" data-en="LCOS OS">LCOS OS</button>
                    <button class="codex-tab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" role="tab" aria-selected="false" aria-controls="pdf-viewport" id="tab-tcc" data-doc="assets/docs/Informe_TCC.pdf" data-es="Informe TCC" data-en="TCC Report">Informe TCC</button>
                    <button class="codex-tab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" role="tab" aria-selected="false" aria-controls="pdf-viewport" id="tab-eidolon" data-doc="assets/docs/EIDOLON_Anatomy_of_Awakening.pdf" data-es="EIDOLON" data-en="EIDOLON">EIDOLON</button>
                </div>
`;

content = content.replace(search, replace);

const search2 = `<div class="codex-viewport">`;
const replace2 = `<div class="codex-viewport" id="pdf-viewport" role="tabpanel" aria-labelledby="tab-manifiesto" tabindex="0">`;
content = content.replace(search2, replace2);

fs.writeFileSync('index.html', content, 'utf8');
