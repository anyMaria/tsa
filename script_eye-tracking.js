document.addEventListener('DOMContentLoaded', () => {
    let currentFace = 'face1';
    let currentZone = null;
    let currentParam = null;
    let myChart = null;

    const faceMap = { 'face1': 'V1', 'face2': 'V2', 'face3': 'V3', 'face4': 'V4' };
    const zoneMap = { 'ecran': 'E', 'visage': 'V', 'yeux': 'Y', 'bouche': 'B' };
    const paramMap = { 
        'temps-total': 'TTT', 
        'temps-passe': 'TP', 
        'latence': 'LAT', 
        'temps-fixation': 'TF', 
        'nombre-fixations': 'NBF', 
        'nombre-entrees': 'NBEZ' 
    };

    const chartPlaceholder = document.getElementById('chart-placeholder-text');
    const mainContent = document.getElementById('mainContent');
    const descriptionContainer = document.getElementById('dynamic-description');
    
    // --- DICTIONARY FOR TEXT ---
    const chartDescriptions = {
        // --- FACE 1 ---
        // Ecran
        'V1_E_TF': "Les enfants atteints de TSA fixent plus l'écran : 71% pour les enfants tout venant et 82% pour les personnes atteintes de TSA. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de 76%.",
         // Visage
        'V1_V_TF': "Les enfants atteints de TSA fixent plus la tête : 70% pour les enfants tout venant et 82% pour les personnes atteintes de TSA. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de 76%.",
        // Yeux
        'V1_Y_TF': "Les enfants atteints de TSA fixent plus les yeux : 20% pour les enfants tout venant et 32% pour les personnes atteintes de TSA. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de 26%.",
        'V1_Y_NBEZ': "Les enfants atteints de TSA revisitent moins les yeux : au moins 1 fois toutes les deux secondes pour les enfants atteints de TSA et au moins 1 fois toutes les secondes pour les enfants tout-venant. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de 1 fois par seconde.",
        'V1_Y_LAT': "Les enfants atteints de TSA mettent moins de temps pour regarder la première fois les yeux : 1,01 s pour les personnes atteintes de TSA et 1,7s pour les tout-venant. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de 1,3 secondes.",
        // Bouche
        'V1_B_LAT': "Les enfants atteints de TSA mettent plus de temps pour regarder la première fois la bouche : 3,58 s pour les personnes atteintes de TSA et 2,94s pour les tout-venant.On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de 3,26 secondes.",
        'V1_B_NBEZ': "Les enfants atteints de TSA revisitent moins la bouche : au moins 1 fois toutes les 4 secondes pour les enfants atteints de TSA et au moins 1 fois toutes les deux secondes pour les enfants tout-venant. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de 1 fois toutes les 3 secondes.",

        // --- FACE 2 ---
        // Ecran
        'V2_E_TF': "Les enfants atteints de TSA fixent plus l'écran : 71% pour les enfants tout venant et 82% pour les personnes atteintes de TSA.  On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de  84%.",
         // Visage
        'V2_V_TF': "les enfants atteints de TSA fixent plus la tête : 78% pour les enfants tout venant et 89% pour les personnes atteintes de TSA. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil de 76%.",
        // Yeux
        'V2_Y_NBEZ': "Les enfants atteints de TSA revisitent moins les yeux : au moins 1 fois toutes les 3 secondes pour les enfants atteints de TSA et au moins 1 fois toutes les secondes pour les enfants tout-venant. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil à 1 fois toutes les 2 secondes.",
        'V2_Y_LAT': "Les enfants atteints de TSA mettent moins de temps pour regarder la première fois les yeux : 1,01 s pour les personnes atteintes de TSA et 1,7s pour les tout-venant. On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil à 1 fois toutes les 2 secondes.",
        // Bouche
        'V2_B_TF': " Les enfants atteints de TSA refixent moins la bouche : au moins 1 fois toutes les 8 secondes pour les enfants atteints de TSA et au moins 1 fois toutes les 3 secondes pour les enfants tout-venant.  On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil à 1 fois toutes les 5 secondes.",
        'V2_B_NBEZ': "Les enfants atteints de TSA revisitent moins la bouche : au moins 1 fois toutes les 3 secondes pour les enfants atteints de TSA et au moins 1 fois toutes les 2 secondes pour les enfants tout-venant. . On pourrait utiliser ce paramètre pour prédire si un sujet présenterait des troubles du spectre autistique, en mettant un seuil  1 fois toutes les secondes",
    };
    
    // Layout Columns
    const leftCol = document.getElementById('leftCol');
    const rightCol = document.getElementById('rightCol');
    
    // Content Elements
    const resultImage = document.getElementById('resultImage');
    const canvasElement = document.getElementById('dynamicChart');
    const ctx = canvasElement.getContext('2d');
    
    const carouselElement = document.getElementById('faceCarousel');
    const HIGHLIGHT_COLOR = 'rgba(242, 41, 94, 0.6)';

    // --- 4. PLUGINS ---
    const errorBarPlugin = {
        id: 'errorBarPlugin',
        afterDatasetsDraw: (chart) => {
            // CHANGE: Updated to allow 'line' charts as well as 'bar'
            if (chart.config.type !== 'bar' && chart.config.type !== 'line') return;
            
            const { ctx, data } = chart;
            chart.getDatasetMeta(0).data.forEach((point, index) => {
                const stdDev = data.datasets[0].errorBars?.[index];
                if (!stdDev) return;

                const value = data.datasets[0].data[index];
                const yScale = chart.scales.y;
                
                // For line/bar charts, the x-coordinate is point.x
                const x = point.x;
                const yTop = yScale.getPixelForValue(value + stdDev);
                const yBottom = yScale.getPixelForValue(value - stdDev);

                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.moveTo(x, yTop);
                ctx.lineTo(x, yBottom);
                // Caps
                ctx.moveTo(x - 8, yTop);
                ctx.lineTo(x + 8, yTop);
                ctx.moveTo(x - 8, yBottom);
                ctx.lineTo(x + 8, yBottom);
                ctx.stroke();
                ctx.restore();
            });
        }
    };

    // --- 5. FUNCTIONS ---

    function couleur(elements, color) {
        elements.forEach(el => {
            el.style.fill = color;
            el.querySelectorAll('*').forEach(e => e.style.fill = color);
        });
    }

    function activateZone(zoneName) {
        // 1. Reset all zones first (remove color)
        const allZones = document.querySelectorAll('[data-zone]');
        couleur(allZones, '');
        
        // 2. Remove 'active' class from all zone buttons
        document.querySelectorAll('.zone-btn').forEach(btn => btn.classList.remove('active-zone'));

        if (zoneName) {
            // 3. Highlight specific zone in the SVG
            const targetZones = document.querySelectorAll(`[data-zone="${zoneName}"]`);
            couleur(targetZones, HIGHLIGHT_COLOR);

            // 4. Highlight the matching button
            const targetBtn = document.querySelector(`.zone-btn[data-zone="${zoneName}"]`);
            if (targetBtn) targetBtn.classList.add('active-zone');
            
            // 5. Update our Memory
            currentZone = zoneName;
        } else {
            // If zoneName is null (reset), clear memory
            currentZone = null;
        }

        // 6. Try to update the chart diagram
        updateChart();
    }

    // --- CHART RENDERERS ---

    // A. LINE CHART (Was Bar Chart)
    function renderBarChart() {
        // Destroy previous chart (whether it was bar or radar)
        if (myChart) myChart.destroy();
        
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['DT', 'TSA'],
                datasets: [{
                    label: 'Moyenne TTT (ms)',
                    data: [3.984035714, 3.950823529],
                    errorBars: [0.15554194, 0.243695311], 
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Fill color (optional)
                    borderColor: 'rgba(54, 162, 235, 1)',       // Line color
                    pointBackgroundColor: ['#F4B608', '#4E5EE4'], // Point colors based on group
                    pointBorderColor: ['#021059', '#021059'],
                    pointRadius: 6,
                    borderWidth: 2,
                    tension: 0.1 // Slight curve
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Line Chart'
                    }
                },
                scales: { y: { min: 3.5, max: 4.5 } }
            },
            plugins: [errorBarPlugin] 
        });
    }

    // B. RADAR CHART
    function renderRadarChart() {
        if (myChart) myChart.destroy();

        // Data from your table
        const dtData = [3.984, 3.922, 3.934, 3.989, null, 0.957];
        const tsaData = [3.950, 3.975, 3.962, 3.849, null, 0.977];

        myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Temps Total', 'Temps Passé', 'Latence', 'Temps Fixation', 'Nb Fixations', 'Nb Entrées'],
                datasets: [
                    {
                        label: 'DT',
                        data: dtData,
                        fill: true,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: '#F4B608',
                        pointBackgroundColor: '#F4B608'
                    },
                    {
                        label: 'TSA',
                        data: tsaData,
                        fill: true,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: '#4E5EE4',
                        pointBackgroundColor: '#4E5EE4'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Profil Global (TP)' }
                },
                scales: {
                    r: { suggestedMin: 0, suggestedMax: 4.5 }
                }
            }
        });
    }

    // --- MAIN UPDATE FUNCTION ---
    function updateChart() {
        // Reset Views
        chartPlaceholder.style.setProperty('display', 'flex', 'important'); 
        chartPlaceholder.querySelector('p').innerText = "Sélectionnez une Zone et un Paramètre pour voir les résultats";
        mainContent.style.display = 'none';       
        if (descriptionContainer) descriptionContainer.style.display = 'none'; // Reset description

        // Reset Columns to default (Full Width Image)
        leftCol.className = 'col-12 d-flex align-items-center justify-content-center';
        rightCol.style.display = 'none';

        if (currentFace && currentZone && currentParam) {
            
            // Constraint: Latence & Nb Entrées not available for Ecran
            if (currentZone === 'ecran' && (currentParam === 'latence' || currentParam === 'nombre-entrees')) {
                chartPlaceholder.querySelector('p').innerText = "Données non disponibles pour ce paramètre sur la zone Écran.";
                return;
            }

            // Constraint: TTT only available for Ecran
            if (currentParam === 'temps-total' && currentZone !== 'ecran') {
                chartPlaceholder.querySelector('p').innerText = "Le Temps Total Tracké est uniquement disponible pour la zone Écran.";
                return;
            }

            // Hide Placeholder, Show Content
            chartPlaceholder.style.setProperty('display', 'none', 'important');
            mainContent.style.display = 'block';

            // 1. Load Image
            const faceCode = faceMap[currentFace];
            const zoneCode = zoneMap[currentZone];
            const paramCode = paramMap[currentParam];
            const fileName = `${faceCode}_${zoneCode}_${paramCode}.png`;
            resultImage.src = `images/charts/${fileName}`;

            // 2. Load Description
            const key = `${faceCode}_${zoneCode}_${paramCode}`;
            const descText = chartDescriptions[key];
            if (descText && descriptionContainer) {
                descriptionContainer.querySelector('p').innerText = descText;
                descriptionContainer.style.display = 'block';
            }

            // 3. Check Conditions for Charts (Face 1 + Ecran)
            if (currentFace === 'face1' && currentZone === 'ecran') {
                
                // Condition A: TTT -> Bar Chart
                if (currentParam === 'temps-total') {
                    // Switch to 50/50 Layout
                    leftCol.className = 'col-6 d-flex align-items-center justify-content-center';
                    rightCol.style.display = 'block';
                    renderBarChart();
                }
                // Condition B: TP -> Radar Chart
                else if (currentParam === 'temps-passe') {
                    // Switch to 50/50 Layout
                    leftCol.className = 'col-6 d-flex align-items-center justify-content-center';
                    rightCol.style.display = 'block';
                    renderRadarChart();
                }
                else {
                     // Default: Just Image (col-12) - handled by reset above
                     if (myChart) myChart.destroy();
                }

            } else {
                // Not Face 1 + Ecran -> Just Image
                if (myChart) myChart.destroy();
            }
        }
    }

    // --- 6. EVENT LISTENERS ---

    // A. Handle Zone Button Clicks
    document.querySelectorAll('.zone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activateZone(btn.dataset.zone); // Pass 'ecran', 'visage', etc.
        });
    });

    // B. Handle Parameter Button Clicks
    document.querySelectorAll('.param-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Visual Toggle
            document.querySelectorAll('.param-btn').forEach(b => b.classList.remove('active-param'));
            btn.classList.add('active-param');

            // 2. Update Memory
            currentParam = btn.dataset.param; // Reads 'temps-total', 'latence', etc.

            // 3. Update Chart
            updateChart();
        });
    });

    // C. Handle Carousel Slide (Change Face)
    if (carouselElement) {
        carouselElement.addEventListener('slid.bs.carousel', function (event) {
            // Bootstrap gives us 'event.relatedTarget' which is the active slide (e.g., <div id="slide-face2">)
            const activeSlideId = event.relatedTarget.id; 
            
            // Extract "face1", "face2" from "slide-face1"
            // We split the string by '-' and take the second part
            currentFace = activeSlideId.split('-')[1]; 

            // Update chart because the face changed
            updateChart();
            
            // Optional: If you want to RESET the zone selection when changing faces:
            // activateZone(null); 
        });
    }

    // D. Handle Direct SVG Clicks (Touching the face directly)
    const carouselContainer = document.querySelector('#faceCarousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('click', (e) => {
            const zoneElement = e.target.closest('[data-zone]');
            if (zoneElement) {
                e.stopPropagation();
                activateZone(zoneElement.dataset.zone);
            }
        });
    }

    // E. Handle Scroll Button
    const discoverBtn = document.getElementById('discoverBtn');
    if (discoverBtn) {
        discoverBtn.addEventListener('click', () => {
            document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Back to top 
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show after 300px (past hero)
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});