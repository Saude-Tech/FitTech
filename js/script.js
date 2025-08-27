// Global state
let isAuthenticated = false;
let isLogin = true;
let activeTab = 'home';
let isEditingProfile = false;
let selectedMeal = 'breakfast';
let selectedCategory = 'all';

// User data
let userData = {
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    level: 1,
    xp: 0,
    totalPoints: 0,
    streakDays: 1,
    completedWorkouts: 2,
    waterGoal: 2500,
    waterConsumed: 0,
};

// Nutrition data
let nutritionData = {
    calories: { current: 0, target: 2200 },
    protein: { current: 0, target: 157 },
    carbs: { current: 0, target: 275 },
    fat: { current: 0, target: 73 },
    imc: 0,
    imcCategory: 'Peso normal',
    tmb: 0
};

// Food history
let foodHistory = [
    {
        id: '1',
        name: 'Aveia com banana',
        calories: 320,
        protein: 12,
        carbs: 58,
        fat: 6,
        time: '08:30',
        meal: 'breakfast',
        date: new Date().toISOString().split('T')[0]
    },
    {
        id: '2',
        name: 'Frango grelhado',
        calories: 280,
        protein: 35,
        carbs: 0,
        fat: 14,
        time: '12:45',
        meal: 'lunch',
        date: new Date().toISOString().split('T')[0]
    },
    {
        id: '3',
        name: 'Iogurte grego',
        calories: 150,
        protein: 20,
        carbs: 8,
        fat: 5,
        time: '15:20',
        meal: 'snack',
        date: new Date().toISOString().split('T')[0]
    }
];

// Quick foods database
const quickFoods = [
    { id: '1', name: 'Banana média', calories: 105, protein: 1, carbs: 27, fat: 0, category: 'frutas' },
    { id: '2', name: 'Peito de frango (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'proteinas' },
    { id: '3', name: 'Arroz integral (1 xícara)', calories: 216, protein: 5, carbs: 45, fat: 1.8, category: 'carboidratos' },
    { id: '4', name: 'Aveia (50g)', calories: 190, protein: 6.5, carbs: 32, fat: 3.5, category: 'carboidratos' },
    { id: '5', name: 'Ovo inteiro', calories: 70, protein: 6, carbs: 0.6, fat: 5, category: 'proteinas' },
    { id: '6', name: 'Maçã média', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'frutas' },
    { id: '7', name: 'Iogurte grego (150g)', calories: 130, protein: 20, carbs: 8, fat: 5, category: 'laticinios' },
    { id: '8', name: 'Amêndoas (30g)', calories: 175, protein: 6, carbs: 6, fat: 15, category: 'oleaginosas' },
    { id: '9', name: 'Batata doce (100g)', calories: 86, protein: 2, carbs: 20, fat: 0.1, category: 'carboidratos' },
    { id: '10', name: 'Salmão (100g)', calories: 208, protein: 25, carbs: 0, fat: 12, category: 'proteinas' },
    { id: '11', name: 'Brócolis (100g)', calories: 34, protein: 3, carbs: 7, fat: 0.4, category: 'vegetais' },
    { id: '12', name: 'Azeite (1 colher)', calories: 120, protein: 0, carbs: 0, fat: 14, category: 'gorduras' }
];

// Food categories
const foodCategories = [
    { id: 'all', name: 'Todos', icon: '' },
    { id: 'frutas', name: 'Frutas', icon: '' },
    { id: 'proteinas', name: 'Proteínas', icon: '' },
    { id: 'carboidratos', name: 'Carboidratos', icon: '' },
    { id: 'vegetais', name: 'Vegetais', icon: '' },
    { id: 'laticinios', name: 'Laticínios', icon: '' },
    { id: 'oleaginosas', name: 'Oleaginosas', icon: '' },
    { id: 'gorduras', name: 'Gorduras', icon: '' }
];

// Utility functions
function calculateIMC(weight, height) {
    const heightInMeters = height / 100;
    if (!heightInMeters || heightInMeters <= 0) return 0;
    return weight / (heightInMeters * heightInMeters);
}

function getIMCCategory(imc) {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade grau I';
    if (imc < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
}

function calculateTMB(weight, height, age, gender) {
    if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.33 * age);
    }
}

