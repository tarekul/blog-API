const {db} = require('../utils/db')

const commentService = {};

commentService.read = user_id => {
  return db.any('SELECT * FROM comments WHERE author=${user_id}',{user_id})
}

module.exports = commentService;