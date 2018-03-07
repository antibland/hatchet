// Use locally for persistent login
// user: {
//   username: 'pretty_god',
//   userid: '5a9b907a018612b2615949c8'
// }

const fakeAuth = {
  user: {
    username: null,
    userid: null
  },
  isAuthenticated: false,
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
