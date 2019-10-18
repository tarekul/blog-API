const {db} = require('../utils/db')

const postService = {};

postService.read = user_id => {
  return db.any('SELECT * FROM posts WHERE author=${user_id}',{user_id})
}

module.exports = postService;