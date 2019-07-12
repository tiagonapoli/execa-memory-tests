const { setupStatsInterval, cleanIntervals, procMemory } = require("./common");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const wtf = require("wtfnode");

const testNode = async () => {
  let resolveWaitClose;
  const waitClose = new Promise(resolve => {
    resolveWaitClose = resolve;
  });

  let resolveWaitStreamClose;
  const waitStreamClose = new Promise(resolve => {
    resolveWaitStreamClose = resolve;
  });

  const p = path.join(__dirname, "intense-output.py");
  const file = fs.createWriteStream("./out.tmp");

  const proc = spawn(p);
  proc.stdout.pipe(file);

  setTimeout(() => {
    console.log("KILL RETURN", proc.kill());
  }, 10000);

  proc.on("error", err => {
    console.error("[ChildProcess] Error", err);
  });

  proc.on("close", code => {
    resolveWaitClose();
    console.log(`child process exited with code ${code}`);
  });

  file.on("close", () => {
    resolveWaitStreamClose();
  });

  await waitClose;
  procMemory("=== Father After child ===");

  await waitStreamClose;
  file.destroy();
  procMemory("=== Father After Stream close ===");
};

const go = async () => {
  procMemory("=== Father before ===");
  setupStatsInterval(process.pid, "=== Father ===", 2000);
  await testNode();

  const timeout = setTimeout(() => {
    cleanIntervals();
    clearTimeout(timeout);
    wtf.dump();
  }, 10 * 1000);
};

module.exports = go;
