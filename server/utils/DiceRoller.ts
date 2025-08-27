// Returns a random integer between min and max (inclusive)
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Dice roller (e.g., roll a 6-sided die)
export function rollDie(sides: number = 6): number {
  if (sides < 1) throw new Error('Dice must have at least 1 side');
  return getRandomInt(1, sides);
}

// Roll multiple dice
export function rollDice(count: number, sides: number = 6): number[] {
  return Array.from({ length: count }, () => rollDie(sides));
}

export function sumDice(count: number, sides: number = 6): number {
  return rollDice(count, sides).reduce((sum, val) => sum + val, 0);
}

export function stripPrefix(expr: string): string {
  const trimmed = expr.trim();
  return trimmed.slice(2).trim();
}

export function parseDiceExpression(expr: string): number {
  const diceExpr = stripPrefix(expr);

  // Regex matches terms like +3d6, -2d8, +5, -1d4, etc.
  const termRegex = /([+-]?)(\d*)d(\d+)|([+-]?\d+)/gi;
  let total = 0;

  let match: RegExpExecArray | null;
  while ((match = termRegex.exec(diceExpr)) !== null) {
    if (match[3]) {
      // It's a dice term: [sign][count]d[sides]
      const sign = match[1] === '-' ? -1 : 1;
      const count = match[2] ? parseInt(match[2], 10) : 1; // default "d6" means "1d6"
      const sides = parseInt(match[3], 10);
      total += sign * sumDice(count, sides);
    } else if (match[4]) {
      // It's a flat number: +3 or -7
      total += parseInt(match[4], 10);
    }
  }

  return total;
}

export function isValidDiceExpression(expr: string): boolean {
  // Allow terms like 3d6, d20, -2d8, +5, -1, etc.
  const valid = /^([+-]?\d*d\d+|[+-]?\d+)(\s*[+-]\s*(\d*d\d+|\d+))*$/i;
  return valid.test(expr);
}

export function isValidDiceRollCommand(expr: string): boolean {
  // Trim and normalize whitespace
  const trimmed = expr.trim();

  // Check prefix
  if (!trimmed.startsWith('/r')) {
    return false;
  }

  // Strip the "/r" and any extra spaces
  const diceExpr = trimmed.slice(2).trim();

  if (!isValidDiceExpression(diceExpr)) {
    return false;
  }

  return true;
}

// console.log('Result:', parseDiceExpression('/r 3d6+2d8-1d4+3'));
