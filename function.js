// --- DOM Elements ---
const genderSelect = document.getElementById('gender');
const countrySelect = document.getElementById('country');
const regionSelect = document.getElementById('region');
const regionContainer = document.getElementById('region-container');
const generateBtn = document.getElementById('generate-btn');
const resultContainer = document.getElementById('result-container');
const loader = document.getElementById('loader');
const dataOutput = document.getElementById('data-output');
const toast = document.getElementById('toast');

// --- Data for Indonesian Provinces ---
const indonesianProvinces = [
    "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Kepulauan Riau", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat", "Maluku", "Maluku Utara", "Papua Barat", "Papua"
];

// --- Functions ---

/**
 * Populates the region dropdown based on the selected country.
 * Currently only supports Indonesia.
 */
function populateRegions() {
    const selectedCountry = countrySelect.value;
    if (selectedCountry === 'Indonesia') {
        regionContainer.style.display = 'block';
        regionSelect.innerHTML = indonesianProvinces.map(province => `<option value="${province}">${province}</option>`).join('');
    } else {
        regionContainer.style.display = 'none';
        regionSelect.innerHTML = '';
    }
}

/**
 * Generates a random 16-digit Indonesian NIK.
 * @param {string} gender - The gender ('Pria' or 'Wanita').
 * @returns {string} A 16-digit NIK string.
 */
function generateNIK(gender) {
    const provinceCode = Math.floor(11 + Math.random() * 80).toString().padStart(2, '0');
    const cityCode = Math.floor(1 + Math.random() * 70).toString().padStart(2, '0');
    const districtCode = Math.floor(1 + Math.random() * 70).toString().padStart(2, '0');
    
    const year = Math.floor(1970 + Math.random() * 35);
    const month = Math.floor(1 + Math.random() * 12);
    let day = Math.floor(1 + Math.random() * 28);

    if (gender === 'Wanita') {
        day += 40;
    }

    const birthDateCode = `${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year.toString().slice(-2)}`;
    const serial = Math.floor(1000 + Math.random() * 9000).toString();

    return `${provinceCode}${cityCode}${districtCode}${birthDateCode}${serial}`;
}

/**
 * Copies text to the clipboard and shows a toast notification.
 * @param {string} text - The text to copy.
 */
function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast();
    } catch (err) {
        console.error('Gagal menyalin teks: ', err);
    }
    document.body.removeChild(textArea);
}

/**
 * Shows a toast notification for a few seconds.
 */
function showToast() {
    toast.classList.remove('opacity-0');
    setTimeout(() => {
        toast.classList.add('opacity-0');
    }, 2000);
}

/**
 * Displays the generated data in a formatted way.
 * @param {string} aiResponse - The raw text response from the AI.
 */
function displayData(aiResponse) {
    dataOutput.innerHTML = ''; // Clear previous results
    const lines = aiResponse.split('\n').filter(line => line.trim() !== '');
    
    if (countrySelect.value === 'Indonesia') {
        const nik = generateNIK(genderSelect.value);
        const nikHtml = createDataRowHTML('NIK', nik);
        dataOutput.insertAdjacentHTML('beforeend', nikHtml);
    }

    lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            const rowHtml = createDataRowHTML(key, value);
            dataOutput.insertAdjacentHTML('beforeend', rowHtml);
        }
    });
    
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const textToCopy = e.target.closest('.data-row').querySelector('.data-value').textContent;
            copyToClipboard(textToCopy);
        });
    });
}

/**
 * Creates the HTML for a single row of data with a copy button.
 * @param {string} key - The data label (e.g., "Nama Lengkap").
 * @param {string} value - The data value.
 * @returns {string} The HTML string for the row.
 */
function createDataRowHTML(key, value) {
    return `
        <div class="data-row flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
            <span class="font-semibold text-gray-300">${key}</span>
            <div class="flex items-center gap-3">
                <span class="data-value text-right text-indigo-300">${value}</span>
                <button class="copy-btn p-1.5 rounded-md hover:bg-gray-700 transition-colors" title="Salin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard pointer-events-none" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

/**
 * Main function to handle data generation process.
 */
async function handleGenerate() {
    resultContainer.style.display = 'block';
    loader.style.display = 'block';
    dataOutput.innerHTML = '';
    generateBtn.disabled = true;
    generateBtn.textContent = 'Membuat...';

    const gender = genderSelect.value;
    const country = countrySelect.value;
    const region = regionSelect.value || '';

    const prompt = `Tolong buatkan data pribadi fiktif yang realistis untuk seseorang dengan detail berikut:
- Gender: ${gender}
- Asal: ${region ? region + ', ' : ''}${country}

Hasilkan data berikut dalam format "Kunci: Nilai" (setiap data di baris baru), dan jangan sertakan NIK atau nomor identitas lainnya:
- Nama Lengkap
- Tempat Lahir
- Tanggal Lahir (format DD-MM-YYYY)
- Alamat Lengkap (termasuk nama jalan, kota, dan kode pos yang sesuai dengan daerahnya)
- Agama
- Status Perkawinan
- Pekerjaan
- Kewarganegaraan

Pastikan data yang dihasilkan konsisten dan masuk akal untuk wilayah yang ditentukan.
`;

    try {
        // Call the function from the separate AI file
        const aiResponseText = await fetchAiData(prompt);
        displayData(aiResponseText);
    } catch (error) {
        // The error is already logged in fetchAiData, so we just update the UI.
        dataOutput.innerHTML = `<p class="text-red-400 text-center">Terjadi kesalahan saat mengambil data dari AI. Silakan coba lagi.</p>`;
    } finally {
        loader.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Data';
    }
}

// --- Event Listeners & Initial Setup ---
countrySelect.addEventListener('change', populateRegions);
generateBtn.addEventListener('click', handleGenerate);

window.onload = () => {
    populateRegions();
};
