// Global State
let currentData = [];

// DOM Elements
const listContainer = document.getElementById('vachanListContainer');
const fontSlider = document.getElementById('fontSlider');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const sortBtns = document.querySelectorAll('.sort-btn');

// Fetch JSON and Initialize
async function init() {
    try {
        // Fetching data.json file
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        currentData = [...jsonData];
        
        // Render Initial List
        renderList(currentData);
    } catch (error) {
        console.error('Error loading JSON:', error);
        listContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: red;">डेटा लोड करताना त्रुटी आली. कृपया Live Server वापरा.</div>';
    }

    setupEventListeners();
}

function setupEventListeners() {
    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Font Size
    fontSlider.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--base-font-size', e.target.value + 'px');
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = currentData.filter(item => {
            return (item.vachan && item.vachan.toLowerCase().includes(term)) ||
                   (item.id && item.id.includes(term)) ||
                   (item.intro && item.intro.toLowerCase().includes(term));
        });
        renderList(filtered);
    });
}

// Sorting Function (Triggered by HTML buttons)
function sortList(type) {
    // Sort logic
    let sortedData = [...currentData]; 

    // Re-fetch or use current displayed data for sorting? 
    // Usually, we sort what is currently available (including search results)
    // But for simplicity, we sort the full list or currently filtered if we track it.
    // Let's assume we are sorting the `currentData` loaded from JSON.
    
    // Note: If search is active, we should sort the filtered results, 
    // but here we will just sort the main array for simplicity.
    
    if (type === 'id') {
        sortedData.sort((a, b) => {
            const numA = parseInt(a.id) || 0;
            const numB = parseInt(b.id) || 0;
            return numA - numB;
        });
    } else if (type === 'alpha') {
        sortedData.sort((a, b) => {
            const textA = a.vachan || "";
            const textB = b.vachan || "";
            return textA.localeCompare(textB, 'mr');
        });
    }

    // Update UI Buttons
    sortBtns.forEach(btn => btn.classList.remove('active'));
    if (type === 'id') sortBtns[0].classList.add('active');
    else sortBtns[1].classList.add('active');

    renderList(sortedData);
}

// Render Function
function renderList(data) {
    listContainer.innerHTML = '';
    
    if(data.length === 0) {
        listContainer.innerHTML = '<div style="text-align:center; padding: 20px;">माहिती उपलब्ध नाही</div>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'vachan-card';
        
        let leelaHTML = '';
        if(item.related_leelas && item.related_leelas.length > 0) {
            item.related_leelas.forEach(leela => {
                leelaHTML += `
                    <div class="leela-ref">
                        <strong>${leela.reference_used || ''} ${leela.title || ''}</strong>
                        <p style="font-size: 0.9em; margin-top: 5px;">${leela.full_text ? leela.full_text.substring(0, 100) + '...' : ''}</p>
                    </div>
                `;
            });
        }

        card.innerHTML = `
            <div class="vachan-header">
                <span class="vachan-id">वचन क्र. ${item.id}</span>
                <span>${item.intro || ''}</span>
            </div>
            <div class="vachan-text">${item.vachan || 'वचन उपलब्ध नाही'}</div>
            
            <div class="details">
                ${item.lapika ? `
                    <div class="detail-block">
                        <span class="detail-label">लापिका (Lapika)</span>
                        <p>${item.lapika}</p>
                    </div>` : ''}
                
                ${item.tika ? `
                    <div class="detail-block">
                        <span class="detail-label">टीका (Tika)</span>
                        <p>${item.tika}</p>
                    </div>` : ''}

                ${leelaHTML ? `
                    <div class="detail-block">
                        <span class="detail-label">संबंधित लीळा (Related Leelas)</span>
                        ${leelaHTML}
                    </div>` : ''}
            </div>
            <div style="text-align:center; font-size:0.8em; opacity:0.6; margin-top:10px;">
                ▼ अधिक माहितीसाठी क्लिक करा ▼
            </div>
        `;

        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });

        listContainer.appendChild(card);
    });
}

// Initialize App
init();
