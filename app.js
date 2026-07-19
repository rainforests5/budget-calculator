// ===== DATA MANAGEMENT =====
let categories = [];
let transactions = [];
let budgets = [];
let currentEditingId = null;

// Default categories
const defaultCategories = [
    { id: 1, name: 'Wynajem', type: 'expense', color: '#FF6B6B' },
    { id: 2, name: 'Rachunki', type: 'expense', color: '#4ECDC4' },
    { id: 3, name: 'Żywność', type: 'expense', color: '#FFE66D' },
    { id: 4, name: 'Transport', type: 'expense', color: '#95E1D3' },
    { id: 5, name: 'Rozrywka', type: 'expense', color: '#C7CEEA' },
    { id: 6, name: 'Zdrowotne', type: 'expense', color: '#FF8B94' },
    { id: 7, name: 'Edukacja', type: 'expense', color: '#FFB7B2' },
    { id: 8, name: 'Zakupy', type: 'expense', color: '#FFDAC1' },
    { id: 9, name: 'Pensja', type: 'income', color: '#38ef7d' },
    { id: 10, name: 'Premie', type: 'income', color: '#11998e' },
    { id: 11, name: 'Pozostałe Przychody', type: 'income', color: '#56AB2F' }
];

// Load data from localStorage
function loadData() {
    const storedCategories = localStorage.getItem('categories');
    const storedTransactions = localStorage.getItem('transactions');
    const storedBudgets = localStorage.getItem('budgets');

    categories = storedCategories ? JSON.parse(storedCategories) : defaultCategories;
    transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    budgets = storedBudgets ? JSON.parse(storedBudgets) : [];
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeForms();
    updateDashboard();
    updateCategoriesList();
    displayCategories();
    displayBudgets();
    generateReport();

    // Set today's date as default
    document.getElementById('transDate').valueAsDate = new Date();
    document.getElementById('editTransDate').valueAsDate = new Date();
});

function initializeForms() {
    // Add transaction form
    document.getElementById('transactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTransaction();
    });

    // Edit transaction form
    document.getElementById('editTransactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEditedTransaction();
    });
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Refresh data if needed
    if (tabName === 'transactions') {
        displayTransactions();
    } else if (tabName === 'reports') {
        generateReport();
    }
}

// ===== ALERT SYSTEM =====
function showAlert(elementId, message, type) {
    const alertEl = document.getElementById(elementId);
    alertEl.className = `alert alert-${type} show`;
    alertEl.textContent = message;
    setTimeout(() => {
        alertEl.classList.remove('show');
    }, 4000);
}

// ===== CATEGORIES =====
function updateCategoriesList() {
    const type = document.getElementById('transType').value;
    const categorySelect = document.getElementById('transCategory');
    categorySelect.innerHTML = '<option value="">Wybierz kategorię</option>';

    categories
        .filter(cat => cat.type === type)
        .forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
}

function addCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    const type = document.getElementById('newCategoryType').value;
    const color = document.getElementById('newCategoryColor').value;

    if (!name) {
        showAlert('categoriesAlert', '❌ Wpisz nazwę kategorii!', 'danger');
        return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        showAlert('categoriesAlert', '❌ Kategoria już istnieje!', 'danger');
        return;
    }

    const newCategory = {
        id: Date.now(),
        name,
        type,
        color
    };

    categories.push(newCategory);
    saveData();
    displayCategories();
    updateCategoriesList();
    displayBudgetCategories();

    document.getElementById('newCategoryName').value = '';
    document.getElementById('newCategoryColor').value = '#667eea';

    showAlert('categoriesAlert', '✓ Kategoria dodana pomyślnie!', 'success');
}

