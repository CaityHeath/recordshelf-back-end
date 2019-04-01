'use strict';

require('dotenv').config();
const PORT = process.env.PORT;
const express = require('express');
const app = express();
app.listen(PORT, ()=> console.log(`listening on port ${PORT}`));

const superagent = require('superagent');

const DISCOGS_API_KEY = process.env.DISCOGS_API_KEY;
const DISCOGS_API_SECRET = process.env.DISCOGS_API_SECRET;

app.get('/search', createMusicSearch);


app.get('/testing', (req, res) => {
  res.send('hiiiii');
});


function createMusicSearch(request, response){

  let query = request.body.results.artist;
  let url = `https://api.discogs.com/database/search?per_page=15&artist=${query}&artist&key=${DISCOGS_API_KEY}&secret=${DISCOGS_API_SECRET}`;
  
  superagent.get(url)
    .then(response => response.body.results.map(result => {
      return new Music(result);
    }))
    .then(newMusic =>{
      console.log(newMusic);
      return response.send(newMusic);
    })
    .catch(error => console.error(error));
}


function Music(data){
  this.title = data.title.replace(/^.*-/, '');
  this.image = data.cover_image;
}


