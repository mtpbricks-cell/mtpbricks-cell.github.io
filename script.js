/**
 * B-and-Ai-D™ Command Center V2.0 - The "Make it Beautiful" Edition
 * This is the final, definitive front-end script.
 * It takes the raw data from the V7.3 Apps Script and correctly assembles it
 * into a clean, readable, and professionally formatted toolkit for the user.
 */
window.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Sketchfab Viewer Setup (No changes here) ---
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

    // This is the correct, working URL for your V7.3 script.
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
                // --- THIS IS THE NEW "MAKE IT BEAUTIFUL" LOGIC ---
                outputContainer.innerHTML = ''; // Clear the "loading" message

                // The server sends back a list of bricks. We join them all together.
                // We use two newline characters to create a space between paragraphs.
                const fullToolkitText = data.bricks.map(brick => brick.text).join('\n\n');

                // We create one single <pre> element to hold the whole toolkit.
                // The <pre> tag respects the line breaks and formatting from your Google Sheet.
                const toolkitElement = document.createElement('pre');
                toolkitElement.style.whiteSpace = 'pre-wrap';      // Ensures long lines wrap correctly
                toolkitElement.style.fontFamily = 'inherit';     // Uses the same font as the rest of the page
                toolkitElement.style.fontSize = '14px';          // A readable font size
                toolkitElement.textContent = fullToolkitText;    // Put the entire assembled text inside

                outputContainer.appendChild(toolkitElement);
                // --- END OF NEW LOGIC ---

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