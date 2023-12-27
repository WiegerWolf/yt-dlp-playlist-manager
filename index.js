import 'dotenv/config'

import { readDir, readFile } from './utils/fs.js';
import { FileInfo, EpisodesCollection } from './utils/fileInfo.js';

const DIRECTORYPATH = process.env.DIRECTORYPATH || './data';
const VIDEO_FILE_RE = new RegExp(process.env.VIDEO_FILE_RE || /\.webm$/);
const SHOW_NAME = process.env.SHOW_NAME || 'Ross\'s Game Dungeon';
const PLAYLIST_FILE_NAME = process.env.PLAYLIST_FILE_NAME || 'playlist';

async function createEpisodesCollection(directoryPath, videoFileRe, showName) {
    const files = await readDir(directoryPath);
    if (!files) {
        return;
    }
    const fileInfos = files
        .filter((fileName) => videoFileRe.test(fileName))
        .map((fileName) => new FileInfo({fileName, showName}));
    return new EpisodesCollection(fileInfos);
}

async function readPlaylistFile(directoryPath, playlistFileName) {
    const playlist = await readFile(`${directoryPath}/${playlistFileName}`) || '';
    const playlistLines = playlist.split('\n');
    // each line is like this: youtu.be/sDuVcyIf26U
    const playlistIds = playlistLines
        .map((line) => line.split('/')[1])
        .filter(Boolean)
    if (!playlistIds || !playlistIds.length) {
        return [];
    }
    return playlistIds;
}

async function main(directoryPath) {
    const episodesCollection = await createEpisodesCollection(directoryPath, VIDEO_FILE_RE, SHOW_NAME);
    const playlistIds = await readPlaylistFile(directoryPath, PLAYLIST_FILE_NAME);

    for (const playlistId of playlistIds) {
        const episodeExists = episodesCollection.checkIfYtIdExists(playlistId);
        if (episodeExists) {
            continue;
        } else {
            console.log(`Episode with id ${playlistId} not found.`);
        }
    }
}

main(DIRECTORYPATH)
    .catch((err) => console.error('Error in main:', err));
