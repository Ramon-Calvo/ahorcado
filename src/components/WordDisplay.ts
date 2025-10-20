export class WordDisplay {
  private element: HTMLElement;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'word-display';
    parent.appendChild(this.element);
  }

  render(word: string, guessedLetters: string[]): void {
    this.element.innerHTML = '';
    
    for (const letter of word) {
      const letterBox = document.createElement('div');
      letterBox.className = 'letter-box';
      letterBox.textContent = guessedLetters.includes(letter) ? letter : '';
      this.element.appendChild(letterBox);
    }
  }

  destroy(): void {
    this.element.remove();
  }
}
