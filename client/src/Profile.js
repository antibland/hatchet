import React from 'react';
import { fakeAuth } from './Auth.js';

const Profile = () => (
  <div>Welcome, {fakeAuth.user.username}!</div>
)

export default Profile;
