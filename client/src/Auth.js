// Use locally for persistent login
// user: {
//   username: 'petty_god',
//   userid: '5aa0d3e9aa20e725d53d4542'
// },
// isAuthenticated: true,

const fakeAuth = {
  user: {
    username: 'petty_god',
    userid: '5aa0d3e9aa20e725d53d4542'
  },
  isAuthenticated: true,
  authenticate(cb){
    this.isAuthenticated = true;
    localStorage.setItem('loggedIn', true);
    setTimeout(cb, 100);
  },
  signout(cb) {
    this.isAuthenticated = false;
    localStorage.setItem('loggedIn', false);
    setTimeout(cb, 100);
  }
}

export { fakeAuth };
