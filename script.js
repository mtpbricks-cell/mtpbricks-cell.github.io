// --- Wait for the entire webpage to load before running any script ---
window.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Sketchfab Viewer Setup ---
    const iframe = document.getElementById('api-frame');
    const modelUID = '37366957265e4918baec184625662062';
    const client = new Sketchfab('1.12.1', iframe);
    let sketchfabApi; 

    client.init(modelUID, {
        success: (api) => {
            sketchfabApi = api;
            api.start();
            api.addEventListener('viewerready', () => console.log('Sketchfab Viewer is ready.'));
        },
        error: () => console.error('Sketchfab API failed to initialize')
    });

    // --- Part 2: Dynamic Content & Google Sheets Integration ---

    // THIS IS THE NEW, FINAL, CORRECT URL YOU JUST DEPLOYED
    const aodAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxbaAPZ5yyGXyogUhn8OuIejDZFz-bNnQ0oqMsy4ukGXt6FffWYzpKcqXwAMLYRyKWp/exec';

    // This is the correct ID from your MASTER_ASSEMBLY_MAP sheet.
    const targetToolkitId = 'BP-C5.1';

    const quizContainer = document.getElementById('quiz-container');
    const outputContainer = document.getElementById('smart-brick-output');

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load The Will Challenge Blueprint';
    loadButton.className = 'load-toolkit-btn';
    quizContainer.appendChild(loadButton);

    async function handleLoadToolkitClick() {
        outputContainer.innerHTML = '<p>Loading toolkit... Please wait.</p>';
        loadButton.disabled = true;

        try {
            const requestUrl = `${aodAppsScriptUrl}?toolkitId=${targetToolkitId}`;
            const response = await fetch(requestUrl);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.status === 'success') {
                outputContainer.innerHTML = ''; 
                data.bricks.forEach(brick => {
                    const brickElement = document.createElement('div');
                    const brickTitle = document.createElement('h3');
                    brickTitle.textContent = brick.id;
                    const brickText = document.createElement('p');
                    brickText.textContent = brick.text;
                    brickElement.appendChild(brickTitle);
                    brickElement.appendChild(brickText);
                    outputContainer.appendChild(brickElement);
                });
            } else {
                throw new Error(data.message || 'The Apps Script returned an error.');
            }
        } catch (error) {
            console.error('Error fetching toolkit:', error);
            outputContainer.innerHTML = `<p style="color: red;"><strong>Error:</strong> Could not load the toolkit. Please check the console for details.</p>`;
        } finally {
            loadButton.disabled = false;
        }
    }
    loadButton.addEventListener('click', handleLoadToolkitClick);
});