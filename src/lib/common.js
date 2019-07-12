const pidusage = require("pidusage");

const printStats = (header, stats) => {
  if (header) console.log(header);
  const obj = {
    cpu: stats.cpu.toFixed(2),
    memory: (stats.memory / (1000 * 1000)).toFixed(2)
  };

  console.log(obj);
  procMemory("");
  console.log("\n");
};

const procMemory = msg => {
  if (msg) console.log(msg);
  else console.log("==== Father ==== ");
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
  console.log("\n");
};

const intervals = [];

const setupStatsInterval = (pid, text, time) => {
  const interval = setInterval(async () => {
    const stats = await pidusage(pid);
    printStats(text, stats);
  }, time);
  intervals.push(interval);
  return interval;
};

const cleanIntervals = () => {
  intervals.forEach(el => {
    clearInterval(el);
  });
  pidusage.clear();
};

module.exports = {
  printStats,
  setupStatsInterval,
  cleanIntervals,
  procMemory
};
