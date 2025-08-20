// --- Wait for the entire webpage to load before running any script ---
window.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Sketchfab Viewer Setup ---
    const iframe = document.getElementById('api-frame');
    const modelUID = '37366957265e4918baec184625662062'; // The Car Model UID from car.html
    const client = new Sketchfab('1.12.1', iframe);
    let sketchfabApi; // This variable will hold the API object once it's ready

    // Initialize the Sketchfab viewer
    client.init(modelUID, {
        success: (api) => {
            sketchfabApi = api;
            api.start();
            api.addEventListener('viewerready', () => {
                console.log('Sketchfab Viewer is ready.');
                // We could make the model transparent here if we wanted
            });
        },
        error: () => {
            console.error('Sketchfab API failed to initialize');
        }
    });

    // Function to light up a single brick (we'll use this later)
    function lightUpBrick(materialName) {
        if (!sketchfabApi) return;
        sketchfabApi.getMaterialList((err, materials) => {
            if (err) return;
            const targetMaterial = materials.find(m => m.name === materialName);
            if (targetMaterial) {
                targetMaterial.channels.Opacity.enable = true;
                targetMaterial.channels.Opacity.factor = 1.0;
                sketchfabApi.setMaterial(targetMaterial);
            }
        });
    }


    // --- Part 2: Dynamic Content & Google Sheets Integration ---

    // The live, golden URL is now permanently forged into the code.
    const aodAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbzNZy03Jizd-BsXO29OwnBT7UrXyza4URqNKSjl2oQcwXjFW8fynRQ7dWPixhGoQuPZ/exec';


    const quizContainer = document.getElementById('quiz-container');
    const outputContainer = document.getElementById('smart-brick-output');

    // --- Create the button dynamically ---
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load The Will Challenge Blueprint';
    loadButton.className = 'load-toolkit-btn';
    quizContainer.appendChild(loadButton);

    // --- The main function that runs when the button is clicked ---
    async function handleLoadToolkitClick() {
        console.log('Button clicked. Fetching data...');
        outputContainer.innerHTML = '<p>Loading toolkit... Please wait.</p>';
        loadButton.disabled = true; // Disable button to prevent multiple clicks

        try {
            // Construct the request URL for our specific toolkit
            const requestUrl = `${aodAppsScriptUrl}?toolkitId=BP-C5.1`;

            // Call the Google Apps Script (the "Head Chef")
            const response = await fetch(requestUrl);

            // Check if the kitchen sent back the food correctly
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            // Get the data (the list of Smart Bricks) from the response
            const data = await response.json();

            // Check if the Apps Script sent back a successful result
            if (data.status === 'success') {
                // Clear the "loading" message
                outputContainer.innerHTML = ''; 

                // --- Display the toolkit content in Pane 4 ---
                data.bricks.forEach(brick => {
                    const brickElement = document.createElement('div');
                    brickElement.className = 'brick-content';
                    // We create a title and the text for each brick
                    const brickTitle = document.createElement('h3');
                    brickTitle.textContent = brick.id; // Display the Brick ID as a title
                    const brickText = document.createElement('p');
                    brickText.textContent = brick.text; // The actual content

                    brickElement.appendChild(brickTitle);
                    brickElement.appendChild(brickText);
                    outputContainer.appendChild(brickElement);
                });

                // --- Light up a few bricks in Pane 3 to prove it works ---
                // (These are sample material names from your car.html file)
                lightUpBrick("Material_00001_4315.dat_Mat.001");
                lightUpBrick("Material_00002_4600.dat_Mat.001");

            } else {
                // If the Apps Script reported an error (e.g., toolkit not found)
                throw new Error(data.message || 'The Apps Script returned an error.');
            }

        } catch (error) {
            console.error('Error fetching toolkit:', error);
            outputContainer.innerHTML = `<p style="color: red;"><strong>Error:</strong> Could not load the toolkit. Please check the console for details.</p>`;
        } finally {
            // Re-enable the button whether it succeeded or failed
            loadButton.disabled = false;
        }
    }

    // Attach the function to the button's click event
    loadButton.addEventListener('click', handleLoadToolkitClick);

});