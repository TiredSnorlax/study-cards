import { writable } from "svelte/store";
import type { IProfile, IUser } from "./components/types";
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth'

export let currentUser = writable<IUser | null>(null);

export let userStore = (auth: Auth) => {
  let unsubscribe: () => void;

  const user = writable<User | null>(null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    })

    return () => unsubscribe();
  });

  return user

}
export let currentProfile = writable<IProfile | null>(null);

