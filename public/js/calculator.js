// Load saved data when the page loads
window.onload = function () {
  document.getElementById('food').value = localStorage.getItem('food') || '';
  document.getElementById('weight').value = localStorage.getItem('weight') || '';
  document.getElementById('foodType').value = localStorage.getItem('foodType') || 'raw';
  document.getElementById('energy').textContent = localStorage.getItem('energy') || '';
  document.getElementById('fiber').textContent = localStorage.getItem('fiber') || '';
  document.getElementById('walkTime').textContent = localStorage.getItem('walkTime') || '';
  document.getElementById('runTime').textContent = localStorage.getItem('runTime') || '';

  // Fetch the food data from the JSON file when the page loads
  fetch('/public/json/foodData.json')
    .then(response => response.json())
    .then(data => {
      window.foodData = data; // Store the food data in a global variable
    })
    .catch(error => console.error('Error loading food data:', error));
};

function calculateNutrition() {
  const foodItem = document.getElementById('food').value.trim();
  const weight = parseFloat(document.getElementById('weight').value);
  const foodType = document.getElementById('foodType').value;
  const foodError = document.getElementById('foodError');
  const weightError = document.getElementById('weightError');

  // Reset error messages
  foodError.textContent = "";
  weightError.textContent = "";

  if (!foodItem) {
    foodError.textContent = "Food is required.";
    return;
  }

  if (!weight || weight <= 0) {
    weightError.textContent = "Can't calculate food under or equal 0g.";
    return;
  }

  // Check if food data has been loaded
  if (!window.foodData) {
    foodError.textContent = "Food data is not loaded yet.";
    return;
  }

  const food = window.foodData[foodItem.toLowerCase()];
  if (!food) {
    foodError.textContent = "Food is not on the list.";
    return;
  }

  const selectedFoodData = food[foodType];

  // Calculate total energy (Calories)
  const energy = ((selectedFoodData.carbs * 4) + (selectedFoodData.protein * 4) + (selectedFoodData.fat * 9) + (selectedFoodData.fiber * 2)) * (weight / 100);
  const fiber = (selectedFoodData.fiber * weight) / 100;

  // Calculate burn time
  const { walkTime, runTime } = calculateBurnTime(energy);

  // Display results
  document.getElementById('energy').textContent = energy.toFixed(2);
  document.getElementById('fiber').textContent = fiber.toFixed(2) + "g";
  document.getElementById('walkTime').textContent = walkTime.toFixed(2) + " min";
  document.getElementById('runTime').textContent = runTime.toFixed(2) + " min";

  // Save data to local storage
  localStorage.setItem('food', foodItem);
  localStorage.setItem('weight', weight);
  localStorage.setItem('foodType', foodType);
  localStorage.setItem('energy', energy.toFixed(2));
  localStorage.setItem('fiber', fiber.toFixed(2));
  localStorage.setItem('walkTime', walkTime.toFixed(2));
  localStorage.setItem('runTime', runTime.toFixed(2));
}

// Function to calculate how long it takes to burn calories
function calculateBurnTime(calories) {
  const walkCaloriesPerMin = 5; // Approximate calories burned per minute walking (~5 km/h)
  const runCaloriesPerMin = 10; // Approximate calories burned per minute running (~10 km/h)

  const walkTime = calories / walkCaloriesPerMin;
  const runTime = calories / runCaloriesPerMin;

  return { walkTime, runTime };
}
