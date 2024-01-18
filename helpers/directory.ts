import path from "path";
import {fileURLToPath} from 'url';
import {z} from "zod";

export function getDirname(metaUrl?: string) {
  const url = z.string().parse(metaUrl);
  return path.dirname(fileURLToPath(url));
}


