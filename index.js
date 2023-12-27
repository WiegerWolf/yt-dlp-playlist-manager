import 'dotenv/config'

import fs from 'fs/promises';
import { exec, spawn } from 'child_process';
import { readDir, readFile } from './utils/fs.js';
import { FileInfo, EpisodesCollection } from './utils/fileInfo.js';

const DIRECTORYPATH = process.env.DIRECTORYPATH || './data';
const VIDEO_FILE_RE = new RegExp(process.env.VIDEO_FILE_RE || /\.webm$/);
const SHOW_NAME = process.env.SHOW_NAME || 'Ross\'s Game Dungeon';
const PLAYLIST_FILE_NAME = process.env.PLAYLIST_FILE_NAME || 'playlist';
const PLAYLIST_URL = process.env.PLAYLIST_URL || 'https://www.youtube.com/playlist?list=PL6PNZBb6b9Ltgl6WM5rn2pjrXd_qdit2S';

async function execAsync(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

async function spawnAsync(command, args, options) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, options);
        child.on('error', (error) => {
            reject(error);
        });
        child.on('close', (code) => {
            resolve(code);
        });
    });
}

async function createEpisodesCollection(directoryPath, videoFileRe, showName) {
    const files = await readDir(directoryPath);
    if (!files) {
        return;
    }
    const fileInfos = files
        .filter((fileName) => videoFileRe.test(fileName))
        .map((fileName) => new FileInfo({fileName, showName}))
        .map((fileInfo) => {
            console.log(fileInfo.file_name);
            return fileInfo;
        });
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

async function downloadPlaylistInfo(playlistUrl) {
    const command = `yt-dlp -J --flat-playlist ${playlistUrl}`;
    // Run the command using child_process
    const { stdout, stderr } = await execAsync(command);
    if (stderr && !stdout) {
        console.error('Error downloading playlist info:', stderr);
        return null;
    }
    let playlistInfo;
    try {
        playlistInfo = JSON.parse(stdout);
    } catch (error) {
        console.error('Error parsing playlist info:', error);
        playlistInfo = null;
    }
    return playlistInfo;
}

async function processPlaylist(playlistUrl) {
    const playlistInfo = await downloadPlaylistInfo(playlistUrl);
    if (!playlistInfo || !playlistInfo.entries || !playlistInfo.entries.length) {
        console.error(`No playlist info found for ${playlistUrl}: ${playlistInfo}`);
        return [];
    }
    const playlistEntries = playlistInfo.entries;
    return playlistEntries;
}

async function downloadEpisode(directoryPath, playlistEntry) {
    const command = `yt-dlp`;
    const options = {
        cwd: directoryPath,
    };
    console.log(`Downloading episode ${playlistEntry.title} (${playlistEntry.id})...`);
    const code = await spawnAsync(command, ['-S', 'res:480', playlistEntry.url], options);
    
    if (code !== 0) {
        console.error(`Error downloading episode ${playlistEntry.title} (${playlistEntry.id}):`, code);
    } else {
        console.log(`Episode ${playlistEntry.title} (${playlistEntry.id}) downloaded.`);
    }
}

async function main(directoryPath) {
    console.log(`Checking directory ${directoryPath}...`);
    const episodesCollection = await createEpisodesCollection(directoryPath, VIDEO_FILE_RE, SHOW_NAME);
    console.log(`Found ${episodesCollection.items.length} episodes in ${directoryPath}.`);

    // read local playlist file to check if all episodes are downloaded
    console.log(`Reading playlist file ${PLAYLIST_FILE_NAME}...`);
    const playlistIds = await readPlaylistFile(directoryPath, PLAYLIST_FILE_NAME);
    for (const playlistId of playlistIds) {
        const episodeExists = episodesCollection.checkIfYtIdExists(playlistId);
        if (episodeExists) {
            continue;
        } else {
            console.log(`Episode with id ${playlistId} not found.`);
        }
    }
    
    // download playlist from youtube to get fresh list of episodes
    console.log(`Downloading playlist ${PLAYLIST_URL}...`);
    const playlistEntries = await processPlaylist(PLAYLIST_URL);
    for (const playlistEntry of playlistEntries) {
        const episodeExists = episodesCollection.checkIfYtIdExists(playlistEntry.id);
        if (episodeExists) {
            continue;
        } else {
            console.log(`Episode with id ${playlistEntry.id} not found.`);
            await downloadEpisode(directoryPath, playlistEntry);
        }
    }

    console.log(`Rechecking directory ${directoryPath}...`);
    const episodesCollection2 = await createEpisodesCollection(directoryPath, VIDEO_FILE_RE, SHOW_NAME);
    console.log(`Found ${episodesCollection2.items.length} episodes in ${directoryPath}.`);

    // rename downloaded episodes to match the format used by the script
    for (const episode of episodesCollection2.items) {
        const oldFileName = `${directoryPath}/${episode.file_name}`;
        const newFileName = `${directoryPath}/${episode.formattedFileName()}`;
        if (oldFileName === newFileName) {
            continue;
        }
        console.log(`Renaming ${oldFileName} to ${newFileName}...`);
        await fs.rename(oldFileName, newFileName);
        console.log(`Renamed ${oldFileName} to ${newFileName}.`);
    }

    console.log('Done.');
}

main(DIRECTORYPATH)
    .catch((err) => console.error('Error in main:', err));
