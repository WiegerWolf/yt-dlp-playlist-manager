import { promises as fs } from 'fs';

const directoryPath = './data';

async function main() {
    try {
        const files = await fs.readdir(directoryPath);
        console.log('Files in ./data directory:');
        files.forEach((file) => {
            console.log(file);
        });
    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

main();
