export interface GameState {
  word: string;
  guessedLetters: string[];
  incorrectGuesses: number;
  maxIncorrectGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  currentStreak: number;
  maxStreak: number;
}
