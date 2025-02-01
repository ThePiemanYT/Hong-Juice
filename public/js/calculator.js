// Load saved data when the page loads
window.onload = function () {
  document.getElementById('food').value = localStorage.getItem('food') || '';
  document.getElementById('weight').value = localStorage.getItem('weight') || '';
  document.getElementById('foodType').value = localStorage.getItem('foodType') || 'raw';
  document.getElementById('energy').textContent = localStorage.getItem('energy') || '';
  document.getElementById('fiber').textContent = localStorage.getItem('fiber') || '';
  document.getElementById('walkTime').textContent = localStorage.getItem('walkTime') || '';
  document.getElementById('runTime').textContent = localStorage.getItem('runTime') || '';
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

  const foodData = {
    apple: {
      raw: { carbs: 25, protein: 0.5, fat: 0.3, fiber: 2.4 },
      cooked: { carbs: 20, protein: 0.5, fat: 0.2, fiber: 2.0 }
    },
    banana: {
      raw: { carbs: 27, protein: 1.3, fat: 0.3, fiber: 3.1 },
      cooked: { carbs: 23, protein: 1.1, fat: 0.2, fiber: 2.5 }
    },
    rice: {
      raw: { carbs: 28, protein: 2.7, fat: 0.3, fiber: 0.6 },
      cooked: { carbs: 31, protein: 3.0, fat: 0.4, fiber: 1.0 }
    },
    chicken: {
      raw: { carbs: 0, protein: 31, fat: 3.6, fiber: 0 },
      cooked: { carbs: 0, protein: 30, fat: 4.0, fiber: 0 }
    },
    watermelon: {
      raw: { carbs: 7.6, protein: 0.6, fat: 0.2, fiber: 0.4 },
      cooked: { carbs: 8.0, protein: 0.5, fat: 0.1, fiber: 0.5 }
    },
    orange: {
      raw: { carbs: 11.5, protein: 0.7, fat: 0.2, fiber: 2.4 },
      cooked: { carbs: 12.0, protein: 0.8, fat: 0.3, fiber: 2.5 }
    },
    coconut: {
      raw: { carbs: 15.23, protein: 3.33, fat: 33.49, fiber: 9.0 },
      cooked: { carbs: 13.0, protein: 3.2, fat: 31.0, fiber: 8.0 }
    },
    strawberry: {
      raw: { carbs: 7.68, protein: 0.67, fat: 0.3, fiber: 2.0 },
      cooked: { carbs: 8.0, protein: 0.8, fat: 0.4, fiber: 2.2 }
    },
    pineapple: {
      raw: { carbs: 13.12, protein: 0.54, fat: 0.12, fiber: 1.4 },
      cooked: { carbs: 14.0, protein: 0.6, fat: 0.15, fiber: 1.5 }
    },
    carrot: {
      raw: { carbs: 9.58, protein: 0.93, fat: 0.24, fiber: 2.8 },
      cooked: { carbs: 10.0, protein: 1.0, fat: 0.3, fiber: 3.0 }
    },
    pork: {
      raw: { carbs: 0, protein: 27.33, fat: 14.0, fiber: 0 },
      cooked: { carbs: 0, protein: 25.0, fat: 16.0, fiber: 0 }
    },
    beef: {
      raw: { carbs: 0, protein: 26.0, fat: 15.0, fiber: 0 },
      cooked: { carbs: 0, protein: 28.0, fat: 17.0, fiber: 0 }
    },
    milk: {
      raw: { carbs: 4.8, protein: 3.4, fat: 3.25, fiber: 0 },
      cooked: { carbs: 5.0, protein: 3.5, fat: 3.3, fiber: 0 }
    },
    coffee: {
      raw: { carbs: 0, protein: 0.1, fat: 0, fiber: 0 },
      cooked: { carbs: 0, protein: 0.1, fat: 0, fiber: 0 }
    },
    potato: {
      raw: { carbs: 17.58, protein: 2.02, fat: 0.1, fiber: 2.2 },
      cooked: { carbs: 18.0, protein: 2.2, fat: 0.2, fiber: 2.5 }
    },
    cabbage: {
      raw: { carbs: 5.8, protein: 1.28, fat: 0.1, fiber: 2.5 },
      cooked: { carbs: 6.0, protein: 1.3, fat: 0.2, fiber: 2.6 }
    }
  };

  const food = foodData[foodItem.toLowerCase()];
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
