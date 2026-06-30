import { getDataDir, initJsonStore } from "./json-store.js";

initJsonStore();
console.log(`JSON store ready at ${getDataDir()}`);
