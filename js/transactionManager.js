import {
  transactions,
  createTransaction,
  TRANSACTION_TYPES,
  DEBT_LIMIT,
} from "./gameState.js";
import {
  updatePlayerBalance,
  checkBankruptcy,
  getPlayer,
} from "./playerManager.js";

// Добавить транзакцию
function addTransaction(type, playerId, amount, description) {
  const player = getPlayer(playerId);
  if (player && player.isActive) {
    let createTrans = createTransaction(type, playerId, amount, description);
    transactions.push(createTrans);
    updatePlayerBalance(playerId, amount);
    return createTrans;
  }
  return false;
}

// Перевод между игроками
function transferMoney(fromPlayerId, toPlayerId, amount) {
  let fromPlayer = getPlayer(fromPlayerId);
  let toPlayer = getPlayer(toPlayerId);

  if (fromPlayer && toPlayer && fromPlayer.isActive && toPlayer.isActive) {
    // Проверяем что после перевода баланс не станет МЕНЬШЕ -5M
    if (fromPlayer.balance - amount >= DEBT_LIMIT) {
      const transferTrans = createTransaction(
        TRANSACTION_TYPES.TRANSFER,
        fromPlayerId,
        amount,
        "Перевод игроку",
        toPlayerId
      );
      transactions.push(transferTrans);
      updatePlayerBalance(fromPlayerId, -amount);
      updatePlayerBalance(toPlayerId, +amount);
      return transferTrans;
    } else {
      alert("Недостаточно средств для перевода! Игрок станет банкротом.");
      return false;
    }
  } else {
    alert("Один из игроков неактивен или не найден!");
    return false;
  }
}

// Преобразование миллионов и тысяч в общую сумму
function calculateTotalAmount(millions, thousands) {
  if (typeof millions === "number" && typeof thousands === "number") {
    let milThousSum = millions * 1000000 + thousands * 1000;
    return milThousSum;
  } else {
    return 0;
  }
}

function handleFieldInteraction(playerId, amount, description) {
  const player = getPlayer(playerId);
  if (player && player.isActive) {
    // Проверяем что после операции баланс не станет МЕНЬШЕ -5M
    if (player.balance + amount >= DEBT_LIMIT) {
      const type = amount >= 0 ? "income" : "expense";
      return addTransaction(type, playerId, amount, description);
    } else {
      alert("Операция приведет к банкротству игрока!");
      return false;
    }
  }
  return false;
}

export {
  addTransaction,
  transferMoney,
  calculateTotalAmount,
  handleFieldInteraction,
};
