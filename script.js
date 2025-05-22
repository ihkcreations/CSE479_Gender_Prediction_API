document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultDiv = document.getElementById('result');
    const loadingText = document.getElementById('loadingText');
    const nameDisplay = document.getElementById('nameDisplay');
    const genderDisplay = document.getElementById('genderDisplay');
    const probabilityDisplay = document.getElementById('probabilityDisplay');
    const countDisplay = document.getElementById('countDisplay');
    const errorText = document.getElementById('errorText');

    function clearResults() {
        nameDisplay.textContent = '';
        genderDisplay.textContent = '';
        probabilityDisplay.textContent = '';
        countDisplay.textContent = '';
        errorText.textContent = '';
        resultDiv.className = 'unknown'; // Reset background
    }

    async function fetchGender() {
        const name = nameInput.value.trim();
        if (!name) {
            clearResults();
            errorText.textContent = 'Please enter a name.';
            resultDiv.className = 'unknown';
            return;
        }

        clearResults();
        loadingText.style.display = 'block';
        submitBtn.disabled = true;
        resultDiv.className = 'loading';

        try {
            const firstName = name;
            const response = await fetch(`https://api.genderize.io/?name=${encodeURIComponent(firstName)}`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.gender) {
                nameDisplay.textContent = `Name: ${data.name}`;
                nameDisplay.classList.add('name');

                genderDisplay.textContent = `Predicted Gender: ${data.gender}`;
                genderDisplay.classList.add('gender');

                probabilityDisplay.textContent = `Probability: ${(data.probability * 100).toFixed(1)}%`;
                countDisplay.textContent = `Based on ${data.count.toLocaleString()} samples.`;
                
                // Set background color based on gender
                if (data.gender === 'male') {
                    resultDiv.className = 'male';
                } else if (data.gender === 'female') {
                    resultDiv.className = 'female';
                } else {
                    resultDiv.className = 'unknown';
                }
            } else {
                errorText.textContent = `Could not determine gender for "${data.name || firstName}".`;
                resultDiv.className = 'unknown';
            }

        } catch (error) {
            console.error('Fetch error:', error);
            errorText.textContent = 'Failed to fetch gender. Please try again later.';
            resultDiv.className = 'unknown';
        } finally {
            loadingText.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    submitBtn.addEventListener('click', fetchGender);
    nameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchGender();
        }
    });
});