import 'dotenv/config'

import { readDir } from './utils/fs.js';
import { FileInfo, EpisodesCollection } from './utils/fileInfo.js';

const DIRECTORYPATH = process.env.DIRECTORYPATH || './data';
const VIDEO_FILE_RE = new RegExp(process.env.VIDEO_FILE_RE || /\.webm$/);
const SHOW_NAME = process.env.SHOW_NAME || 'Ross\'s Game Dungeon';

async function main(directoryPath) {
    const files = await readDir(directoryPath);
    if (!files) {
        return;
    }
    const fileInfos = files
        .filter((fileName) => VIDEO_FILE_RE.test(fileName))
        .map((fileName) => new FileInfo({fileName, showName: SHOW_NAME}));
    const episodesCollection = new EpisodesCollection(fileInfos);
    console.log(episodesCollection.getItemsByGameName('Still Life'));
}


main(DIRECTORYPATH)
    .catch((err) => console.error('Error in main:', err));
