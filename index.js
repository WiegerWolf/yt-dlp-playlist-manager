import { promises as fs } from 'fs';

const DIRECTORYPATH = './data';
const SHOW_NAME = 'Ross\'s Game Dungeon';
const VIDEO_FILE_RE = /\.webm$/;

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

class FileInfo {
    SERIES_REGEX = /\((\d+)\s*of\s*(\d+)\)/;

    constructor(fileName) {
        this.file_name = fileName;
        this.yt_id = this.parseYoutubeId(fileName);
        this.game_name = this.parseGameName(fileName);
        this.show_name = SHOW_NAME;
        this.is_part_of_series = this.checkIsPartOfSeries(this.game_name);
        if (this.is_part_of_series) {
            this.series_name = this.trimSeriesMarkup(this.game_name);
            this.number_in_series = this.getNumberInSeries(this.game_name);
            this.game_name = this.series_name;
        }
    }

    parseYoutubeId(fileName) {
        // file name example: Ross's Game Dungeon - A New Beginning [G4bJqpVH0O0].webm
        const regex = /\[(.+)\]/;
        const match = fileName.match(regex);
        return match ? match[1] : null;
    }

    getNumberInSeries(gameName) {
        const match = gameName.match(this.SERIES_REGEX);
        return match ? parseInt(match[1]) : null;
    }

    parseGameName(fileName) {
        // file name example: Ross's Game Dungeon - A New Beginning [G4bJqpVH0O0].webm
        const regex = /(?:-|–)\s*(.*?)\s*\[/;
        const match = fileName.match(regex);
        let gameName = match ? match[1] : null;
        
        return gameName;
    }
    
    checkIsPartOfSeries(episodeTitle) {
        // episode title example: "Still Life (2 of 2)"
        const match = episodeTitle.match(this.SERIES_REGEX);
        return match ? true : false;
    }

    trimSeriesMarkup(gameName) {
        // Remove series markup from game name
        return gameName.replace(this.SERIES_REGEX, '').trim();
    }
}

async function main(directoryPath) {
    const files = await readDir(directoryPath);
    if (!files) {
        return;
    }
    const fileInfos = files
        .filter((fileName) => VIDEO_FILE_RE.test(fileName))
        .map((fileName) => new FileInfo(fileName));
    console.log(fileInfos);
}


main(DIRECTORYPATH)
    .catch((err) => console.error('Error in main:', err));
