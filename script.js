let debounceTimer;
let fuse = null;
let fullData = [];

const API_URL = 'https://botai.smartdataautomation.com/api_backend_ai/dinamic-db/report/119/JyJ_PDVs';
const AUTH_HEADERS = {
    'Authorization': 'Token 4e15396f99ae10dd5c195d81fb6a3722c0a44a10',
    'Content-Type': 'application/json'
};

// Cargar los datos de la API
async function loadData() {
    try {
        const response = await fetch(API_URL, { headers: AUTH_HEADERS });
        const data = await response.json();
        fullData = data.result || [];

        initializeFuse();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

// Inicializar Fuse.js para búsqueda rápida
function initializeFuse() {
    const options = {
        keys: ['SAP','REGION','CIUDAD','CANAL','PDV'],
        threshold: 0.3,
    };
    fuse = new Fuse(fullData, options);
}

// Manejo de la entrada de búsqueda con debounce
function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            performSearch(query);
        } else {
            document.getElementById('results').innerHTML = '';
        }
    }, 300);
}

// Realizar búsqueda con Fuse.js
function performSearch(query) {
    const results = fuse.search(query).map(result => result.item);
    renderResults(results);
}

// Renderizar los resultados en HTML con animaciones
function renderResults(results) {
    let output = `<h2>Resultados (${results.length} encontrados):</h2>`;

    if (results.length > 0) {
        results.forEach(result => {
            output += `
                <div class="result-item">
                    <h3>${result.NOMBRE}</h3>
                    <ul>
                        <li>
                            <strong>SAP:</strong> ${result.SAP} 
                            <i class="material-icons copy-icon" onclick="copyToClipboard('${result.SAP}')">content_copy</i>
                        </li>
                        <li><strong>Región:</strong> ${result.REGION || 'N/A'}</li>
                        <li><strong>Ciudad:</strong> ${result.CIUDAD || 'N/A'}</li>
                        <li><strong>Canal:</strong> ${result.CANAL || 'N/A'}</li>
                        <li><strong>PDV:</strong> ${result.PDV || 'N/A'}</li>
                    </ul>
                </div>
            `;
        });
    } else {
        output += '<p>No se encontraron resultados.</p>';
    }

    document.getElementById('results').innerHTML = output;
}

// Copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('Documento copiado al portapapeles'))
        .catch(err => console.error('Error:', err));
}

// Modo Oscuro
document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// Cargar datos al inicio
loadData();
