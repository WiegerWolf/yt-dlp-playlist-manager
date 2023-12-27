import { readDir } from './utils/fs.js';
import { FileInfo } from './utils/fileInfo.js';

const DIRECTORYPATH = './data';
const VIDEO_FILE_RE = /\.webm$/;
const SHOW_NAME = 'Ross\'s Game Dungeon';

async function main(directoryPath) {
    const files = await readDir(directoryPath);
    if (!files) {
        return;
    }
    const fileInfos = files
        .filter((fileName) => VIDEO_FILE_RE.test(fileName))
        .map((fileName) => new FileInfo({fileName, showName: SHOW_NAME}));
    console.log(fileInfos);
}


main(DIRECTORYPATH)
    .catch((err) => console.error('Error in main:', err));
