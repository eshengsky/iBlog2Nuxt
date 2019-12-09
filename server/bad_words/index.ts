import fs from 'fs';
import path from 'path';
import readline from 'readline';

export default class BadWords {
    private static _instance: BadWords;
    private data: Array<string> = [];

    constructor () {
        const files = fs.readdirSync(path.resolve(__dirname, './libs/'));
        files.forEach(file => {
            if (path.extname(file) === '.txt') {
                const rl = readline.createInterface({
                    input: fs.createReadStream(path.resolve(__dirname, './libs/', file))
                });
                rl.on('line', line => {
                    if (line) {
                        if (line.substring(line.length - 1) === ',') {
                            line = line.substring(0, line.length - 1);
                        }
                        this.data.push(line);
                    }
                });
            }
        });
    }

    public static get instance () {
        if (!BadWords._instance) {
            BadWords._instance = new BadWords();
        }
        return BadWords._instance;
    }

    filter (content: string) {
        let result = content;
        for (let i = 0; i < result.length; i++) {
            for (let j = i + 1; j <= result.length + 1; j++) {
                const str = result.substring(i, j);
                if (str.trim()) {
                    if (this.data.some(t => t.toUpperCase() === str.toUpperCase())) {
                        const len = str.length;
                        const asterisks: Array<'*'> = [];
                        for (let i = 0; i < len; i++) {
                            asterisks.push('*');
                        }
                        result = result.replace(str, asterisks.join(''));
                    }
                }
            }
        }
        return result;
    }
}
