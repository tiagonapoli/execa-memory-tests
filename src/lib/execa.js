const { setupStatsInterval, procMemory, cleanIntervals } = require("./common");
const execa = require("execa");
const fs = require("fs");
const path = require("path");
const wtf = require("wtfnode");

const test = async () => {
  const p = path.join(__dirname, "intense-output.py");
  const file = fs.createWriteStream("./out.tmp");

  try {
    const proc = execa(p, {
      buffer: false
    });

    proc.all.pipe(file);

    const res = await proc;
    console.log(res);
    console.log("");

    procMemory("=== Father After child ===");
  } catch (err) {
    console.log("-- Error --");
    console.error(err);
  }
};

const go = async () => {
  procMemory("=== Father before ===");
  setupStatsInterval(process.pid, "=== Father ===", 2000);
  await test();

  const timeout = setTimeout(() => {
    cleanIntervals();
    clearTimeout(timeout);
    wtf.dump();
  }, 4 * 1000);
};

module.exports = go;
