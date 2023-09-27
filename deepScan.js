/** @param {NS} ns */
class PC {
 constructor(properties = {}) {
  // Basic Info
  this.NAME      = properties.hostname             || 'Unknown';       // Host's permanent name
  this.orgName   = properties.organizationName     || 'Mystery';       // Associated organization
  this.owned     = properties.purchasedByPlayer    || false;           // Ownership status

  // Network Info
  this.ip        = properties.ip                   || "10.0.0.1";      // IP address
  this.admin     = properties.hasAdminRights       || false;           // Admin rights status
  this.backdoor  = properties.backdoorInstalled    || false;           // Backdoor installation status
  this.connected = properties.isConnectedTo        || false;           // Connection status

  // Ports Info
  this.ports     = {                                                   // Ports object initialization
   nukePorts     : properties.numOpenPortsRequired || 0,               // Required ports for NUKE
   openPorts     : properties.openPortCount        || 0,               // Open ports count
   SSH           : properties.sshPortOpen          || false,           // SSH port status
   FTP           : properties.ftpPortOpen          || false,           // FTP port status
   SMTP          : properties.smtpPortOpen         || false,           // SMTP port status
   HTTP          : properties.httpPortOpen         || false,           // HTTP port status
   SQL           : properties.sqlPortOpen          || false,           // SQL port status
  };
  // Security & Funds
  this.sec       = properties.hackDifficulty       || 1;               // Current security level
  this.secGoal   = properties.minDifficulty        || 1;               // Optimal security level
  this.cash      = properties.moneyAvailable       || 0;               // Available funds
  this.cashGoal  = properties.moneyMax             || 0;               // Target funds

  // Resources
  this.growth    = properties.serverGrowth         || 0;               // Server growth rate
  this.ramUsed   = properties.ramUsed              || 0;               // Consumed RAM
  this.ramMax    = properties.maxRam               || 0;               // Maximum RAM
  this.cores     = properties.cpuCores             || 0;               // CPU cores count

  // Skills & Goals
  this.hackSkill = properties.requiredHackingSkill || 0;               // Required hacking skill
  this.protocol  = properties.protocol                                 // Target Protocol (new)
  this.target    = properties.target                                   // host name of target (new)
  this.threads   = properties.threads                                  // Thread capability (new)
  this.type      = properties.type                                     // How we handle this host (new)
  this.goal      = properties.goal                                     // End goal for protocol (new)
  this.idle      = properties.idle                                     // Is it running scripts? (new)
 }
}

export function deepScan(ns) {                       // Initiates deep network scan
 let PCAR = [new PC(ns.getServer('home'))];          // Initialize PC Array with home network
 for (let i = 0; i < PCAR.length; i++) {             // Iterate through known PCs
  const hostScan = ns.scan(PCAR[i].NAME);            // Scan current host for connected hosts
  hostScan.forEach(host => {                         // Iterate through discovered hosts
   if (!PCAR.some(pc => pc.NAME === host)) {         // Check for new hosts
    ns.killall(host);                                // Kill all tasks on the newly discovered host
    let IO = new PC(ns.getServer(host));             // Create new PC object for new host
    ns.tprint(`${IO.NAME}:${IO.orgName} @ ${IO.ip}`) // Report the location of host in the network
    if ( IO.ramMax <= 0 && IO.cash <= 0) {           // If PC object is useless
     ns.toast(`Dead PC: ${IO.NAME}`,"info", 9999)    // Send a popup notification
    }                                                //
    PCAR.push(IO);                                   // Add new host to PC Array
   }                                                 //
  });                                                //  ... All done!
 }                                                   //
 return PCAR;                                        // Return populated PC Array
}


function doorCheck(ns, PC) {
 let skill = ns.getHackingLevel()
 if (PC.NAME !== "home" && PC.NAME !== "darkweb") {
  if (!PC.backdoor && (PC.secGoal / PC.sec) > .9
  && skill >= PC.hackSkill) {
   ns.toast(`${PC.NAME} Backdoor Available.`,
    "warning", 36000000);
  }
 }
}