function displayCategories() {
    const container = document.getElementById('categoriesList');
    const incomeCategories = categories.filter(cat => cat.type === 'income');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');

    let html = '';

    if (expenseCategories.length > 0) {
        html += '<h4 style="color: #dc3545; margin-top: 20px;">Wydatki</h4>';
        expenseCategories.forEach(cat => {
            html += `
                <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                    <div style="width: 30px; height: 30px; background: ${cat.color}; border-radius: 6px;"></div>
                    <span style="flex: 1;">${cat.name}</span>
                    <button onclick="deleteCategory(${cat.id})" class="btn-danger btn-small">🗑️</button>
                </div>
            `;
        });
    }

    if (incomeCategories.length > 0) {
        html += '<h4 style="color: #28a745; margin-top: 20px;">Przychody</h4>';
        incomeCategories.forEach(cat => {
            html += `
                <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                    <div style="width: 30px; height: 30px; background: ${cat.color}; border-radius: 6px;"></div>
                    <span style="flex: 1;">${cat.name}</span>
                    <button onclick="deleteCategory(${cat.id})" class="btn-danger btn-small">🗑️</button>
                </div>
            `;
        });
    }

    container.innerHTML = html || '<p style="color: #999;">Brak kategorii</p>';
}

function deleteCategory(id) {
    if (confirm('Czy na pewno chcesz usunąć tę kategorię?')) {
        categories = categories.filter(cat => cat.id !== id);
        saveData();
        displayCategories();
        updateCategoriesList();
        displayBudgetCategories();
        showAlert('categoriesAlert', '✓ Kategoria usunięta!', 'success');
    }
}

// ===== TRANSACTIONS =====
function addTransaction() {
    const type = document.getElementById('transType').value;
    const categoryId = parseInt(document.getElementById('transCategory').value);
    const amount = parseFloat(document.getElementById('transAmount').value);
    const date = document.getElementById('transDate').value;
    const periodicity = document.getElementById('transPeriodicity').value;
    const description = document.getElementById('transDescription').value;
    const notes = document.getElementById('transNotes').value;

    if (!categoryId || !amount || !date) {
        showAlert('addTransactionAlert', '❌ Uzupełnij wszystkie wymagane pola!', 'danger');
        return;
    }

    const category = categories.find(cat => cat.id === categoryId);

    const transaction = {
        id: Date.now(),
        type,
        categoryId,
        categoryName: category.name,
        amount,
        date,
        periodicity,
        description,
        notes,
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);
    saveData();
    resetTransactionForm();
    showAlert('addTransactionAlert', '✓ Transakcja dodana pomyślnie!', 'success');
    updateDashboard();
}

function resetTransactionForm() {
    document.getElementById('transactionForm').reset();
    document.getElementById('transDate').valueAsDate = new Date();
}

function displayTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    const filtered = getFilteredTransactions();

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="color: #999;">Brak transakcji</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(trans => `
        <tr>
            <td>${new Date(trans.date).toLocaleDateString('pl-PL')}</td>
            <td>
                <span class="badge ${trans.type === 'income' ? 'badge-income' : 'badge-expense'}">
                    ${trans.type === 'income' ? '📈 Przychód' : '📉 Wydatek'}
                </span>
            </td>
            <td>${trans.categoryName}</td>
            <td>${trans.description || '-'}</td>
            <td class="${trans.type === 'income' ? 'text-success' : 'text-danger'}">
                ${trans.type === 'income' ? '+' : '-'}${trans.amount.toFixed(2)} zł
            </td>
            <td>
                <span class="badge ${getPeriodBadgeClass(trans.periodicity)}">
                    ${getPeriodLabel(trans.periodicity)}
                </span>
            </td>
            <td>
                <button onclick="openEditModal(${trans.id})" class="btn-info btn-small">✏️</button>
                <button onclick="deleteTransaction(${trans.id})" class="btn-danger btn-small">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function getFilteredTransactions() {
    const type = document.getElementById('filterType').value;
    const category = document.getElementById('filterCategory').value;
    const fromDate = document.getElementById('filterFromDate').value;
    const toDate = document.getElementById('filterToDate').value;

    return transactions.filter(trans => {
        if (type && trans.type !== type) return false;
        if (category && trans.categoryId !== parseInt(category)) return false;
        if (fromDate && new Date(trans.date) < new Date(fromDate)) return false;
        if (toDate && new Date(trans.date) > new Date(toDate)) return false;
        return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function filterTransactions() {
    // Populate category filter
    const filterCategorySelect = document.getElementById('filterCategory');
    const currentValue = filterCategorySelect.value;
    filterCategorySelect.innerHTML = '<option value="">Wszystkie</option>';

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        filterCategorySelect.appendChild(option);
    });

    filterCategorySelect.value = currentValue;
    displayTransactions();
}

function resetFilters() {
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterFromDate').value = '';
    document.getElementById('filterToDate').value = '';
    displayTransactions();
}

function openEditModal(id) {
    const trans = transactions.find(t => t.id === id);
    if (!trans) return;

    currentEditingId = id;

    document.getElementById('editTransType').value = trans.type;
    document.getElementById('editTransAmount').value = trans.amount;
    document.getElementById('editTransDate').value = trans.date;
    document.getElementById('editTransPeriodicity').value = trans.periodicity;
    document.getElementById('editTransDescription').value = trans.description;
    document.getElementById('editTransNotes').value = trans.notes;

    // Update category options based on type
    const categorySelect = document.getElementById('editTransCategory');
    categorySelect.innerHTML = '';
    categories
        .filter(cat => cat.type === trans.type)
        .forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            option.selected = cat.id === trans.categoryId;
            categorySelect.appendChild(option);
        });

    document.getElementById('editModal').classList.add('show');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    currentEditingId = null;
}

function saveEditedTransaction() {
    const trans = transactions.find(t => t.id === currentEditingId);
    if (!trans) return;

    trans.type = document.getElementById('editTransType').value;
    trans.categoryId = parseInt(document.getElementById('editTransCategory').value);
    trans.categoryName = categories.find(c => c.id === trans.categoryId).name;
    trans.amount = parseFloat(document.getElementById('editTransAmount').value);
    trans.date = document.getElementById('editTransDate').value;
    trans.periodicity = document.getElementById('editTransPeriodicity').value;
    trans.description = document.getElementById('editTransDescription').value;
    trans.notes = document.getElementById('editTransNotes').value;

    saveData();
    closeEditModal();
    displayTransactions();
    updateDashboard();
    showAlert('transactionsAlert', '✓ Transakcja zaktualizowana!', 'success');
}

function deleteTransaction(id = null) {
    const transId = id || currentEditingId;
    if (!transId) return;

    if (confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
        transactions = transactions.filter(t => t.id !== transId);
        saveData();
        closeEditModal();
        displayTransactions();
        updateDashboard();
        showAlert('transactionsAlert', '✓ Transakcja usunięta!', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
function getPeriodLabel(periodicity) {
    const labels = {
        '1': 'Jednorazowo',
        '1-month': '1 miesiąc',
        '2-months': '2 miesiące',
        '3-months': '3 miesiące',
        '4-months': '4 miesiące',
        '5-months': '5 miesięcy',
        '6-months': '6 miesięcy',
        '7-months': '7 miesięcy',
        '8-months': '8 miesięcy',
        '9-months': '9 miesięcy',
        '10-months': '10 miesięcy',
        '11-months': '11 miesięcy',
        '12-months': 'Cały rok'
    };
    return labels[periodicity] || periodicity;
}

function getPeriodBadgeClass(periodicity) {
    if (periodicity === '1') return '';
    if (periodicity.includes('month')) {
        if (periodicity.includes('3') || periodicity.includes('4') || periodicity.includes('5') || periodicity.includes('6')) {
            return 'badge-quarterly';
        } else if (periodicity.includes('12')) {
            return 'badge-yearly';
        } else {
            return 'badge-monthly';
        }
    }
    return 'badge-monthly';
}

function formatCurrency(amount) {
    return amount.toFixed(2).replace('.', ',') + ' zł';
}

// ===== DASHBOARD =====
function updateDashboard() {
    const period = parseInt(document.getElementById('dashboardPeriod').value) || 12;
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - period);

    const relevantTransactions = transactions.filter(t => new Date(t.date) >= fromDate);

    // Calculate totals
    const income = relevantTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = relevantTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const balance = income - expenses;

    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpense').textContent = formatCurrency(expenses);
    document.getElementById('totalBudget').textContent = formatCurrency(totalBudget);
    document.getElementById('balance').textContent = formatCurrency(balance);

    // Update balance color
    const balanceCard = document.getElementById('balance').parentElement;
    if (balance >= 0) {
        balanceCard.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    } else {
        balanceCard.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff0000 100%)';
    }

    // Update charts
    updateExpenseChart(relevantTransactions);
    updateIncomeExpenseChart(relevantTransactions);
    updateBudgetStatus(relevantTransactions);

    // Check budget alerts
    checkBudgetAlerts(relevantTransactions);
}

function updateExpenseChart(transactionsData) {
    const canvas = document.getElementById('expenseChart');
    const ctx = canvas.getContext('2d');

    // Calculate expenses by category
    const expensesByCategory = {};
    transactionsData
        .filter(t => t.type === 'expense')
        .forEach(t => {
            if (!expensesByCategory[t.categoryName]) {
                expensesByCategory[t.categoryName] = 0;
            }
            expensesByCategory[t.categoryName] += t.amount;
        });

    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);
    const colors = labels.map(label => {
        const cat = categories.find(c => c.name === label);
        return cat ? cat.color : '#999';
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simple pie chart
    if (data.length === 0) {
        ctx.fillStyle = '#ddd';
        ctx.font = '16px Arial';
        ctx.fillText('Brak wydatków', 50, 100);
        return;
    }

    const total = data.reduce((sum, val) => sum + val, 0);
    const radius = 80;
    let currentAngle = -Math.PI / 2;

    data.forEach((val, i) => {
        const sliceAngle = (val / total) * 2 * Math.PI;

        // Draw slice
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(150, 100, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(150, 100);
        ctx.fill();

        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = 150 + Math.cos(labelAngle) * (radius + 30);
        const labelY = 100 + Math.sin(labelAngle) * (radius + 30);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${labels[i]} (${(val / total * 100).toFixed(0)}%)`, labelX, labelY);

        currentAngle += sliceAngle;
    });
}

