// --- Wait for the entire webpage to load before running any script ---
window.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Sketchfab Viewer Setup ---
    const iframe = document.getElementById('api-frame');
    const modelUID = '37366957265e4918baec184625662062'; // The Car Model UID
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

    // The live, golden URL is forged into the code.
    const aodAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbzNZy03Jizd-BsXO29OwnBT7UrXyza4URqNKSjl2oQcwXjFW8fynRQ7dWPixhGoQuPZ/exec';
    
    // THE CRUCIAL UPDATE: We are now requesting the new, correct Toolkit ID.
    const targetToolkitId = 'C0.A.1';

    const quizContainer = document.getElementById('quiz-container');
    const outputContainer = document.getElementById('smart-brick-output');

    // --- Create the button with the new, correct text ---
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load: Write a Letter Before Action'; // Updated Button Text
    loadButton.className = 'load-toolkit-btn';
    quizContainer.appendChild(loadButton);

    // --- The main function that runs when the button is clicked ---
    async function handleLoadToolkitClick() {
        console.log(`Button clicked. Fetching data for: ${targetToolkitId}`);
        outputContainer.innerHTML = '<p>Loading toolkit... Please wait.</p>';
        loadButton.disabled = true;

        try {
            // Construct the request URL with the correct toolkitId
            const requestUrl = `${aodAppsScriptUrl}?toolkitId=${targetToolkitId}`;

            const response = await fetch(requestUrl);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                outputContainer.innerHTML = ''; // Clear the "loading" message

                data.bricks.forEach(brick => {
                    const brickElement = document.createElement('div');
                    brickElement.className = 'brick-content';
                    const brickTitle = document.createElement('h3');
                    brickTitle.textContent = brick.id; // Display the Module ID
                    const brickText = document.createElement('p');
                    brickText.textContent = brick.text; // The actual content

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