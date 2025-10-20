import './style.css'
import { Game } from './components/Game'

const app = document.querySelector<HTMLDivElement>('#app')!;
// Inicializar el juego
new Game(app);