function updateIncomeExpenseChart(transactionsData) {
    const canvas = document.getElementById('incomeExpenseChart');
    const ctx = canvas.getContext('2d');

    const income = transactionsData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactionsData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simple bar chart
    const barWidth = 80;
    const barSpacing = 60;
    const maxHeight = 150;
    const maxValue = Math.max(income, expenses, 1);
    const scale = maxHeight / maxValue;

    // Income bar
    const incomeHeight = income * scale;
    ctx.fillStyle = '#38ef7d';
    ctx.fillRect(50, 100 + maxHeight - incomeHeight, barWidth, incomeHeight);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Przychody', 90, 270);
    ctx.fillText(formatCurrency(income), 90, 290);

    // Expenses bar
    const expenseHeight = expenses * scale;
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(50 + barSpacing + barWidth, 100 + maxHeight - expenseHeight, barWidth, expenseHeight);
    ctx.fillStyle = '#333';
    ctx.fillText('Wydatki', 90 + barSpacing + barWidth, 270);
    ctx.fillText(formatCurrency(expenses), 90 + barSpacing + barWidth, 290);

    // Axis
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 100 + maxHeight);
    ctx.lineTo(250, 100 + maxHeight);
    ctx.stroke();
}

function checkBudgetAlerts(transactionsData) {
    const alerts = [];

    budgets.forEach(budget => {
        const categoryExpenses = transactionsData
            .filter(t => t.type === 'expense' && t.categoryId === budget.categoryId)
            .reduce((sum, t) => sum + t.amount, 0);

        const percentage = (categoryExpenses / budget.amount) * 100;

        if (percentage >= 100) {
            alerts.push(`⚠️ Przekroczono budżet dla "${budget.categoryName}": ${categoryExpenses.toFixed(2)}/${budget.amount.toFixed(2)} zł`);
        } else if (percentage >= 80) {
            alerts.push(`⚡ Zbliżasz się do limitu budżetu dla "${budget.categoryName}": ${categoryExpenses.toFixed(2)}/${budget.amount.toFixed(2)} zł`);
        }
    });

    const alertEl = document.getElementById('dashboardAlert');
    if (alerts.length > 0) {
        alertEl.innerHTML = alerts.join('<br>');
        alertEl.className = 'alert alert-warning show';
    } else {
        alertEl.classList.remove('show');
    }
}

