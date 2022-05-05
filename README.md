# Mock Pokedex 

This is a mock pokedex project which has a simple authentication module 
and provides access to a mongoose database in the cloud.



## How to Use: 

This is the Home page. Specific Pokemon can be found/searched if you know their NAME or POKEDEX #. 
A list of Pokemon can be found/searched by TYPE, CATEGORY, and/or a minimum CAPTURE RATE. You can view your PERSONAL DATA by clicking the link at the bottom. 
<img class="image w-100" src="/public/images/homePg.png"></img>

From the searches, Pokemon can be marked as SEEN, CAUGHT, and/or FAVORITE using the checkboxes. Click the SET button to complete the process. From the NAME/POKEDEX# searches, the option will be at the bottom underneath all of the Pokemon data presented. From the TYPE/CATEGORY/CAPTURE RATE searches, the option will be on the right-most column of the tables. 
<img class="image w-100" src="/public/images/specificSearch.png"></img>
<img class="image w-100" src="/public/images/specificSearch-checkboxes.png"></img>
<img class="image w-100" src="/public/images/listSearch.png"></img>

NOTE: User must be logged in to add Pokemon to SEEN/CAUGHT/FAVORITE lists. If not logged in, user will be redirected to the login/signup page, where they can either log in to an existing account or create one. To access the login/signup page, user can select LOGIN/SIGNUP from the nav-bar.
<img class="image w-100" src="/public/images/login-signup.png"></img>

There are 4 different ways to view Personal Data. ALL DATA page shows a three-way summary/view of user's SEEN/CAUGHT/FAVORITE Pokemon. There are also individual pages for each category. Pages can be access through the nav-bar dropdown (labeled "My Data"). Clicking on Pokemon images on these 4 pages will bring the user to the page specific to that Pokemon. Pokemon names on the ALL DATA page also link to the page specific to that Pokemon. 
<img class="image w-100" src="/public/images/allData.png"></img>
<img class="image w-100" src="/public/images/specificData.png"></img>

The user can remove the Pokemon from their lists in two different ways. The first is by leaving the checkbox associated to the category blank/unchecked for that Pokemon and clicking the SET button (check the categories you want marked and leave the ones you'd wish to remove them from to update the data). The second is by clicking the "X" on the ALL DATA page next to the Pokemon you want to remove from that category, or by clicking the "Remove from SEEN/CAUGHT/FAVORITE" at the bottom underneath all of the Pokemon data presented when on those specific data pages. 
<img class="image w-100" src="/public/images/allData-remove.png"></img>
<img class="image w-100" src="/public/images/specificData-remove.png"></img>



## Installation
Download the project from github and download nodejs and npm from https://nodejs.org
and cd into the folder

Install the packages with
``` bash
npm install
```
Start the project with
``` bash
node app.js
```
or install nodemon (the node monitoring app) with
``` bash
npm install -g nodemon
```
and start the project with
``` bash
nodemon
```
or go to the mock pokedex website at: 
https://mockpokedex.herokuapp.com/



## Video Link:

