const admin = require('firebase-admin');
const config = require('../utils/config')
admin.initializeApp(config);

exports.FbAuth = (req,res,next) => {
  let {authorization} = req.headers
  if(!authorization.startsWith('Bearer ')) return res.status(403).json({error:'unauthorized'})
  const token = authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      let uid = decodedToken.uid
      req.uid = uid;
      next();
    })
    .catch(err => {
      console.error(err);
      return res.status(403).json({error:err.code})
    })
}