function updateBudgetStatus(transactionsData) {
    const container = document.getElementById('budgetStatus');

    if (budgets.length === 0) {
        container.innerHTML = '<p style="color: #999;">Brak ustawionych budżetów. <a href="#" onclick="switchTab(\'budgets\'); return false;">Dodaj budżet →</a></p>';
        return;
    }

    let html = '';

    budgets.forEach(budget => {
        const categoryExpenses = transactionsData
            .filter(t => t.type === 'expense' && t.categoryId === budget.categoryId)
            .reduce((sum, t) => sum + t.amount, 0);

        const percentage = Math.min((categoryExpenses / budget.amount) * 100, 100);
        const remaining = Math.max(budget.amount - categoryExpenses, 0);

        let barClass = 'progress-bar';
        if (percentage >= 100) {
            barClass += ' danger';
        } else if (percentage >= 80) {
            barClass += ' warning';
        }

        html += `
            <div class="category-budget-item">
                <div style="min-width: 150px; font-weight: 600;">${budget.categoryName}</div>
                <div class="progress">
                    <div class="${barClass}" style="width: ${percentage}%;">
                        ${percentage.toFixed(0)}%
                    </div>
                </div>
                <div style="min-width: 200px; text-align: right; font-size: 0.9em;">
                    <strong>${categoryExpenses.toFixed(2)} / ${budget.amount.toFixed(2)} zł</strong>
                    <br>
                    <span style="color: ${remaining > 0 ? '#28a745' : '#dc3545'};">
                        ${remaining > 0 ? 'Pozostało: ' + remaining.toFixed(2) : 'Przekroczono: ' + Math.abs(remaining).toFixed(2)} zł
                    </span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ===== BUDGETS =====
function displayBudgetCategories() {
    const select = document.getElementById('budgetCategory');
    const currentValue = select.value;

    select.innerHTML = '<option value="">Wybierz kategorię wydatków</option>';

    categories
        .filter(cat => cat.type === 'expense')
        .forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });

    select.value = currentValue;
}

function addBudget() {
    const categoryId = parseInt(document.getElementById('budgetCategory').value);
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    const period = document.getElementById('budgetPeriod').value;

    if (!categoryId || !amount) {
        showAlert('budgetsAlert', '❌ Uzupełnij wszystkie pola!', 'danger');
        return;
    }

    const category = categories.find(cat => cat.id === categoryId);

    // Check if budget already exists
    if (budgets.some(b => b.categoryId === categoryId && b.period === period)) {
        showAlert('budgetsAlert', '❌ Budżet dla tej kategorii już istnieje!', 'danger');
        return;
    }

    const budget = {
        id: Date.now(),
        categoryId,
        categoryName: category.name,
        amount,
        period,
        createdAt: new Date().toISOString()
    };

    budgets.push(budget);
    saveData();
    displayBudgets();
    document.getElementById('budgetAmount').value = '';
    document.getElementById('budgetCategory').value = '';
    showAlert('budgetsAlert', '✓ Budżet dodany pomyślnie!', 'success');
    updateDashboard();
}

function displayBudgets() {
    const container = document.getElementById('budgetsList');

    if (budgets.length === 0) {
        container.innerHTML = '<p style="color: #999;">Brak ustawionych budżetów</p>';
        return;
    }

    let html = '';

    budgets.forEach(budget => {
        const periodLabel = budget.period === 'monthly' ? 'Miesięczny' :
                          budget.period === 'quarterly' ? 'Kwartalny' :
                          'Roczny';

        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                <div>
                    <strong>${budget.categoryName}</strong>
                    <br>
                    <span style="font-size: 0.9em; color: #666;">${periodLabel}: ${budget.amount.toFixed(2)} zł</span>
                </div>
                <button onclick="deleteBudget(${budget.id})" class="btn-danger btn-small">🗑️</button>
            </div>
        `;
    });

    container.innerHTML = html;
}

