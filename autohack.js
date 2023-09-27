/** @param {NS} ns */
// if I ever give this to somebody just know it was my first javascript -Kraken
//
import { deepScan } from './deepScan.js';
import { updatePC } from './deepScan.js';
import { printBreak } from './UI.js';
//
//
//                   EXECUTION PROTOCOL
//
async function runProtocol(ns, PC) {                                // Activate the Run Protocol Function
 const file = `${PC.protocol}Protocol.js`                           // Converting Protocol parameter to filename
 await ns.scp(`${file}`, PC.NAME);                                  // Perform the precise file upload
 ns.tprint(`Targeting ${PC.target} with ${file} on` +               // Notify terminal of remote execution
  ` ${PC.NAME} using ${PC.threads} threads.`);                      // Notification continued... announce thread count
 ns.exec(file, PC.NAME, PC.threads, PC.target, PC.goal);            // Execute script remotely
}                                                                   
//                                                                  
//                                                                  
//                    NUCLEAR PROTOCOL                              
//
//
async function autoHack(ns, PC) {                                   // Start autoHack function
 if (PC.admin == false) {                                           // Check admin status
  try {                                                             // First we try...
   if (PC.ports.nukePorts >= 1) await ns.brutessh(PC.NAME);         // SSH crack on first port
   if (PC.ports.nukePorts >= 2) await ns.ftpcrack(PC.NAME);         // FTP crack on second port
   if (PC.ports.nukePorts >= 3) await ns.relaysmtp(PC.NAME);        // SMTP crack on third port
   if (PC.ports.nukePorts >= 4) await ns.httpworm(PC.NAME);         // HTTP crack on fourth port
   if (PC.ports.nukePorts >= 5) await ns.sqlinject(PC.NAME);        // SQL crack on final port
   await ns.nuke(PC.NAME);                                          // Deploy nuke
  } catch (error) { return false };                                 // Catch failure and report back
 }
 return true;                                                       // Return success status
}
//
//
//                    TARGETING MODULE
//
//
function getTarget(ns, PCAR) {
 const mySkill = ns.getHackingLevel();                              // Retrieve player's current hacking level
 const jb = ['Security', 'Economic', 'Farming'];                    // Define PC protocol priority order  
 let IO = PCAR.filter(PC => (PC.hackSkill * 3) <= mySkill);         // Step 1: Remove inaccessable targets
 IO = IO.filter(PC => jb.includes(PC.protocol));                    // Step 2: Remove inappropriate targets
 IO.sort((a, b) => b.cashGoal - a.cashGoal);                        // Step 3: Sort by value
 IO.sort((a, b) => jb.indexOf(a.protocol) - jb.indexOf(b.protocol));// Step 4: Sort by priority
 if (IO.length > 0) {                                               // If the list has any available PCs...
  return {                                                          // Return a target with the following:
   target: IO[0].NAME,                                              // A target in the form of the target's name
   protocol: IO[0].protocol,                                        // The exact protocol assigned to the target
   goal: IO[0].goal                                                 // The exact goal assigned to the target
  };                                                                // Otherwise...
 } else ns.toast("getTarget list was EMPTY","error",5000);          // Send an error popup at runtime
}
//
//
//
//                      MAIN FUNCTION
//
//
//
export async function main(ns) {
 printBreak(ns, "Spooling up data center...");                       // Announcing the start of script
 let PCAR = await deepScan(ns);                                      // Build network database from scratch
 while (true) {                                                      // Set a forever loop (main loop)
  const timer = new Promise(resolve => setTimeout(resolve, 60000));  // Set a timer to 60 seconds
  PCAR = PCAR.map(oldPC => updatePC(ns, oldPC));                     // Update all PCs in database
  let target = getTarget(ns, PCAR);                                  // Locate target for the Node Array
  const LPCAR = PCAR.filter(locked => locked.type === "locked");     // Filter out the Locked PCs (LPCAR)
  for (let PC of LPCAR) {                                            // Loop Locked PCs only
   const result = await autoHack(ns, PC);                            // Execute autoHack and await result
   if (result) {                                                     // If Nuke dropped...
    let PC = updatePC(ns, PC);                                       // Double check all PC parameters
    ns.toast(`Acquired ${PC.NAME} (${PC.type})`, "info", 360000);    // Announce acquisition
   }                                                                 // End of inner loop 1 (locked)
  } 
  for (let PC of PCAR) {                                             // Cycle through the entire PC Array
    if (PC.idle && PC.protocol) {                                    // Find PCs that have pending jobs
     if (PC.type === "node" && PC.protocol == "pending") {           // Find PCs that are support nodes
        Object.assign(PC, target);                                   // Assign target's parameters to node
      }                                                              // Now addressing both Farms and Nodes
      printBreak(ns, `${PC.orgName} (${PC.type})`);                  // Announce the Organization & PC type
      await runProtocol(ns, PC);                                     // Upload file and remotely execute it
    }                                                                // End of inner loop 2 (executables)
  }
  await timer;                                                       // Start a new main loop when timer ends
 }
}
   