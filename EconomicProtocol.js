/** @param {NS} ns */
function dolla(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export async function main(ns) {
 if (!ns.args || ns.args.length < 2) {
  ns.tprint("Error: Insufficient or incorrect arguments.");
  return;
 }
 let name = ns.args[0];
 let cashGoal = parseFloat(ns.args[1]);
 let cash = ns.getServerMoneyAvailable(name).toFixed(2);
 if (!name || isNaN(cashGoal)) {
  ns.tprint(`Debug: name = ${name}, cashGoal = ${dolla(cashGoal)}`);
  return;
 }

 ns.tprint(`Beginning economic growth stabilization for ${name}: ${dolla(cash)} / ${dolla(cashGoal)}`);
 

 while (cash < cashGoal) {
  await ns.grow(name);                           // improve economic standing
  await ns.grow(name);
  await ns.grow(name);
  await ns.weaken(name);                         // counter security penalty
  cash = ns.getServerMoneyAvailable(name);       // check to see how much we have
 }

 ns.tprint(`${name} funds stabilized at ${dolla(cash)} / ${dolla(cashGoal)}!`);
 ns.tprint("Economic growth protocol completed successfully.");
 ns.toast(`${name} Growth Protocol: Stable.`, "success", 20000);
}
