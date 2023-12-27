FROM node:21-alpine

# Install curl
RUN apk add --no-cache curl

# Download and install the latest version of yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

# Install ffmpeg
RUN apk add --no-cache ffmpeg

ADD . /app

WORKDIR /app

RUN yarn

CMD ["yarn", "start"]