window.addEventListener('DOMContentLoaded', () => {
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

    const aodAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbzNZy03Jizd-BsXO29OwnBT7UrXyza4URqNKSjl2oQcwXjFW8fynRQ7dWPixhGoQuPZ/exec';
    
    // THE FINAL, CORRECTED LINE: We are now asking for the correct ID from the LAUNCH_PRODUCT_VAULT
    const targetToolkitId = 'C5.B.1';

    const quizContainer = document.getElementById('quiz-container');
    const outputContainer = document.getElementById('smart-brick-output');

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load The Will Challenge Blueprint';
    loadButton.className = 'load-toolkit-btn';
    quizContainer.appendChild(loadButton);

    async function handleLoadToolkitClick() {
        console.log(`Button clicked. Fetching data for: ${targetToolkitId}`);
        outputContainer.innerHTML = '<p>Loading toolkit... Please wait.</p>';
        loadButton.disabled = true;

        try {
            const requestUrl = `${aodAppsScriptUrl}?toolkitId=${targetToolkitId}`;
            const response = await fetch(requestUrl);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            
            const data = await response.json();

            if (data.status === 'success') {
                outputContainer.innerHTML = ''; 

                const finishedToolkit = data.bricks[0]; 
                
                const toolkitText = document.createElement('pre');
                toolkitText.style.whiteSpace = 'pre-wrap';
                toolkitText.style.fontFamily = 'inherit';
                toolkitText.textContent = finishedToolkit.text;
                
                outputContainer.appendChild(toolkitText);

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