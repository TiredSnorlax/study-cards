import { writable } from "svelte/store";
import type { IUser } from "./components/types";
import { onAuthStateChanged, type Auth } from 'firebase/auth'

export let currentUser = writable<IUser | null>(null);

export let userStore = (auth: Auth) => {
  let unsubscribe: () => void;

  const user = writable(auth.currentUser, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    })

    return () => unsubscribe();
  });

  return user

}
