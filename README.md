# CPSC 304 team 68 Project Repository

This repository contains our code for the class project. Created by me, Eric, and Liam.

## Project Summary

Our project goal is to create a torrent site to help users index and archive data through the bittorrent protocol.
To achieve this, the service allows users to upload bittorrent files which point to the data itself along with metadata and tagging that allows other users to easily find the files.
For example, a user could upload an Arch Linux ISO torrent, tag it with the “Arch” tag and place it within the “Linux ISO” category.


## How to run

```sh
$ docker-compose up
# you may have to remove existing containers if there's a naming conflict
$ docker container rm database api frontend
```

The services should now be available
* Frontend: http://localhost:3000
* Backend: http://localhost:8000
