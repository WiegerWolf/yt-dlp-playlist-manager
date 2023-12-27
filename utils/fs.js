import { promises as fs } from 'fs';

export async function createDirectory(directoryPath) {
    try {
        await fs.mkdir(directoryPath);
        console.log(`Directory ${directoryPath} created.`);
    } catch (err) {
        console.error('Error creating directory:', err);
    }
}

export async function readDir(directoryPath) {
    let files;
    try {
        files = await fs.readdir(directoryPath);
    } catch (err) {
        // handle ENOENT error: file or directory does not exist
        if (err.code === 'ENOENT') {
            console.log(`Directory ${directoryPath} does not exist. Creating...`);
            await createDirectory(directoryPath);
            return readDir(directoryPath);
        } else {
            console.error(`Error reading directory ${directoryPath}:`, err);
        }
    }
    return files;
}

export async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data;
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        throw err;
    }
}
