export class HangmanImage {
  private element: HTMLImageElement;
  private maxImages: number;

  constructor(parent: HTMLElement, maxImages: number = 6) {
    this.element = document.createElement('img');
    this.element.className = 'hangman-image';
    this.maxImages = maxImages;
    this.updateImage(0);
    parent.appendChild(this.element);
  }

  updateImage(incorrectGuesses: number): void {
    if (incorrectGuesses === 0) {
      this.element.style.opacity = '0';
      this.element.src = '';
    } else {
      const imageNumber = Math.min(incorrectGuesses, this.maxImages);
      this.element.src = `./images/ahorcado${imageNumber}.png`;
      this.element.style.opacity = '1';
      this.element.alt = `Ahorcado - ${imageNumber} errores`;
    }
  }

  destroy(): void {
    this.element.remove();
  }
}
