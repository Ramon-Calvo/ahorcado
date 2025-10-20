import type { GameStats } from '../types';

export class Stats {
  private element: HTMLElement;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'stats';
    parent.appendChild(this.element);
  }

  render(stats: GameStats): void {
    const winRate = stats.gamesPlayed > 0 
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
      : 0;

    this.element.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${stats.gamesPlayed}</div>
          <div class="stat-label">Jugados</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${winRate}%</div>
          <div class="stat-label">Victorias</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.currentStreak}</div>
          <div class="stat-label">Racha</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.maxStreak}</div>
          <div class="stat-label">Mejor Racha</div>
        </div>
      </div>
    `;
  }

  destroy(): void {
    this.element.remove();
  }
}