function calculateDailyCalories(tmb, activityLevel, goal) {
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };

    const baseCalories = tmb * activityMultipliers[activityLevel];

    switch (goal) {
        case 'lose':
            return Math.round(baseCalories - 500);
        case 'gain':
            return Math.round(baseCalories + 300);
        default:
            return Math.round(baseCalories);
    }
}

function calculateMacros(calories) {
    return {
        protein: Math.round((calories * 0.3) / 4),
        carbs: Math.round((calories * 0.45) / 4),
        fat: Math.round((calories * 0.25) / 9)
    };
}

function updateNutritionCalculations() {
    const imc = calculateIMC(userData.weight, userData.height);
    const imcCategory = getIMCCategory(imc);
    const tmb = calculateTMB(userData.weight, userData.height, userData.age, userData.gender);
    const targetCalories = calculateDailyCalories(tmb, userData.activityLevel, userData.goal);
    const macros = calculateMacros(targetCalories);

    nutritionData.imc = Number(imc.toFixed(1));
    nutritionData.imcCategory = imcCategory;
    nutritionData.tmb = Math.round(tmb);
    nutritionData.calories.target = targetCalories;
    nutritionData.protein.target = macros.protein;
    nutritionData.carbs.target = macros.carbs;
    nutritionData.fat.target = macros.fat;

    updateNutritionDisplay();
}

function updateNutritionDisplay() {
    document.getElementById('imcValue').textContent = nutritionData.imc;
    document.getElementById('imcCategory').textContent = nutritionData.imcCategory;
    document.getElementById('tmbValue').textContent = nutritionData.tmb;
    document.getElementById('dailyCalories').textContent = nutritionData.calories.target;
    
    const goalTexts = {
        lose: 'kcal/dia para perder peso',
        maintain: 'kcal/dia para manter peso',
        gain: 'kcal/dia para ganhar peso'
    };
    document.getElementById('goalText').textContent = goalTexts[userData.goal];

    // Update macro progress
    document.getElementById('currentCalories').textContent = nutritionData.calories.current;
    document.getElementById('targetCalories').textContent = nutritionData.calories.target;
    document.getElementById('currentProtein').textContent = nutritionData.protein.current;
    document.getElementById('targetProtein').textContent = nutritionData.protein.target;
    document.getElementById('currentCarbs').textContent = nutritionData.carbs.current;
    document.getElementById('targetCarbs').textContent = nutritionData.carbs.target;
    document.getElementById('currentFat').textContent = nutritionData.fat.current;
    document.getElementById('targetFat').textContent = nutritionData.fat.target;

    // Update progress bars
    updateProgressBar('caloriesProgress', nutritionData.calories.current, nutritionData.calories.target);
    updateProgressBar('proteinProgress', nutritionData.protein.current, nutritionData.protein.target);
    updateProgressBar('carbsProgress', nutritionData.carbs.current, nutritionData.carbs.target);
    updateProgressBar('fatProgress', nutritionData.fat.current, nutritionData.fat.target);
}

function updateProgressBar(elementId, current, target) {
    const percentage = Math.min((current / target) * 100, 100);
    document.getElementById(elementId).style.width = percentage + '%';
}

function getMealIcon(meal) {
    const icons = {
        breakfast: '',
        lunch: '',
        dinner: '',
        snack: ''
    };
    return icons[meal] || '🍴';
}

function getMealName(meal) {
    const names = {
        breakfast: 'Café da Manhã',
        lunch: 'Almoço',
        dinner: 'Jantar',
        snack: 'Lanche'
    };
    return names[meal] || 'Refeição';
}

function addFoodToMeal(food, meal) {
    const newEntry = {
        id: Date.now().toString(),
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        meal: meal,
        date: new Date().toISOString().split('T')[0]
    };

    foodHistory.unshift(newEntry);

    // Update nutrition data
    nutritionData.calories.current += food.calories;
    nutritionData.protein.current += food.protein;
    nutritionData.carbs.current += food.carbs;
    nutritionData.fat.current += food.fat;

    updateFoodHistoryDisplay();
    updateNutritionDisplay();
    closeQuickFoodsModal();
}

