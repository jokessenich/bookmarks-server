const express = require('express')
const uuid = require('uuid/v4')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const logger = require('./logger')


const bookmarks=[
{    id: "12",
    url: "www.funny.com"
},
{   id: "13",
    url: "www.bunny.com"
}
]


bookmarksRouter
    .route('/bookmarks')
    .get((req, res)=>{
        res.json(bookmarks);
    })
    .post(bodyParser, (req, res) => {
        const {url} = req.body;
        if (!url) {
          logger.error(`URL is required`);
          return res
            .status(400)
            .send('Invalid data');
        }

        const id = uuid();
      
      const bookmark = {
        id,
        url
      };

      bookmarks.push(bookmark);  
      logger.info(`Card with id ${id} created`);
  
      res
        .status(201)
        .location(`http://localhost:8000/card/${id}`)
        .json(bookmark);
      })
    
bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res)=>{
        const {id} = req.params
        const bookmark = bookmarks.find(b=> b.id==id)

        if(!bookmark){
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Card Not Found');
              
        }
        res.json(bookmark);
    })
    .delete((req, res)=>{
        const {id} = req.params;
        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
  
        if (bookmarkIndex === -1) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res
            .status(404)
            .send('Not found');
        }
      
      
        bookmarks.splice(bookmarkIndex, 1);
      
        logger.info(`Bookmark with id ${id} deleted.`);
      
        res
          .status(204)
          .end();
      });

    module.exports =bookmarksRouter