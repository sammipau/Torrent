# CPSC 304 Milestone 2

Group 68

## Summary

Our project goal is to create a torrent site to help users index and archive data through the bittorrent protocol. To achieve this, the service allows users to upload bittorrent files which point to the data itself along with metadata and tagging that allows other users to easily find the files. For example, a user could upload an Arch Linux ISO torrent, tag it with the “Arch” tag and place it within the “Linux ISO” category.

## Timeline

We have agreed to evenly split the work between all our members, using an end-to-end approach. We will achieve this through careful planning, collaboration, and triplet programming.

Front end:
* Docker compose that spins up the React frontend
  * Liam, Nov 3rd
* When you first open the site, it opens to a login page
  * Create a login page where a user can sign in, or a new user can sign up
    * Eric, Liam, Sammi, Nov 24
  * Once logged in, the top bar will have tabs that list “All”, “Tags”, “categories”
    * Create a page that lists all the torrents
      * Eric, Liam, Sammi, Nov 24
    * Create a page that lists all the tags
      * When you click on a given tag, it leads to a page that lists all the torrents that are in that tag
      * Eric, Liam, Sammi, Nov 24
    * Create a page that lists all the categories
      * When you click on a given category, it leads to a page that lists all the torrents that are in that category
      * Eric, Liam, Sammi, Nov 24
* If you are an admin, an additional admin tab is shown
  * On this page, it shows your admin information and lets you delete torrents
    * Eric, Liam, Sammi, Nov 30

Back end
* Working docker compose that spins up the skeleton Go backend service and postgresql database
  * Liam, Nov 3rd
* Go service SQL database and HTTP server skeletons work with an example endpoint that generates example data for the DB
  * Eric, Liam, Sammi, Nov 7th
* Working user registration and login
  * Liam, Eric Sammi Nov 12th
* Working GET, POST, UPDATE, DELETE endpoints for all objects in the database (based on the ER and schema).
  * Eric, Liam, Sammi, Nov 20th
* Working selection / filtering by tags and categories
  * Eric, Liam, Sammi, Nov 25th
