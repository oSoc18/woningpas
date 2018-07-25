# woningpas

## Introduction

How could blockchain enable more efficient and secure storage of official documents about houses, such as sustainability documents or EPC certificates? Team woningpas was asked by the Flemish government to explore this question.

Our answer: "it's complicated!" Thanks to building a working prototype we have discovered how a blockchain application could be architected for the woningpas and what challenges remain that need to be solved in the future.

## Installation

### Requirements

* Node.JS (^v8.x.x)
* npm (^v3.x.x)

### Before anything

Clone the github repositery first and open a terminal in the repositery.

### Backend

``` bash
# move into the backend folder
cd backend

# install dependencies
npm install

# start
npm start
```

Should be launched before the front end.

More information about the API can be found [here](backend/API.md)

### Frontend

``` bash
# move into the frontend folder
cd frontend

# install dependencies
npm install

# start
npm start
```

Now open your browser to http://localhost:8181/

> PS: Don't forget to start the backend

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
