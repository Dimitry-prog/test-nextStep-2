'use client';

import { signOut } from "next-auth/react";

const Profile = () => {
  return (
    <button onClick={() => signOut()} type='button'>
      Logout
    </button>
  );
};

export default Profile;