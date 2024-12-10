/* 
  Utility dice rolling functions 
*/
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function rollD10(): number {
  return getRandomInt(10) + 1;
}

export function rollsCrit(): boolean {
  return rollD10() === 1;
}
