import path from "path";

export function getRootDirPath(): string {
    return path.resolve(__dirname, "../..");
}
