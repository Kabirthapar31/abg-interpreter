const dir = process.argv[2] || "out";
require("fs").mkdirSync(dir, { recursive: true });
(async () => {
  for (const f of process.argv.slice(3)) await require("./" + f)(dir);
})().catch((e) => { console.error(e); process.exit(1); });
