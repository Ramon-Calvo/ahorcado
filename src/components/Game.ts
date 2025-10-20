import type { GameState, GameStats } from '../types';
import { getRandomWord } from '../wordList';
import { StorageManager } from '../storage';
import { WordDisplay } from './WordDisplay';
import { Keyboard } from './Keyboard';
import { HangmanImage } from './HangmanImage';
import { Stats } from './Stats';

export class Game {
  private container: HTMLElement;
  private state: GameState;
  private stats: GameStats;
  
  private wordDisplay!: WordDisplay;
  private keyboard!: Keyboard;
  private hangmanImage!: HangmanImage;
  private statsDisplay!: Stats;
  private messageElement!: HTMLElement;
  private newGameButton!: HTMLButtonElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.stats = StorageManager.loadGameStats();
    
    const savedState = StorageManager.loadGameState();
    if (savedState && savedState.gameStatus === 'playing') {
      this.state = savedState;
    } else {
      this.state = this.createNewGameState();
    }

    this.init();
  }

  private createNewGameState(): GameState {
    return {
      word: getRandomWord(),
      guessedLetters: [],
      incorrectGuesses: 0,
      maxIncorrectGuesses: 6,
      gameStatus: 'playing'
    };
  }

  private init(): void {
    this.container.innerHTML = '';
    this.container.className = 'game-container';

    // Título
    const title = document.createElement('h1');
    title.textContent = 'AHORCADO';
    title.className = 'game-title';
    this.container.appendChild(title);

    // Área de contenido principal
    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';
    this.container.appendChild(contentArea);

    // Sección superior: Stats e Imagen lado a lado
    const topSection = document.createElement('div');
    topSection.className = 'top-section';
    contentArea.appendChild(topSection);

    // Contenedor de estadísticas
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';
    topSection.appendChild(statsContainer);
    this.statsDisplay = new Stats(statsContainer);
    this.statsDisplay.render(this.stats);

    // Wrapper para imagen y botón
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';
    topSection.appendChild(imageWrapper);

    // Contenedor de imagen
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageWrapper.appendChild(imageContainer);
    this.hangmanImage = new HangmanImage(imageContainer, this.state.maxIncorrectGuesses);
    this.hangmanImage.updateImage(this.state.incorrectGuesses);

    // Botón nuevo juego
    this.newGameButton = document.createElement('button');
    this.newGameButton.textContent = 'Nuevo Juego';
    this.newGameButton.className = 'new-game-button';
    this.newGameButton.addEventListener('click', () => this.startNewGame());
    imageWrapper.appendChild(this.newGameButton);

    // Contenido principal - Mensaje y Palabra
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    contentArea.appendChild(mainContent);

    // Mensaje de estado
    this.messageElement = document.createElement('div');
    this.messageElement.className = 'message';
    mainContent.appendChild(this.messageElement);

    // Contenedor de palabra
    const wordContainer = document.createElement('div');
    wordContainer.className = 'word-container';
    mainContent.appendChild(wordContainer);
    this.wordDisplay = new WordDisplay(wordContainer);
    this.wordDisplay.render(this.state.word, this.state.guessedLetters);

    // Teclado al final
    const keyboardContainer = document.createElement('div');
    keyboardContainer.className = 'keyboard-container';
    contentArea.appendChild(keyboardContainer);
    this.keyboard = new Keyboard(keyboardContainer, (letter) => this.handleLetterGuess(letter));

    // Restaurar estado del teclado si es un juego guardado
    if (this.state.guessedLetters.length > 0) {
      this.restoreKeyboardState();
    }

    // Actualizar UI si el juego ya terminó
    if (this.state.gameStatus !== 'playing') {
      this.updateGameOver();
    }

    // Event listener para teclas físicas
    this.setupKeyboardListener();
  }

  private restoreKeyboardState(): void {
    this.state.guessedLetters.forEach(letter => {
      if (this.state.word.includes(letter)) {
        this.keyboard.markCorrect(letter);
      } else {
        this.keyboard.markIncorrect(letter);
      }
    });
  }

  private setupKeyboardListener(): void {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (this.state.gameStatus !== 'playing') return;

      const letter = event.key.toUpperCase();
      if (/^[A-Z]$/.test(letter) && !this.state.guessedLetters.includes(letter)) {
        this.handleLetterGuess(letter);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
  }

  private handleLetterGuess(letter: string): void {
    if (this.state.gameStatus !== 'playing') return;
    if (this.state.guessedLetters.includes(letter)) return;

    this.state.guessedLetters.push(letter);

    if (this.state.word.includes(letter)) {
      // Letra correcta
      this.keyboard.markCorrect(letter);
      this.wordDisplay.render(this.state.word, this.state.guessedLetters);
      
      // Verificar si ganó
      if (this.checkWin()) {
        this.state.gameStatus = 'won';
        this.updateStats(true);
        this.updateGameOver();
      }
    } else {
      // Letra incorrecta
      this.keyboard.markIncorrect(letter);
      this.state.incorrectGuesses++;
      this.hangmanImage.updateImage(this.state.incorrectGuesses);

      // Verificar si perdió
      if (this.state.incorrectGuesses >= this.state.maxIncorrectGuesses) {
        this.state.gameStatus = 'lost';
        this.updateStats(false);
        this.updateGameOver();
      }
    }

    // Guardar estado
    StorageManager.saveGameState(this.state);
  }

  private checkWin(): boolean {
    return this.state.word.split('').every(letter => 
      this.state.guessedLetters.includes(letter)
    );
  }

  private updateStats(won: boolean): void {
    this.stats.gamesPlayed++;
    
    if (won) {
      this.stats.gamesWon++;
      this.stats.currentStreak++;
      if (this.stats.currentStreak > this.stats.maxStreak) {
        this.stats.maxStreak = this.stats.currentStreak;
      }
    } else {
      this.stats.gamesLost++;
      this.stats.currentStreak = 0;
    }

    StorageManager.saveGameStats(this.stats);
    this.statsDisplay.render(this.stats);
  }

  private updateGameOver(): void {
    this.keyboard.disableAll();

    if (this.state.gameStatus === 'won') {
      this.messageElement.textContent = '¡Felicitaciones! Has ganado';
      this.messageElement.className = 'message win';
    } else if (this.state.gameStatus === 'lost') {
      this.messageElement.textContent = `Perdiste. La palabra era: ${this.state.word}`;
      this.messageElement.className = 'message lose';
      // Mostrar la palabra completa
      this.wordDisplay.render(this.state.word, this.state.word.split(''));
    }

    this.newGameButton.classList.add('highlight');
  }

  private startNewGame(): void {
    this.state = this.createNewGameState();
    StorageManager.saveGameState(this.state);
    
    // Reiniciar componentes
    this.wordDisplay.render(this.state.word, this.state.guessedLetters);
    this.keyboard.reset();
    this.hangmanImage.updateImage(0);
    this.messageElement.textContent = '';
    this.messageElement.className = 'message';
    this.newGameButton.classList.remove('highlight');
  }

  destroy(): void {
    this.wordDisplay?.destroy();
    this.keyboard?.destroy();
    this.hangmanImage?.destroy();
    this.statsDisplay?.destroy();
  }
}
