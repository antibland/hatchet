const fakeAuth = {
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