function deleteBudget(id) {
    if (confirm('Czy na pewno chcesz usunąć ten budżet?')) {
        budgets = budgets.filter(b => b.id !== id);
        saveData();
        displayBudgets();
        showAlert('budgetsAlert', '✓ Budżet usunięty!', 'success');
        updateDashboard();
    }
}

// ===== REPORTS =====
function generateReport() {
    const period = parseInt(document.getElementById('reportPeriod').value) || 12;
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - period);

    const relevantTransactions = transactions.filter(t => new Date(t.date) >= fromDate);

    const income = relevantTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = relevantTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    // Group by category
    const incomeByCategory = {};
    const expenseByCategory = {};

    relevantTransactions.forEach(t => {
        if (t.type === 'income') {
            incomeByCategory[t.categoryName] = (incomeByCategory[t.categoryName] || 0) + t.amount;
        } else {
            expenseByCategory[t.categoryName] = (expenseByCategory[t.categoryName] || 0) + t.amount;
        }
    });

    let html = `
        <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
            <h3>Podsumowanie Raportu</h3>
            <p>Okres: ostatnie ${period} ${period === 1 ? 'miesiąc' : period <= 4 ? 'miesiące' : 'miesięcy'}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #28a745;">
                    <strong>Przychody</strong><br>
                    <span style="font-size: 1.5em; color: #28a745;">${formatCurrency(income)}</span>
                </div>
                <div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #dc3545;">
                    <strong>Wydatki</strong><br>
                    <span style="font-size: 1.5em; color: #dc3545;">${formatCurrency(expenses)}</span>
                </div>
                <div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid ${balance >= 0 ? '#17a2b8' : '#dc3545'};">
                    <strong>Bilans</strong><br>
                    <span style="font-size: 1.5em; color: ${balance >= 0 ? '#17a2b8' : '#dc3545'};">${formatCurrency(balance)}</span>
                </div>
            </div>
        </div>
    `;

    // Income details
    if (Object.keys(incomeByCategory).length > 0) {
        html += '<h4 style="margin-top: 20px;">Przychody po Kategoriach</h4>';
        html += '<table style="width: 100%; margin-top: 10px;"><thead><tr><th style="text-align: left;">Kategoria</th><th style="text-align: right;">Kwota</th><th style="text-align: right;">% udziału</th></tr></thead><tbody>';
        Object.entries(incomeByCategory).forEach(([cat, amt]) => {
            const percentage = (amt / income * 100).toFixed(1);
            html += `<tr><td>${cat}</td><td style="text-align: right;">${formatCurrency(amt)}</td><td style="text-align: right;">${percentage}%</td></tr>`;
        });
        html += '</tbody></table>';
    }

    // Expense details
    if (Object.keys(expenseByCategory).length > 0) {
        html += '<h4 style="margin-top: 20px;">Wydatki po Kategoriach</h4>';
        html += '<table style="width: 100%; margin-top: 10px;"><thead><tr><th style="text-align: left;">Kategoria</th><th style="text-align: right;">Kwota</th><th style="text-align: right;">% udziału</th></tr></thead><tbody>';
        Object.entries(expenseByCategory).forEach(([cat, amt]) => {
            const percentage = (amt / expenses * 100).toFixed(1);
            html += `<tr><td>${cat}</td><td style="text-align: right;">${formatCurrency(amt)}</td><td style="text-align: right;">${percentage}%</td></tr>`;
        });
        html += '</tbody></table>';
    }

    document.getElementById('reportContent').innerHTML = html;
}

