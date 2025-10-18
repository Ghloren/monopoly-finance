import {
  players,
  transactions,
  nextPlayerId,
  nextTransactionId,
} from "./gameState.js";

const STORAGE_KEY = "monopoly-game-data";

// Сохраняем текущее состояние
function saveGame() {
  const playersObj = {
    players: players,
    transactions: transactions,
    nextPlayerId: nextPlayerId,
    nextTransactionId: nextTransactionId,
  };

  let gameData = JSON.stringify(playersObj);
  try {
    gameData = localStorage.setItem(STORAGE_KEY, gameData);
    return true;
  } catch (error) {
    return `Произошла ошибка ${error}`;
  }
}

// Загрузка сохраненной игры
function loadGame() {
  try {
    let loadingGame = localStorage.getItem(STORAGE_KEY);
    if (loadingGame) {
      let retData = JSON.parse(loadingGame);
      return retData;
    } else {
      return null;
    }
  } catch (error) {
    return `Произошла ошибка ${error}`;
  }
}

// Очистка сохраненных данных

function clearGame() {
  try {
    let remGame = localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    return `Произошла ошибка ${error}`;
  }
}

export { saveGame, loadGame, clearGame };
