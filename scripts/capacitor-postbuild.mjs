// Aplana dist/client -> dist y renombra _shell.html a index.html
// para que Capacitor (webDir: "dist") encuentre el index.html.
import { existsSync, renameSync, rmSync, cpSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const client = join(dist, "client");
const server = join(dist, "server");

if (!existsSync(client)) {
  console.error("[capacitor-postbuild] No existe dist/client. ¿Ejecutaste con CAPACITOR=1?");
  process.exit(1);
}

// Mueve todo dist/client/* a dist/
for (const entry of readdirSync(client)) {
  const from = join(client, entry);
  const to = join(dist, entry);
  if (existsSync(to)) rmSync(to, { recursive: true, force: true });
  renameSync(from, to);
}
rmSync(client, { recursive: true, force: true });

// Renombra _shell.html -> index.html (Capacitor exige index.html)
const shell = join(dist, "_shell.html");
const index = join(dist, "index.html");
if (existsSync(shell)) {
  if (existsSync(index)) rmSync(index);
  renameSync(shell, index);
}

// No necesitamos el bundle SSR para Capacitor
if (existsSync(server)) rmSync(server, { recursive: true, force: true });

console.log("[capacitor-postbuild] OK -> dist/index.html listo para Capacitor");
