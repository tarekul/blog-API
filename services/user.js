const {db} = require('../utils/db')

const userService = {}

userService.read = id => {
  return db.one('SELECT * FROM users WHERE id=${id}',{id})
}

userService.readWuid = uid => {
  return db.one('SELECT * FROM users WHERE uid=${uid}',{uid})
}

userService.create = (username,email,uid) =>{
  return db.none('INSERT INTO users (username,email,uid) VALUES (${username},${email},${uid})',{username,email,uid})
}

userService.update = (username,email,uid) => {
  const arr = [username,email] 
  const arrString = ['username','email'] 
  let sqlStr = 'UPDATE users SET ' + arr.reduce((acc,element,i) =>{
    if(element){
      acc += arrString[i] + '=${' + arrString[i] + '},'
    }
    return acc;
  },'')

  
  sqlStr = sqlStr.slice(0,sqlStr.length - 1)
  sqlStr += ' WHERE uid=${uid}'

  console.log(sqlStr)
  return db.none(sqlStr,{username,email,uid})
}

userService.delete = uid =>{
  return db.none('DELETE FROM users WHERE uid=${uid}',{uid})
}


module.exports = userService;