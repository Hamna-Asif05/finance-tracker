// ---------- Dummy Transactions Data ----------
let transactions = [
    {id:1,type:'income',amount:50000,category:'Salary',date:'2025-11-01',note:'Monthly salary'},
    {id:2,type:'expense',amount:12000,category:'Rent',date:'2025-11-02',note:'Apartment rent'},
    {id:3,type:'expense',amount:8000,category:'Groceries',date:'2025-11-03',note:'Weekly groceries'},
    {id:4,type:'income',amount:15000,category:'Freelance',date:'2025-11-05',note:'Project payment'},
    {id:5,type:'expense',amount:5000,category:'Utilities',date:'2025-11-06',note:'Electricity bill'},
    {id:6,type:'expense',amount:3000,category:'Travel',date:'2025-11-07',note:'Fuel for car'},
];

// ---------- Budget Limits ----------
const budgetLimits = {
    Rent:15000,
    Groceries:10000,
    Utilities:8000,
    Travel:5000
};

// ---------- Dashboard Update ----------
function updateDashboard() {
    const totalIncome = transactions.filter(t=>t.type==='income').reduce((a,b)=>a+b.amount,0);
    const totalExpense = transactions.filter(t=>t.type==='expense').reduce((a,b)=>a+b.amount,0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome ? ((balance/totalIncome)*100).toFixed(2) : 0;

    document.getElementById('totalIncome').innerText = 'PKR ' + totalIncome.toLocaleString();
    document.getElementById('totalExpense').innerText = 'PKR ' + totalExpense.toLocaleString();
    document.getElementById('currentBalance').innerText = 'PKR ' + balance.toLocaleString();
    document.getElementById('savingsRate').innerText = savingsRate + '%';
}

// ---------- Top 5 Expense Categories ----------
function updateTopExpenses() {
    const expenses = transactions.filter(t=>t.type==='expense');
    const categoryMap = {};
    expenses.forEach(e=> categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount);
    const top = Object.entries(categoryMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

    const container = document.getElementById('topExpensesList');
    container.innerHTML = '';
    top.forEach(([cat,amt])=>{
        container.innerHTML += `<div class="d-flex justify-content-between mb-2">
            <span>${cat}</span> <strong>PKR ${amt.toLocaleString()}</strong>
        </div>`;
    });
}

// ---------- Budget Goals Progress Bars ----------
function updateBudgetGoals() {
    const container = document.getElementById('budgetGoalsList');
    container.innerHTML = '';
    for(const [cat,limit] of Object.entries(budgetLimits)) {
        const spent = transactions.filter(t=>t.type==='expense' && t.category===cat).reduce((a,b)=>a+b.amount,0);
        const percentage = Math.min((spent/limit)*100,100).toFixed(0);
        const color = percentage > 100 ? 'bg-danger' : 'bg-success';
        container.innerHTML += `<div class="mb-2"><strong>${cat}</strong> - PKR ${spent.toLocaleString()} / PKR ${limit.toLocaleString()}
            <div class="progress"><div class="progress-bar ${color}" role="progressbar" style="width:${percentage}%"></div></div></div>`;
    }
}

// ---------- Transaction Table ----------
function updateTable() {
    const tbody = document.getElementById('transactionBody');
    const typeFilter = document.getElementById('filterType').value;
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    tbody.innerHTML = '';

    transactions.filter(t=>{
        const matchType = typeFilter==='all' || t.type===typeFilter;
        const matchSearch = t.category.toLowerCase().includes(searchValue) || t.note.toLowerCase().includes(searchValue);
        return matchType && matchSearch;
    }).forEach(t=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${t.amount.toLocaleString()}</td>
                        <td>${t.type}</td>
                        <td>${t.category}</td>
                        <td>${t.date}</td>
                        <td>${t.note}</td>
                        <td><button class="btn btn-sm btn-danger" onclick="deleteTransaction(${t.id})">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}

// ---------- Delete Transaction ----------
function deleteTransaction(id) {
    transactions = transactions.filter(t=>t.id !== id);
    updateAll();
}

// ---------- Update All ----------
function updateAll() {
    updateDashboard();
    updateTopExpenses();
    updateBudgetGoals();
    updateTable();
}

// ---------- Event Listeners ----------
document.getElementById('filterType').addEventListener('change', updateAll);
document.getElementById('searchInput').addEventListener('input', updateAll);

// ---------- Initialize ----------
window.addEventListener('load', updateAll);