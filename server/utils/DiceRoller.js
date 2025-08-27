// Returns a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Dice roller (e.g., roll a 6-sided die)
function rollDie(sides) {
    if (sides === void 0) { sides = 6; }
    if (sides < 1)
        throw new Error('Dice must have at least 1 side');
    return getRandomInt(1, sides);
}
// Roll multiple dice
function rollDice(count, sides) {
    if (sides === void 0) { sides = 6; }
    return Array.from({ length: count }, function () { return rollDie(sides); });
}
function sumDice(count, sides) {
    if (sides === void 0) { sides = 6; }
    return rollDice(count, sides).reduce(function (sum, val) { return sum + val; }, 0);
}
function parseDiceExpression(expr) {
    // Strip the "/r" and any extra spaces
    var trimmed = expr.trim();
    var diceExpr = trimmed.slice(2).trim();
    // Regex matches terms like +3d6, -2d8, +5, -1d4, etc.
    var termRegex = /([+-]?)(\d*)d(\d+)|([+-]?\d+)/gi;
    var total = 0;
    var match;
    while ((match = termRegex.exec(diceExpr)) !== null) {
        if (match[3]) {
            // It's a dice term: [sign][count]d[sides]
            var sign = match[1] === '-' ? -1 : 1;
            var count = match[2] ? parseInt(match[2], 10) : 1; // default "d6" means "1d6"
            var sides = parseInt(match[3], 10);
            total += sign * sumDice(count, sides);
        }
        else if (match[4]) {
            // It's a flat number: +3 or -7
            total += parseInt(match[4], 10);
        }
    }
    return total;
}
function isValidDiceExpression(expr) {
    // Allow terms like 3d6, d20, -2d8, +5, -1, etc.
    var valid = /^([+-]?\d*d\d+|[+-]?\d+)(\s*[+-]\s*(\d*d\d+|\d+))*$/i;
    return valid.test(expr);
}
function isValidDiceRollCommand(expr) {
    // Trim and normalize whitespace
    var trimmed = expr.trim();
    // Check prefix
    if (!trimmed.startsWith('/r')) {
        return false;
    }
    // Strip the "/r" and any extra spaces
    var diceExpr = trimmed.slice(2).trim();
    if (!isValidDiceExpression(diceExpr)) {
        return false;
    }
    return true;
}
console.log('Result:', parseDiceExpression('/r 3d6+2d8-1d4+3'));
