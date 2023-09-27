/** @param {NS} ns */
export async function main(ns) {
 if (!ns.args || ns.args.length < 1) {
  ns.tprint("Error: No server target specified.");
  return;
 }

 let name = ns.args[0];

 if (!name) {
  ns.tprint(`Debug: name = ${name}`);
  return;
 }

 ns.tprint(`Beginning farming protocol for ${name}`);
 while (true) {
  try { await ns.hack(name); } 
  catch (Error) { ns.toast('hack fail @ '+ name, "error")}
  await ns.grow(name);
  await ns.grow(name);
  await ns.grow(name);
  await ns.weaken(name);
 }
}