export function updatePC(ns, IO) {               // this is legacy code but I cant get the updated version to work
 let FRESH = new PC(ns.getServer(IO.NAME));      // Get fresh data from getServer
 for (let key in FRESH) {                        // Update PC with fresh data 
  if (IO.hasOwnProperty(key)) {
   IO[key] = FRESH[key];
  }
 }
 IO.protocol = ""
 if (IO.admin){
  if (IO.ramMax > 0){
   IO.threads = Math.floor(IO.ramMax / 2);
   IO.idle = IO.ramUsed === 0
   if (IO.cash > 0) {
    IO.type = "farm";
   } else {
    IO.type = "node";
    IO.protocol = "pending";
   }
  } else if (IO.cash > 0){
   IO.type = "bank";
  } else IO.type = "dead";
 } else IO.type = "locked"
 doorCheck(ns, IO);
 if ((IO.secGoal / IO.sec) < .75  && ["farm", "node", "bank"].includes(IO.type)) {
  IO.protocol = "Security";
  IO.goal = IO.secGoal;
  IO.target = IO.NAME;
 } else if ((IO.cash / IO.cashGoal) < .75 && ["farm", "bank"].includes(IO.type)) {
  IO.protocol = "Economic";
  IO.goal = IO.cashGoal;
  IO.target = IO.NAME;
 } else if ((IO.secGoal / IO.sec) >= .75 && (IO.cash / IO.cashGoal) >= .75 && ["farm", "bank"].includes(IO.type)) {
  IO.protocol = "Farming";
  IO.target = IO.NAME;
  IO.goal = 1;
 } else if (IO.type === "node" && IO.idle) IO.target = "pending";
 if (IO.NAME === "home"){
  IO.threads = Math.floor((IO.ramMax - IO.ramUsed - 16) / 2);
  if (IO.threads > 0){
   IO.type = "node";
   IO.target = "pending";
  } else IO.type = "dead"
 }
 return IO;
}








export function updatePC_new (ns, IO) {  // this shit doesn't work. I don't remember what the purpose of it was anymore
  const FRESH = new PC(ns.getServer(IO.NAME));
  for (let key in FRESH) {                        // Update PC with fresh data 
  if (IO.hasOwnProperty(key)) IO[key] = FRESH[key];
 }
  IO.protocol = null;
  
  IO.type = (!IO.admin ? "locked" :
               (IO.ramMax > 0 ? (IO.cash > 0 ? "farm" : "node") :
               (IO.cash > 0 ? "bank" :
               "dead")));
  
  if (IO.NAME === "home") {
   IO.threads = Math.floor((IO.ramMax - IO.ramUsed - 16) / 2);
   IO.type = "node";
  } else if (IO.type === "farm" || IO.type === "node") {
   IO.threads = Math.floor(IO.ramMax - IO.ramUsed / 2);
  }

  IO.idle = IO.threads > 0;
  doorCheck(ns, IO);
  
  const sPct = IO.secGoal / IO.sec;
  const cPct = IO.cash / IO.cashGoal;
  let isForB = (IO.type === "farm" || IO.type === "bank");
  let isOpen = (IO.type !== "locked" && IO.type !== "dead")

  IO.protocol = (sPct < 0.75 && isOpen ? "Security" : 
                   (cPct < 0.75 && isForB ? "Economic" : 
                   (sPct >= 0.75 && cPct >= 0.75 && isForB ? "Farming" : 
                   null)));

  if(IO.protocol === "Economic")
   IO.goal = IO.cashGoal;
  else if(IO.protocol === "Farming")
   IO.goal = IO.secGoal;

  IO.target = (IO.protocol ? IO.NAME : (IO.type === "node" && IO.idle ? "pending" : null));

  
  ns.tprint( IO.NAME , " Protocol: ", IO.protocol, " Target: " , IO.target, "  Type: " , IO.type)
  return IO;
}