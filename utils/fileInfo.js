const SERIES_REGEX = /\((\d+)\s*of\s*(\d+)\)/;

export class FileInfo {
    constructor({ fileName, showName }) {
        this.file_name = fileName;
        this.ext = fileName.split('.').pop();
        this.yt_id = this.parseYoutubeId(fileName);
        this.game_name = this.parseGameName(fileName);
        this.show_name = showName;
        this.is_part_of_series = this.checkIsPartOfSeries(this.game_name);
        if (this.is_part_of_series) {
            this.series_name = this.trimSeriesMarkup(this.game_name);
            this.number_in_series = this.getNumberInSeries(this.game_name);
            this.total_episodes_in_series = this.getTotalEpisodesInSeries(this.game_name);
            this.game_name = this.series_name;
        }
    }

    parseYoutubeId(fileName) {
        // file name example: Ross's Game Dungeon - A New Beginning [G4bJqpVH0O0].webm
        const regex = /\[(.+)\]/;
        const match = fileName.match(regex);
        return match ? match[1] : null;
    }

    formattedFileName() {
        let formattedFileName = `${this.show_name} - ${this.game_name}`;
        if (this.is_part_of_series) {
            formattedFileName += ` (${this.number_in_series} of ${this.total_episodes_in_series})`;
        }
        formattedFileName += ` [${this.yt_id}]`;
        formattedFileName += `.${this.ext}`;
        return formattedFileName;
    }

    getNumberInSeries(gameName) {
        const match = gameName.match(SERIES_REGEX);
        return match ? parseInt(match[1]) : null;
    }

    getTotalEpisodesInSeries(gameName) {
        const match = gameName.match(SERIES_REGEX);
        return match ? parseInt(match[2]) : null;
    }
    
    parseGameName(fileName) {
        // file name example: Ross's Game Dungeon - A New Beginning [G4bJqpVH0O0].webm
        const regex = /(?:-|–|：|:)\s*(.*?)\s*\[/;
        const match = fileName.match(regex);
        let gameName = match ? match[1] : null;

        return gameName;
    }

    checkIsPartOfSeries(episodeTitle) {
        // episode title example: "Still Life (2 of 2)"
        const match = episodeTitle.match(SERIES_REGEX);
        return match ? true : false;
    }

    trimSeriesMarkup(gameName) {
        // Remove series markup from game name
        return gameName.replace(SERIES_REGEX, '').trim();
    }
}

export class EpisodesCollection {
    constructor(fileInfos) {
        this.items = fileInfos || [];
    }

    addItem(fileInfo) {
        this.items.push(fileInfo);
    }

    getItemsByGameName(gameName) {
        return this.items.filter((item) => item.game_name === gameName);
    }

    getItemsByYtId(ytId) {
        return this.items.filter((item) => item.yt_id === ytId);
    }

    checkIfYtIdExists(ytId) {
        return this.items.some((item) => item.yt_id === ytId);
    }

}