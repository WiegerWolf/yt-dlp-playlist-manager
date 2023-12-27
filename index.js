import { promises as fs } from 'fs';

const DIRECTORYPATH = './data';

async function createDirectory(directoryPath) {
    try {
        await fs.mkdir(directoryPath);
        console.log(`Directory ${directoryPath} created.`);
    } catch (err) {
        console.error('Error creating directory:', err);
    }
}

async function readDir(directoryPath) {
    let files;
    try {
        files = await fs.readdir(directoryPath);
        console.log(`Files in directory ${directoryPath}:`);
    } catch (err) {
        // handle ENOENT error: file or directory does not exist
        if (err.code === 'ENOENT') {
            console.log(`Directory ${directoryPath} does not exist.`);
            await createDirectory(directoryPath);
            return readDir(directoryPath);
        } else {
            console.error(`Error reading directory ${directoryPath}:`, err);
        }
    }
    return files;
}

async function main(directoryPath) {
    const files = await readDir(directoryPath);
    console.log(files);
}


main(DIRECTORYPATH)
    .catch((err) => console.error('Error in main:', err));
