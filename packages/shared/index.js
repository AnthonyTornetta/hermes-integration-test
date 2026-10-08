import {readFileSync} from "node:fs";
export const label = "workspace-revision-one";
export const asset = () => readFileSync(new URL("./data.txt", import.meta.url), "utf8").trim();
