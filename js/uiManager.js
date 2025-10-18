import { players, transactions } from "./gameState.js";
import { getPlayer } from "./playerManager.js";

// Обновляет список игроков в DOM
function updatePlayerSelects() {
  const playerSelect = document.getElementById("player");
  const targetPlayerSelect = document.getElementById("targetPlayer");

  if (playerSelect) {
    playerSelect.innerHTML = '<option value="">-- Выберите игрока --</option>';
    players.forEach((player) => {
      if (player.isActive) {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = `${player.name} (${formatMoney(player.balance)})`;
        playerSelect.appendChild(option);
      }
    });
  }

  if (targetPlayerSelect) {
    targetPlayerSelect.innerHTML = '<option value="">-- Выберите игрока --</option>';
    players.forEach((player) => {
      if (player.isActive && player.id !== parseInt(playerSelect?.value)) {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = `${player.name} (${formatMoney(player.balance)})`;
        targetPlayerSelect.appendChild(option);
      }
    });
  }
}

// Обновляет отображение балансов
function updateBalanceList() {
  let balanceList = document.getElementById("balanceList");
  if (balanceList) {
    balanceList.textContent = "";
  }

  for (let i = 0; i < players.length; i++) {
    let balanceItem = document.createElement("p");
    balanceItem.textContent = `Игрок: ${players[i].name}, Баланс: ${formatMoney(players[i].balance)}`;
    
    if (players[i].balance > 0) {
      balanceItem.classList.add("positive");
    } else if (players[i].balance < 0) {
      balanceItem.classList.add("negative");
    }
    if (!players[i].isActive) {
      balanceItem.classList.add("eliminated");
      balanceItem.textContent += " (БАНКРОТ)";
    }
    balanceList.append(balanceItem);
  }
  updatePlayerSelects();
}

// Обновляет историю транзакций
function updateTransactionHistory() {
  const historyContainer = document.getElementById("transactionHistory");
  if (!historyContainer) return;
  historyContainer.innerHTML = "";

  if (transactions.length === 0) {
    const emptyStory = document.createElement("p");
    emptyStory.textContent = "история пуста";
    historyContainer.append(emptyStory);
  } else {
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const player = getPlayer(transaction.playerId);
      const playerName = player ? player.name : "Неизвестный";

      let sign = "";
      let description = transaction.description;
      
      if (transaction.type === "income") sign = '+';
      if (transaction.type === "expense") sign = '-';
      if (transaction.type === "transfer") {
        sign = '⇄';
        const targetPlayer = getPlayer(transaction.targetPlayerId);
        const targetName = targetPlayer ? targetPlayer.name : "Неизвестный";
        description = `Перевод игроку ${targetName}`;
      }

      const date = new Date(transaction.date).toLocaleString();

      const historyItem = document.createElement("div");
      historyItem.classList.add("history-item");
      historyItem.classList.add(`transaction-${transaction.type}`);

      historyItem.innerHTML = `
        <div class="transaction-amount ${transaction.type}">
          [${sign}${formatMoney(transaction.amount)}]
        </div>
        <div class="player-name">${playerName}</div>
        <div class="history-description">${description}</div>
        <div class="history-date">${date}</div>
      `;

      historyContainer.append(historyItem);
    }
  }
}

// Очищает поля ввода после операций
function clearInputFields() {
  const playerNameInput = document.getElementById("playerName");
  if (playerNameInput) playerNameInput.value = "";

  const millionsInput = document.getElementById("millions");
  if (millionsInput) millionsInput.value = "0";

  const thousandsInput = document.getElementById("thousands");
  if (thousandsInput) thousandsInput.value = "0";

  const descriptionInput = document.getElementById("transactionDescription");
  if (descriptionInput) descriptionInput.value = "";
}

function formatMoney(amount) {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount;
}

function updatePlayersList() {
  let playersList = document.getElementById("playersList");
  if (playersList) {
    playersList.textContent = "";
  }

  for (let i = 0; i < players.length; i++) {
    let playersItem = document.createElement("p");
    let status = players[i].isActive ? "Активен" : "БАНКРОТ";
    playersItem.textContent = `Имя: ${players[i].name} (${status})`;
    if (!players[i].isActive) {
      playersItem.classList.add("eliminated");
    }
    playersList.append(playersItem);
  }
  updatePlayerSelects();
}

export {
  updatePlayersList, 
  updateBalanceList,
  updateTransactionHistory,
  clearInputFields,
  updatePlayerSelects,
  formatMoney,
};