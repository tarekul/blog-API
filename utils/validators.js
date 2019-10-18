const isEmpty = input => {
  if(input.trim() === '') return false
  return true;
}

const validateLogin = (email,password) => {
  const errors = {};
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if(!isEmpty(email)) errors.email = 'email cannot be empty'
  else if(!email.match(emailRegEx)) errors.email = 'email is not valid'

  if(!isEmpty(password)) errors.password = 'password cannot be empty'

  return {
    valid: Object.keys(errors).length > 0 ? false : true,
    errors
  }
}

module.exports = {validateLogin}