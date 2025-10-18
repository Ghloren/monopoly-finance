import { players, createPlayer, DEBT_LIMIT } from "./gameState.js";

// Добавление игрока
function addPlayer(name) {
  const newPlayer = createPlayer(name);
  players.push(newPlayer);
  return newPlayer;
}

// Поиск игрока по ID
function getPlayer(id) {
  return players.find((player) => player.id === id);
}

// Изменение баланса
function updatePlayerBalance(playerId, amount) {
  let player = getPlayer(playerId);
  if (player && player.isActive) {
    player.balance += amount;
    // Проверяем банкротство ПОСЛЕ изменения баланса
    checkBankruptcy(playerId);
  }
}

// Проверка банкротства
function checkBankruptcy(playerId) {
  let player = getPlayer(playerId);
  if (player) {
    if (player.balance <= DEBT_LIMIT) {
      player.isActive = false;
      return true;
    }
  }
  return false;
}

export { addPlayer, getPlayer, updatePlayerBalance, checkBankruptcy };
