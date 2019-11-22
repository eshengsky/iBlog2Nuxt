import fs from "fs";
import path from "path";
import readline from "readline";

export default class BadWords {
  private static data: Array<string> = [];

  constructor() {
    if (BadWords.data.length) {
      return;
    }
    const files = fs.readdirSync(path.resolve(__dirname, "./libs/"));
    files.forEach(file => {
      if (path.extname(file) === ".txt") {
        const rl = readline.createInterface({
          input: fs.createReadStream(path.resolve(__dirname, "./libs/", file))
        });
        rl.on("line", line => {
          if (line) {
            if (line.substring(line.length - 1) === ",") {
              line = line.substring(0, line.length - 1);
            }
            BadWords.data.push(line);
          }
        });
      }
    });
  }

  static filter(content: string) {
    let result = content;
    for (let i = 0; i < result.length - 1; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const str = result.substring(i, j);
        if (str.trim()) {
          if (BadWords.data.some(t => t.toUpperCase() === str.toUpperCase())) {
            const len = str.length;
            const asterisks: Array<"*"> = [];
            for (let i = 0; i < len; i++) {
              asterisks.push("*");
            }
            result = result.replace(str, asterisks.join(""));
          }
        }
      }
    }
    return result;
  }
}
