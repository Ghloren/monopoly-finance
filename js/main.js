import {
  players,
  transactions,
  nextPlayerId,
  nextTransactionId,
  setNextPlayerId,
  setNextTransactionId,
} from "./gameState.js";
import * as playerManager from "./playerManager.js";
import * as transactionManager from "./transactionManager.js";
import * as storageManager from "./storageManager.js";
import * as uiManager from "./uiManager.js";

function init() {
  const savedGame = storageManager.loadGame();

  if (savedGame) {
    const continueGame = confirm("Обнаружена сохраненная игра. Продолжить?");

    if (continueGame) {
      // Восстанавливаем все данные
      players.splice(0, players.length, ...(savedGame.players || []));
      transactions.splice(
        0,
        transactions.length,
        ...(savedGame.transactions || [])
      );
      setNextPlayerId(savedGame.nextPlayerId || 1);
      setNextTransactionId(savedGame.nextTransactionId || 1);
    } else {
      // Начинаем новую игру
      storageManager.clearGame();
    }
  }

  uiManager.updatePlayersList();
  uiManager.updateBalanceList();
  uiManager.updateTransactionHistory();
  setupEventListeners();
  uiManager.updatePlayerSelects();
}

function setupEventListeners() {
  const addPlayerBtn = document.getElementById("addPlayerBtn");
  const addTransactionBtn = document.getElementById("addTransactionBtn");
  const resetGameBtn = document.getElementById("resetGameBtn");

  addPlayerBtn.onclick = function () {
    const nameInput = document.getElementById("playerName");
    const name = nameInput.value.trim();

    if (name) {
      playerManager.addPlayer(name);
      uiManager.updatePlayerSelects();
      storageManager.saveGame();
      uiManager.updatePlayersList();
      uiManager.updateBalanceList();
      uiManager.clearInputFields();
    } else {
      alert("Введите имя игрока");
    }
  };

  addTransactionBtn.onclick = function () {
    const transactionType = document.getElementById("transactionType").value;
    const playerId = document.getElementById("player").value;
    const millions = parseInt(document.getElementById("millions").value) || 0;
    const thousands = parseInt(document.getElementById("thousands").value) || 0;
    const description = document.getElementById("transactionDescription").value;

    if (!playerId) {
      alert("Выберите игрока");
      return;
    }

    const amount = transactionManager.calculateTotalAmount(millions, thousands);

    if (transactionType === "transfer") {
      const targetPlayerId = document.getElementById("targetPlayer").value;
      if (!targetPlayerId) {
        alert("Выберите получателя перевода");
        return;
      }
      transactionManager.transferMoney(
        parseInt(playerId),
        parseInt(targetPlayerId),
        amount
      );
    } else {
      const type = transactionType === "field" ? "expense" : "income";
      transactionManager.addTransaction(
        type,
        parseInt(playerId),
        amount,
        description
      );
    }

    storageManager.saveGame();
    uiManager.updatePlayersList();
    uiManager.updateBalanceList();
    uiManager.updateTransactionHistory();
    uiManager.clearInputFields();
  };

  resetGameBtn.onclick = function () {
    if (confirm("Начать новую игру? Все данные будут потеряны.")) {
      storageManager.clearGame();
      players.splice(0, players.length);
      transactions.splice(0, transactions.length);
      setNextPlayerId(1);
      setNextTransactionId(1);
      uiManager.updatePlayersList();
      uiManager.updateBalanceList();
      uiManager.updateTransactionHistory();
    }
  };

  addTransactionBtn.onclick = function () {
    const transactionType = document.getElementById("transactionType").value;
    const playerId = document.getElementById("player").value;
    const millions = parseInt(document.getElementById("millions").value) || 0;
    const thousands = parseInt(document.getElementById("thousands").value) || 0;
    const description = document.getElementById("transactionDescription").value;

    if (!playerId) {
      alert("Выберите игрока");
      return;
    }

    const amount = transactionManager.calculateTotalAmount(millions, thousands);

    if (transactionType === "transfer") {
      const targetPlayerId = document.getElementById("targetPlayer").value;
      if (!targetPlayerId) {
        alert("Выберите получателя перевода");
        return;
      }
      transactionManager.transferMoney(
        parseInt(playerId),
        parseInt(targetPlayerId),
        amount
      );
    } else {
      // Для взаимодействия с полем - можно и получать и терять деньги
      // Если хотим терять - передаем отрицательную сумму
      const isIncome = confirm("Игрок получает деньги? (Нет - теряет)");
      const finalAmount = isIncome ? amount : -amount;
      transactionManager.addTransaction(
        isIncome ? "income" : "expense",
        parseInt(playerId),
        finalAmount,
        description
      );
    }

    storageManager.saveGame();
    uiManager.updatePlayersList();
    uiManager.updateBalanceList();
    uiManager.updateTransactionHistory();
    uiManager.clearInputFields();
  };

  const transactionTypeSelect = document.getElementById("transactionType");

  if (transactionTypeSelect) {
    transactionTypeSelect.addEventListener("change", function () {
      const targetPlayerGroup = document.getElementById("targetPlayerGroup");
      if (this.value === "transfer") {
        targetPlayerGroup.classList.remove("hidden");
      } else {
        targetPlayerGroup.classList.add("hidden");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