function removeFoodEntry(id) {
    const entry = foodHistory.find(f => f.id === id);
    if (entry) {
        foodHistory = foodHistory.filter(f => f.id !== id);

        // Update nutrition data
        nutritionData.calories.current = Math.max(0, nutritionData.calories.current - entry.calories);
        nutritionData.protein.current = Math.max(0, nutritionData.protein.current - entry.protein);
        nutritionData.carbs.current = Math.max(0, nutritionData.carbs.current - entry.carbs);
        nutritionData.fat.current = Math.max(0, nutritionData.fat.current - entry.fat);

        updateFoodHistoryDisplay();
        updateNutritionDisplay();
    }
}

function updateFoodHistoryDisplay() {
    const foodHistoryList = document.getElementById('foodHistoryList');
    const todayFoodHistory = foodHistory.filter(entry => 
        entry.date === new Date().toISOString().split('T')[0]
    );

    if (todayFoodHistory.length === 0) {
        foodHistoryList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-apple-alt"></i>
                <p>Nenhum alimento registrado hoje</p>
                <p>Clique em "Adicionar Alimento" para começar</p>
            </div>
        `;
        return;
    }

    foodHistoryList.innerHTML = todayFoodHistory.map(entry => `
        <div class="food-item">
            <div class="food-info">
                <div class="meal-icon">${getMealIcon(entry.meal)}</div>
                <div class="food-details">
                    <h4>${entry.name}</h4>
                    <p class="food-meta">${getMealName(entry.meal)} • ${entry.time}</p>
                    <div class="food-macros">
                        <span>${entry.calories} kcal</span>
                        <span>${entry.protein}g prot</span>
                        <span>${entry.carbs}g carb</span>
                        <span>${entry.fat}g gord</span>
                    </div>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFoodEntry('${entry.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function updateWaterDisplay() {
    const goal = userData.waterGoal || 1;
    const percentage = Math.round((userData.waterConsumed / goal) * 100);
    const remaining = Math.max(goal - userData.waterConsumed, 0);

    const waterLevelEl = document.getElementById('waterLevel');
    if (waterLevelEl) waterLevelEl.style.height = Math.min(Math.max(percentage, 0), 100) + '%';
    const wp = document.getElementById('waterPercentage'); if (wp) wp.textContent = percentage + '%';
    const cw = document.getElementById('currentWater'); if (cw) cw.textContent = userData.waterConsumed;
    const tw = document.getElementById('targetWater'); if (tw) tw.textContent = userData.waterGoal;
    const rw = document.getElementById('remainingWater'); if (rw) rw.textContent = remaining;
}

function addWater(amount) {
    userData.waterConsumed = Math.min(userData.waterConsumed + amount, userData.waterGoal);
    updateWaterDisplay();
}

function showQuickFoodsModal() {
    document.getElementById('quickFoodsModal').classList.remove('hidden');
    renderQuickFoods();
}

function closeQuickFoodsModal() {
    document.getElementById('quickFoodsModal').classList.add('hidden');
}

function renderQuickFoods() {
    const filteredFoods = selectedCategory === 'all' 
        ? quickFoods 
        : quickFoods.filter(food => food.category === selectedCategory);

    const quickFoodsList = document.getElementById('quickFoodsList');
    
    if (filteredFoods.length === 0) {
        quickFoodsList.innerHTML = `<div class="empty-state"><p>Nenhum alimento encontrado nesta categoria</p></div>`;
        return;
    }

    quickFoodsList.innerHTML = filteredFoods.map(food => {
        const category = foodCategories.find(c => c.id === food.category);
        return `
            <div class="quick-food-item" data-food-id="${food.id}">
                <div class="food-header">
                    <span class="food-name">${food.name}</span>
                    <span class="food-calories">${food.calories} kcal</span>
                </div>
                <div class="food-macros-grid">
                    <div class="macro-item">
                        <div class="macro-value protein">${food.protein}g</div>
                        <div class="macro-label">Prot</div>
                    </div>
                    <div class="macro-item">
                        <div class="macro-value carbs">${food.carbs}g</div>
                        <div class="macro-label">Carb</div>
                    </div>
                    <div class="macro-item">
                        <div class="macro-value fat">${food.fat}g</div>
                        <div class="macro-label">Gord</div>
                    </div>
                </div>
                <div class="food-footer">
                    <span class="food-category">${category ? category.name : 'Outros'}</span>
                    <button class="add-food-btn" data-food-id="${food.id}">
                        <i class="fas fa-plus"></i>
                        Adicionar
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Attach click handlers to the new buttons
    setTimeout(() => {
        document.querySelectorAll('.add-food-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.foodId;
                const food = quickFoods.find(f => f.id === id);
                if (food) addFoodToMeal(food, selectedMeal);
            });
        });
    }, 0);
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    activeTab = tabName;
}

function toggleProfileEdit() {
    isEditingProfile = !isEditingProfile;
    const editBtn = document.getElementById('editProfileBtn');
    const inputs = document.querySelectorAll('#nutritionTab input, #nutritionTab select');

    if (isEditingProfile) {
        editBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
        inputs.forEach(input => input.disabled = false);
    } else {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
        inputs.forEach(input => input.disabled = true);
        updateNutritionCalculations();
    }
}

function handleAuth(e) {
    e.preventDefault();
    isAuthenticated = true;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Initialize displays
    updateNutritionCalculations();
    updateFoodHistoryDisplay();
    updateWaterDisplay();
}

function logout() {
    isAuthenticated = false;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function switchAuthTab(tab) {
    isLogin = tab === 'login';
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    const nameField = document.getElementById('nameField');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const forgotPassword = document.getElementById('forgotPassword');
    const authBtn = document.querySelector('.auth-btn');

    if (isLogin) {
        nameField.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        forgotPassword.classList.remove('hidden');
        authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Entrar</span>';
    } else {
        nameField.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        forgotPassword.classList.add('hidden');
        authBtn.innerHTML = '<i class="fas fa-user-plus"></i><span>Criar conta</span>';
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Auth form
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    
    // Tab switchers
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
    });

    // Password toggle
    document.querySelector('.toggle-password').addEventListener('click', togglePassword);

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Profile edit
    document.getElementById('editProfileBtn').addEventListener('click', toggleProfileEdit);

    // Personal data inputs
    document.getElementById('userAge').addEventListener('input', (e) => {
        userData.age = parseInt(e.target.value);
        if (!isNaN(userData.age)) updateNutritionCalculations();
    });

    document.getElementById('userHeight').addEventListener('input', (e) => {
        userData.height = parseInt(e.target.value);
        if (!isNaN(userData.height)) updateNutritionCalculations();
    });

    document.getElementById('userWeight').addEventListener('input', (e) => {
        userData.weight = parseFloat(e.target.value);
        if (!isNaN(userData.weight)) updateNutritionCalculations();
    });

    document.getElementById('userGender').addEventListener('change', (e) => {
        userData.gender = e.target.value;
        updateNutritionCalculations();
    });

    document.getElementById('activityLevel').addEventListener('change', (e) => {
        userData.activityLevel = e.target.value;
        updateNutritionCalculations();
    });

    document.getElementById('userGoal').addEventListener('change', (e) => {
        userData.goal = e.target.value;
        updateNutritionCalculations();
    });

    // Food modal
    document.getElementById('addFoodBtn').addEventListener('click', showQuickFoodsModal);
    document.getElementById('closeModal').addEventListener('click', closeQuickFoodsModal);

    // Meal selection
    document.querySelectorAll('.meal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMeal = btn.dataset.meal;
        });
    });

    // Category filter
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.dataset.category;
            renderQuickFoods();
        });
    });

    // Water buttons
    document.querySelectorAll('.water-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            addWater(amount);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Close modal when clicking outside
    document.getElementById('quickFoodsModal').addEventListener('click', (e) => {
        if (e.target.id === 'quickFoodsModal') {
            closeQuickFoodsModal();
        }
    });

    // Initialize displays
    updateNutritionCalculations();
    updateFoodHistoryDisplay();
    updateWaterDisplay();
});