/** @param {NS} ns */
export function printBreak(ns, text) {
 let breakLine = '~'.repeat(50);                                      // Create a line of tildes
 let padding = Math.floor((breakLine.length - text.length) / 2);      // Calculate the padding needed
 let centeredText = ' '.repeat(padding) + text + ' '.repeat(padding); // adding spaces before and after
 ns.tprint(breakLine);                                                // Print the line of tildes
 ns.tprint(centeredText);                                             // Print the centered words
}