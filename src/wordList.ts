export const WORDS = [
  'TYPESCRIPT',
  'JAVASCRIPT',
  'PROGRAMAR',
  'DESARROLLO',
  'COMPUTADORA',
  'TECLADO',
  'PANTALLA',
  'ALGORITMO',
  'VARIABLE',
  'FUNCION',
  'COMPONENTE',
  'INTERFAZ',
  'MODULO',
  'CLASE',
  'OBJETO',
  'ARREGLO',
  'CADENA',
  'NUMERO',
  'BOOLEANO',
  'METODO',
  'PROPIEDAD',
  'HERENCIA',
  'POLIMORFISMO',
  'ENCAPSULAMIENTO',
  'ABSTRACCION',
  'RECURSION',
  'ITERACION',
  'CONDICIONAL',
  'BUCLE',
  'EVENTO'
];

export const getRandomWord = (): string => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};
