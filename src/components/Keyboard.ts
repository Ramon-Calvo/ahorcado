export class Keyboard {
  private element: HTMLElement;
  private onLetterClick: (letter: string) => void;
  private buttons: Map<string, HTMLButtonElement> = new Map();

  constructor(parent: HTMLElement, onLetterClick: (letter: string) => void) {
    this.element = document.createElement('div');
    this.element.className = 'keyboard';
    this.onLetterClick = onLetterClick;
    
    this.createKeyboard();
    parent.appendChild(this.element);
  }

  private createKeyboard(): void {
    const rows = [
      'QWERTYUIOP',
      'ASDFGHJKL',
      'ZXCVBNM'
    ];

    rows.forEach(row => {
      const rowElement = document.createElement('div');
      rowElement.className = 'keyboard-row';

      row.split('').forEach(letter => {
        const button = document.createElement('button');
        button.className = 'key';
        button.textContent = letter;
        button.dataset.letter = letter;
        
        button.addEventListener('click', () => {
          if (!button.disabled) {
            this.onLetterClick(letter);
          }
        });

        this.buttons.set(letter, button);
        rowElement.appendChild(button);
      });

      this.element.appendChild(rowElement);
    });
  }

  disableLetter(letter: string): void {
    const button = this.buttons.get(letter);
    if (button) {
      button.disabled = true;
    }
  }

  markCorrect(letter: string): void {
    const button = this.buttons.get(letter);
    if (button) {
      button.classList.add('correct');
      button.disabled = true;
    }
  }

  markIncorrect(letter: string): void {
    const button = this.buttons.get(letter);
    if (button) {
      button.classList.add('incorrect');
      button.disabled = true;
    }
  }

  reset(): void {
    this.buttons.forEach(button => {
      button.disabled = false;
      button.classList.remove('correct', 'incorrect');
    });
  }

  disableAll(): void {
    this.buttons.forEach(button => {
      button.disabled = true;
    });
  }

  destroy(): void {
    this.element.remove();
  }
}
