window.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('api-frame');
    const modelUID = '37366957265e4918baec184625662062';
    const client = new Sketchfab('1.12.1', iframe);

    client.init(modelUID, {
        success: (api) => { api.start(); },
        error: () => console.error('Sketchfab API failed to initialize')
    });

    const aodAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxbaAPZ5yyGXyogUhn8OuIejDZFz-bNnQ0oqMsy4ukGXt6FffWYzpKcqXwAMLYRyKWp/exec';
    
    const targetToolkitId = 'BP-C5.1';

    const quizContainer = document.getElementById('quiz-container');
    const outputContainer = document.getElementById('smart-brick-output');

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load The Will Challenge Blueprint';
    loadButton.className = 'load-toolkit-btn';
    quizContainer.appendChild(loadButton);

    async function handleLoadToolkitClick() {
        outputContainer.innerHTML = '<p>Loading toolkit...</p>';
        loadButton.disabled = true;

        try {
            const requestUrl = `${aodAppsScriptUrl}?toolkitId=${targetToolkitId}`;
            const response = await fetch(requestUrl);
            if (!response.ok) throw new Error(`Network response error`);
            
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