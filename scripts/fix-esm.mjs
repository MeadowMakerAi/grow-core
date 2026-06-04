// Post-tsc: add .js to relative import/export specifiers so dist is valid
// Node ESM (tsc with bundler resolution emits them extensionless).
import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
const root = new URL("../dist", import.meta.url).pathname;
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".js") || p.endsWith(".d.ts")) {
      let s = readFileSync(p, "utf8");
      s = s.replace(/(\bfrom\s*["'])(\.\.?\/[^"']*?)(["'])/g, (m, a, spec, c) =>
        /\.(js|json|css)$/.test(spec) ? m : a + spec + ".js" + c,
      );
      writeFileSync(p, s);
    }
  }
}
walk(root);
console.log("fix-esm: added .js extensions to dist relative imports");
