FROM node:21-alpine

# Install curl, ffmpeg, and python3
RUN apk add --no-cache curl ffmpeg python3

# Copy over yt-dlp binary and make it executable
COPY ./yt-dlp /usr/local/bin/yt-dlp
RUN chmod +x /usr/local/bin/yt-dlp

ADD . /app
WORKDIR /app

RUN yarn
CMD ["yarn", "start"]