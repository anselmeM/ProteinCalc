// Constants for protein requirements
const PROTEIN_PER_KG = 0.8;
const PROTEIN_PER_LB = 0.36;

// Function to calculate protein need based on weight
function calculateProteinNeed(weight) {
    // Check if weight is not a number or less than or equal to 0
    if (isNaN(weight) || weight <= 0) {
        return NaN; // Return NaN if weight is invalid
    }
    return weight * PROTEIN_PER_KG; // Calculate protein need based on weight
}

// Function to display error message
function displayError(message) {
    const errorElement = document.getElementById('error');
    errorElement.innerText = message; // Display error message
}

// Function to display result
function displayResult(result) {
    const resultElement = document.getElementById('result');
    resultElement.innerText = result; // Display result
}

// Function to clear previous messages
function clearMessages() {
    displayResult(''); // Clear result message
    displayError(''); // Clear error message
}

// Function to fetch recipes based on a custom query
function fetchRecipes(query) {
    const appId = 'e0b6e0e7'; // Your Edamam application ID
    const appKey = '4f030142c769e14f60073c1eace40863'; // Your Edamam application key
    const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to fetch recipes. Please try again later.');
            }
            return response.json();
        })
        .then(data => data.hits.map(hit => hit.recipe))
        .catch(error => {
            console.error('Error fetching recipes:', error);
            throw new Error('Unable to fetch recipes. Please try again later.');
        });
}

// Function to display recipes on the UI
function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.innerHTML = `
            <h3>${recipe.label}</h3>
            <p>Calories: ${recipe.calories.toFixed(2)}</p>
            <p>Protein: ${recipe.totalNutrients.PROCNT.quantity.toFixed(2)} ${recipe.totalNutrients.PROCNT.unit}</p>
            <img src="${recipe.image}" alt="${recipe.label}">
            <a href="${recipe.url}" target="_blank">View Recipe</a>
        `;
        recipesContainer.appendChild(recipeElement);
    });
}

// Event listener for calculate button
document.getElementById('calculateBtn').addEventListener('click', function() {
    const weightInput = document.getElementById('weightInput').value;
    const weight = parseFloat(weightInput);

    clearMessages(); // Clear previous messages

    if (!weightInput || isNaN(weight) || weight <= 0) {
        displayError('Please enter a valid weight greater than zero.');
        return;
    }

    const proteinNeed = calculateProteinNeed(weight);
    displayResult(`You need approximately ${proteinNeed.toFixed(2)} grams of protein per day.`);
});

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        fetchRecipes(query)
            .then(displayRecipes)
            .catch(error => {
                displayError(error.message);
            });
    }
});