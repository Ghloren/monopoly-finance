// Константы
const STARTING_BALANCE = 15000000;
const DEBT_LIMIT = -5000000;

// Начальное состояние
let players = [];
let transactions = [];
let nextPlayerId = 1;
let nextTransactionId = 1;

const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
  TRANSFER: "transfer",
};

// Функции для работы с состоянием
function createPlayer(name) {
  return {
    id: nextPlayerId++,
    name: name,
    balance: STARTING_BALANCE,
    isActive: true,
  };
}

function createTransaction(
  type,
  playerId,
  amount,
  description,
  targetPlayerId = null
) {
  return {
    id: nextTransactionId++,
    type: type,
    playerId: playerId,
    amount: amount,
    description: description,
    date: new Date().toISOString(),
    targetPlayerId: targetPlayerId,
  };
}

function setNextPlayerId(id) {
  nextPlayerId = id;
}

function setNextTransactionId(id) {
  nextTransactionId = id;
}

export {
  STARTING_BALANCE,
  DEBT_LIMIT,
  TRANSACTION_TYPES,
  players,
  transactions,
  nextPlayerId,
  nextTransactionId,
  createPlayer,
  createTransaction,
  setNextPlayerId,
  setNextTransactionId,
};