// ===== EXPORT / IMPORT =====
function downloadCSV() {
    const headers = ['Data', 'Typ', 'Kategoria', 'Kwota', 'Opis', 'Okresowość', 'Notatki'];
    const rows = transactions.map(t => [
        t.date,
        t.type,
        t.categoryName,
        t.amount,
        t.description,
        t.periodicity,
        t.notes
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budżet_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showAlert('settingsAlert', '✓ Plik CSV pobrany!', 'success');
}

function exportToCSV() {
    downloadCSV();
}

function exportToPDF() {
    // Simple PDF generation
    const period = parseInt(document.getElementById('reportPeriod').value) || 12;
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - period);

    const relevantTransactions = transactions.filter(t => new Date(t.date) >= fromDate);

    const income = relevantTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = relevantTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    let content = `RAPORT BUDŻETU DOMOWEGO\n`;
    content += `Data wygenerowania: ${new Date().toLocaleDateString('pl-PL')}\n`;
    content += `Okres: ostatnie ${period} ${period === 1 ? 'miesiąc' : period <= 4 ? 'miesiące' : 'miesięcy'}\n`;
    content += `\n===============================================\n\n`;
    content += `PODSUMOWANIE:\n`;
    content += `Przychody: ${formatCurrency(income)}\n`;
    content += `Wydatki:  ${formatCurrency(expenses)}\n`;
    content += `Bilans:   ${formatCurrency(balance)}\n`;
    content += `\n===============================================\n\n`;
    content += `SZCZEGÓŁY TRANSAKCJI:\n\n`;

    relevantTransactions.forEach(t => {
        content += `Data: ${t.date}\n`;
        content += `Typ: ${t.type === 'income' ? 'Przychód' : 'Wydatek'}\n`;
        content += `Kategoria: ${t.categoryName}\n`;
        content += `Kwota: ${formatCurrency(t.amount)}\n`;
        content += `Opis: ${t.description || '-'}\n`;
        content += `Okresowość: ${getPeriodLabel(t.periodicity)}\n`;
        content += `---\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budżet_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    showAlert('reportsAlert', '✓ Plik PDF (jako TXT) pobrany!', 'success');
}

function importCSV() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) {
        showAlert('settingsAlert', '❌ Wybierz plik CSV!', 'danger');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());

            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '') continue;

                const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                const transaction = {
                    id: Date.now() + i,
                    date: values[0],
                    type: values[1],
                    categoryName: values[2],
                    amount: parseFloat(values[3]),
                    description: values[4],
                    periodicity: values[5],
                    notes: values[6],
                    categoryId: 0,
                    createdAt: new Date().toISOString()
                };

                // Find category ID
                const cat = categories.find(c => c.name === transaction.categoryName);
                if (cat) {
                    transaction.categoryId = cat.id;
                    transactions.push(transaction);
                }
            }

            saveData();
            document.getElementById('csvFile').value = '';
            displayTransactions();
            updateDashboard();
            showAlert('settingsAlert', '✓ Dane zaimportowane pomyślnie!', 'success');
        } catch (error) {
            showAlert('settingsAlert', '❌ Błąd przy imporcie: ' + error.message, 'danger');
        }
    };
    reader.readAsText(file);
}

function resetAllData() {
    if (confirm('⚠️ Czy na PEWNO chcesz usunąć WSZYSTKIE dane? Tej operacji nie można cofnąć!')) {
        if (confirm('Ostatnie potwierdzenie - usunąć wszystkie dane?')) {
            localStorage.clear();
            categories = defaultCategories;
            transactions = [];
            budgets = [];
            saveData();
            loadData();
            updateDashboard();
            displayCategories();
            displayBudgets();
            displayTransactions();
            showAlert('settingsAlert', '✓ Wszystkie dane usunięte!', 'success');
        }
    }
}

// Initialize on load
window.addEventListener('load', function() {
    displayBudgetCategories();
    filterTransactions();
    updateDashboard();
});
