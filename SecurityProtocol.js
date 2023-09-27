/** @param {NS} ns */
export async function main(ns) {
 if (!ns.args || ns.args.length < 2) {
  ns.tprint("Error: Insufficient arguments provided.");
  return;
 }

 let name = ns.args[0];
 let secGoal = ns.args[1];
 let sec = ns.getServerSecurityLevel(name).toFixed(2);
 if (!name || !secGoal) {
  ns.tprint(`Debug: name = ${name}, secGoal = ${secGoal}`);
  return;
 }

 ns.tprint(`Security stabilization activated on ${name}: ${sec} / ${secGoal}`);

 
 while (sec > secGoal) {
  //ns.tprint(`Debug: Current security level = ${sec}, Goal = ${secGoal}`);
  await ns.weaken(name);
  sec = ns.getServerSecurityLevel(name);
 }

 ns.tprint(`${name} security level stabilized at ${sec} / ${secGoal}!`);
 ns.tprint("Security protocol completed successfully.");
 ns.toast(`${name} Security Protocol: Stable.`, "success", 10000);
}
