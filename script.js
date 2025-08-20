window.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('api-frame');
    const modelUID = '37366957265e4918baec184625662062';
    const client = new Sketchfab('1.12.1', iframe);
    let sketchfabApi;

    client.init(modelUID, {
        success: (api) => { api.start(); },
        error: () => console.error('Sketchfab API failed to initialize')
    });

    // This is the new, correct, and verified URL for your "Copy of..." script.
    const aodAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbz_Gt_wfVi6uYKSraGA8A7D8tG9rXz5SWuaQORUOEYGUlDRhYDZL-ZQknmtN8-izPIE/exec';
    
    // This is the correct ID from your LAUNCH_PRODUCT_VAULT sheet.
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
            if (!response.ok) throw new Error(`Network response error. Status: ${response.status}`);
            
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
                throw new Error(data.message);
            }
        } catch (error) {
            outputContainer.innerHTML = `<p style="color: red;"><strong>Error fetching toolkit:</strong> — ${error.message}</p>`;
        } finally {
            loadButton.disabled = false;
        }
    }
    loadButton.addEventListener('click', handleLoadToolkitClick);
});