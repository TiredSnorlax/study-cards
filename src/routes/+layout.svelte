<script lang="ts">
	import { currentProfile, userStore } from '$lib/stores';
	import { signInWithPopup, GoogleAuthProvider, type User } from 'firebase/auth';
	import { auth, db } from '$lib/db/setup';
	import { onDestroy } from 'svelte';
	import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
	import type { IProfile } from '$lib/components/types';

	const provider = new GoogleAuthProvider();

	const currentUser = userStore(auth);

	let isSignedIn = false;

	const signIn = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				console.log(result.user);
				getOrAddProfile(result.user);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	const getOrAddProfile = async (user: User | null) => {
		if (!user) return;
		const profileDb = collection(db, 'profiles');
		const q = query(profileDb, where('userId', '==', user.uid));

		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			console.log('adding profile');
			const newProfile: IProfile = {
				recentlyAccessed: [],
				starred: [],
				userId: user.uid,
				username: user.displayName || '',
				bgColor: '#ffffff',
				primaryColor: '#d0d0d0',
				secondaryColor: '#4444ff',
				darkTheme: false
			};

			currentProfile.set(newProfile);
			await addDoc(profileDb, newProfile);
		} else {
			console.log('profile', snapshot.docs[0].data());
			currentProfile.set(snapshot.docs[0].data() as IProfile);
		}
	};

	const setColors = (profile: IProfile | null) => {
		if (!profile || typeof window === 'undefined') return;
		window.document.body.style.background = profile.bgColor;
		window.document.body.style.setProperty('--primary-color', profile.primaryColor);
		window.document.body.style.setProperty('--secondary-color', profile.secondaryColor);
		window.document.body.style.color = profile.darkTheme ? 'white' : 'black';
	};

	const unsubscribe = currentUser.subscribe((user) => {
		if (!user) {
			isSignedIn = false;
			console.log('not signed in');
		} else {
			isSignedIn = true;
			console.log('signed in');
		}
	});

	$: getOrAddProfile($currentUser);
	$: setColors($currentProfile);

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if isSignedIn}
	<slot />
{:else}
	<div class="backdrop">
		<div class="signInMenu">
			<h1>Sign In</h1>
			<button on:click={signIn} class="signInBtn">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">
					<path
						d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"
					/></svg
				>
				<p>Sign in with Google</p></button
			>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		background: rgba(0, 0, 0, 0.3);
		position: fixed;
		inset: 0;
	}

	.signInMenu {
		position: fixed;
		width: 250px;
		height: 300px;
		background: white;

		padding: 1rem;

		inset: 0;
		margin: auto;

		border-radius: 1rem;

		display: flex;
		flex-direction: column;
	}

	.signInMenu h1 {
		margin-bottom: 1rem;
	}

	.signInBtn {
		display: flex;
		gap: 1rem;
		align-items: center;
		background: #0294fc;
		padding: 0.5rem;
		color: white;
		border-radius: 5px;
	}

	.signInBtn svg {
		stroke: white;
		fill: white;
	}

	.signInBtn p {
		flex: 1 1 auto;
		font-size: 1rem;
	}
</style>
