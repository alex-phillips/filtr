# Filtr

Filter is a self-hosted photo library with an aim to give the user complete control over their photos without placing any assumptions on organization.

## Current Features

* 'Scan-based' library - tell Filtr where your photos are. No uploading or converting existing file structures! Filtr will never touch or alter your actual files.
* Tagging
* Albums (and nested albums)
* EXIF data extraction
* User login
* Public / private photos and albums - by default everything is private. Simply edit photos or albums to make them public and sharable via a link
* Browse by folder structure

These features are by no means complete and all additional features or capabilities are welcome!

## Installation

### Docker

Docker run command:
```
docker run --name filtr -d -p 3000:3000 -v PHOTOS_DIR:/photos -v CONFIG_DIR:/config alexphillips/filtr
```

docker-compose:
```
version: '3'
services:
  filter:
    container_name: filter
    image: alexphillips/filter
    volumes:
      - ${PICTURES_DIR}:/photos
      - ${CONFIG_DIR}:/config
    environment:
      - PGID=${PGID}
      - PUID=${PUID}
      - TZ=${TIMEZONE}
      - /etc/localtime:/etc/localtime:ro
```

## Contributing

Filtr is built with [Quasar](https://v1.quasar-framework.org/start/pick-quasar-flavour) for the frontend and Nodejs with Sequelize for the backend.

To run the front-end in development mode, simply run `npm run dev` for the front-end and run `npm run server` for the backend. The app should then be available via `http://localhost:3000`.
