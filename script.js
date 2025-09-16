console.log("loaded");

//initial transactions
const transactions = [
  {
    id: 1,
    title: "Weekly Groceries Shop",
    category: "Groceries",
    amount: 75.5,
    timestamp: "2025-09-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Dinner with friends",
    category: "Dining Out",
    amount: 45.25,
    timestamp: "2025-09-14T19:45:00Z",
  },
  {
    id: 3,
    title: "Monthly Bus Pass",
    category: "Transportation",
    amount: 15.0,
    timestamp: "2025-09-13T08:15:00Z",
  },
  {
    id: 4,
    title: "Electricity Bill",
    category: "Utilities",
    amount: 120.0,
    timestamp: "2025-09-12T14:00:00Z",
  },
  {
    id: 5,
    title: "New pair of shoes",
    category: "Shopping",
    amount: 90.75,
    timestamp: "2025-09-11T16:20:00Z",
  },
  {
    id: 6,
    title: "Movie tickets",
    category: "Entertainment",
    amount: 30.0,
    timestamp: "2025-09-10T21:00:00Z",
  },
  {
    id: 7,
    title: "Pharmacy visit",
    category: "Health",
    amount: 55.0,
    timestamp: "2025-09-09T11:55:00Z",
  },
  {
    id: 8,
    title: "Streaming service subscription",
    category: "Subscriptions",
    amount: 9.99,
    timestamp: "2025-09-08T09:00:00Z",
  },
  {
    id: 9,
    title: "Weekend getaway",
    category: "Travel",
    amount: 250.0,
    timestamp: "2025-09-07T13:30:00Z",
  },
  {
    id: 10,
    title: "Gift for a friend",
    category: "Miscellaneous",
    amount: 25.5,
    timestamp: "2025-09-06T18:40:00Z",
  },
];

const totalsByCategory = () =>
  transactions.reduce((acc, transaction) => {
    const existingCategory = acc.find(
      (item) => item.category === transaction.category
    );
    if (existingCategory) {
      existingCategory.total += transaction.amount;
    } else {
      acc.push({ category: transaction.category, total: transaction.amount });
    }
    return acc;
  }, []);

const categories = [
  {
    name: "Groceries",
    color: "#7CB98C",
  },
  {
    name: "Transportation",
    color: "#5B7484",
  },
  {
    name: "Dining Out",
    color: "#974F6B",
  },
  {
    name: "Utilities",
    color: "#478089",
  },
  {
    name: "Shopping",
    color: "#8488B2",
  },
  {
    name: "Entertainment",
    color: "#74627E",
  },
  {
    name: "Health",
    color: "#A29A88",
  },
  {
    name: "Subscriptions",
    color: "#6B7D8A",
  },
  {
    name: "Travel",
    color: "#4C688D",
  },
  {
    name: "Miscellaneous",
    color: "#978F94",
  },
];

function getColorByCategory(cat) {
  return categories.find((c) => c.name === cat).color || "#000";
}

//Elements
const form = el("expenseForm");
const selectCategory = el("categoryOptions");

function renderTransactions() {
  const listContainer = el("transactionList");
  listContainer.innerHTML = "";

  if (!transactions.length) {
    const li = document.createElement("li");
    li.className = "empty";

    li.innerHTML = `Transaction is empty`;
    listContainer.appendChild(li);
  } else {
    transactions.forEach((item) => {
      const li = document.createElement("li");
      li.className = "expense-item";

      li.innerHTML = `
    
        <div class="item-detail">
            <span class="item-category" style="background:${getColorByCategory(
              item.category
            )}">${item.category}</span>
            <span class="item-title">${item.title}</span>
    
        </div>
        <div class="item-detail2">
            <span class="item-date">${formatDate(item.timestamp)}</span>
            <span class="item-amount">${formatCurrency(item.amount)}</span>
        </div>
      `;
      listContainer.appendChild(li);
    });
  }
}

function renderTransactionCategory() {
  const listContainer = el("expenseByCategory");
  const totalContainer = el("total");
  listContainer.innerHTML = "";
  const total = totalsByCategory();
  const allTotal = total.reduce(
    (acc, transaction) => acc + transaction.total,
    0
  );

  totalContainer.textContent = formatCurrency(allTotal);

  total.forEach((item) => {
    const li = document.createElement("li");
    li.className = "category-item";

    li.innerHTML = `
        <span class="category-title" style="color:${getColorByCategory(
          item.category
        )}">${item.category}</span>
        <span class="item-amount">${formatCurrency(item.total)}</span>
      `;
    listContainer.appendChild(li);
  });
}

function updateUI() {
  renderTransactions();
  renderTransactionCategory();
}

function init() {
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    selectCategory.appendChild(option);
  });
  updateUI();
}

function addTransaction(data) {
  const { amount, name, category } = data;
  const newData = {
    id: transactions.length + 1,
    title: name,
    category,
    amount: parseFloat(amount),
    timestamp: new Date(),
  };
  transactions.push(newData);
  updateUI();
}

function validateForm(data) {
  const { amount, name, category } = data;

  if (!name.trim()) {
    showError("Transaction name cannot be empty");
    return false;
  }

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    showError("Invalid amount");
    return false;
  }

  if (!category) {
    showError("Please select expense category");
    return false;
  }
  clearError();
  return true;
}

function showError(text) {
  toggleShowElement("errorMessage", true, text);
}

function clearError() {
  toggleShowElement("errorMessage", false);
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent page reload
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  if (validateForm(data)) {
    addTransaction(data);
    form.reset();
  }
});

init();

/**
 * helper to get element by id
 * @param {string} id
 */
function el(id) {
  return document.getElementById(id);
}

/**
 * Toggle Show Element
 * @param {string} id
 * @param {boolean} show
 * @param {string} textContent
 */

function toggleShowElement(id, show, textContent = null) {
  const el = document.getElementById(id);
  el.style.display = show ? "block" : "none";

  if (textContent !== null) {
    el.textContent = textContent;
  }
}

/**
 * Format number as currency
 * @param {number} amount
 * @returns {string}
 */

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/**
 * Format date as year:numeric, month:short, day:numeric
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
