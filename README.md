# YT-DLP Playlist Manager

YT-DLP Playlist Manager is a Node.js application designed to manage and download YouTube playlists using yt-dlp. It facilitates downloading new videos from a specified playlist, organizing them in a structured directory, and maintaining a consistent naming convention for ease of access and organization.

## Features

- **Playlist Downloading**: Automatically downloads new videos from a specified YouTube playlist.
- **File Organization**: Organizes downloaded videos in a specified directory with a uniform naming scheme.
- **Episode Management**: Tracks and manages episodes in a series, handling multipart episodes efficiently.
- **Docker Integration**: Easily deployable in a Docker container with all dependencies included.
- **Environment Customization**: Configure the application using an environment file for easy setup and customization.

## Requirements

- Docker

## Dependencies

- Node.js (for development, use provided .devcontainer)
- yt-dlp (included in Dockerfile)
- ffmpeg (included in Dockerfile)

## Installation and Setup

1. **Clone the Repository**: Clone this repository to your local machine.
2. **Docker Setup**: Ensure Docker is installed on your system.
3. **Environment File**: Configure the `.env` file with the desired playlist URL and other optional settings (see Configuration section below).
4. **Local Data Mount**: Don't forget to mount the local `share/.../videos` directory to the container `/app/data` directory (see `docker-compose.yml` file).
4. **Build and Run with Docker-Compose**: Use Docker-Compose to build and run the application. The command `docker-compose up` will set up the environment.

## Usage

- The service will start automatically when the Docker container is up.
- Videos from the specified YouTube playlist will be downloaded into the configured directory.
- The application will check for new videos periodically and download them.
- Downloaded videos are renamed according to the specified naming convention for consistency.

## Configuration

Configure the application behavior using the `.env` file (use `cp .env.example .env` for start). The following environment variables can be set:

- `PLAYLIST_URL`: URL of the YouTube playlist to download.

Optional variables (with default values set in code):

- `DIRECTORYPATH`: Path to the directory where videos will be stored (`./data` by default).
- `VIDEO_FILE_RE`: Regex for video file extensions (`\.webm)` by default).
- `SHOW_NAME`: Name of the show or series (used in naming convention), (`'Ross\'s Game Dungeon'` by default).
- `PLAYLIST_FILE_NAME`: Name of the local playlist file (`'playlist'` by default).

## Development

- The `.devcontainer` folder contains a VS Code development container configuration for Node.js development.
- The `docker-compose.yml` file can be used to build and run the application on the local machine (don't forget to mount the local `share/.../videos` directory to the container `/app/data` directory).