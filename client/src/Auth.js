// Use locally for persistent login
// user: {
//   username: 'pretty_god',
//   userid: '5a9b907a018612b2615949c8'
// },
// isAuthenticated: true,

const fakeAuth = {
  user: {
    username: 'pretty_god',
    userid: '5a9b907a018612b2615949c8'
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
