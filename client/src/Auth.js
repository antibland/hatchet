// Use locally for persistent login
// user: {
//   username: 'petty_god',
//   userid: '5aa0d3e9aa20e725d53d4542'
// },
// isAuthenticated: true,

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
};

const auth = {
  user: {
    username: null,
    userid: null,
    token: null,
    avatar: null
  },
  isAuthenticated: false,
  hasValidToken() {
    let userObject = localStorage.getObject('user');

    if (userObject !== null) {
      this.user = userObject;
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }

    return this.isAuthenticated;
  },
  authenticate(cb){
    setTimeout(cb, 100);
  },
  signout(cb) {
    localStorage.removeItem('user');
    this.hasValidToken();
    setTimeout(cb, 100);
  }
}

export { auth };
