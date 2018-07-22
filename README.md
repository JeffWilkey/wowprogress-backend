# artshare
[https://arcane-castle-45295.herokuapp.com/](https://arcane-castle-45295.herokuapp.com/)

A simple node/express/mongo app where you can share art with people

[artshare](https://i.imgur.com/ggfW0P0.jpg)

### Technologies Used
- Node
- Express
- Passport
- MongoDB
- Sass
- Javascript
- jQuery


## API
#### INDEX OF POSTS (GET -> /api/pieces)
#### CREATING A POST (POST -> /api/pieces)
Required Fields:
```json
  {
    "title": "Chroma II",
    "artist": "Dan Mumford",
    "thumbnailUrl": "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/t/5a301f8571c10b0f0555750c/1513103247075/Close_encounters_danmumford.jpg?format=original",
    "fullImageUrl": "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/5a301f1124a694fe6ea639eb/5a301f1e0d9297e3b10cb652/1513103148310/CLOSE_ENCOUNTERS.jpg?format=750w",
    "body": "A description about Chroma II"
  }
```

#### GET A SINGLE POST (GET -> /api/pieces/:id)
#### UPDATING A POST (PUT -> /api/pieces/:id)
Required Fields:
```json
  {
    "id": "09fdasf8aasdf890af8",
    "title": "Chroma III",
    "artist": "Dan Mumford",
    "thumbnailUrl": "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/t/5a301f8571c10b0f0555750c/1513103247075/Close_encounters_danmumford.jpg?format=original",
    "fullImageUrl": "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/5a301f1124a694fe6ea639eb/5a301f1e0d9297e3b10cb652/1513103148310/CLOSE_ENCOUNTERS.jpg?format=750w",
    "body": "A description about Chroma II"
  }
```

#### DELETING A POST (DELETE -> /api/pieces/:id)
