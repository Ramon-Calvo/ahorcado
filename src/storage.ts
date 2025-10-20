import type { GameState, GameStats } from './types';

const GAME_STATE_KEY = 'hangman_game_state';
const GAME_STATS_KEY = 'hangman_game_stats';

export class StorageManager {
  static saveGameState(state: GameState): void {
    try {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  static loadGameState(): GameState | null {
    try {
      const data = localStorage.getItem(GAME_STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading game state:', error);
      return null;
    }
  }

  static clearGameState(): void {
    try {
      localStorage.removeItem(GAME_STATE_KEY);
    } catch (error) {
      console.error('Error clearing game state:', error);
    }
  }

  static saveGameStats(stats: GameStats): void {
    try {
      localStorage.setItem(GAME_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  }

  static loadGameStats(): GameStats {
    try {
      const data = localStorage.getItem(GAME_STATS_KEY);
      return data ? JSON.parse(data) : {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        currentStreak: 0,
        maxStreak: 0
      };
    } catch (error) {
      console.error('Error loading game stats:', error);
      return {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        currentStreak: 0,
        maxStreak: 0
      };
    }
  }
}
