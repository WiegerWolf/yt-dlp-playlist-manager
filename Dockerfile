FROM node:21-alpine

# Install curl, ffmpeg, and python3
RUN apk add --no-cache curl ffmpeg python3

# Download and install the latest version of yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Alternatively (if yt-dlp GH repo gets taken down or something)
# Copy over yt-dlp binary (late Dec 2023 version) and make it executable
# COPY ./yt-dlp /usr/local/bin/yt-dlp
# RUN chmod +x /usr/local/bin/yt-dlp

ADD . /app
WORKDIR /app

RUN yarn
CMD ["yarn", "start"]