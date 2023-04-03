<script lang="ts">
	import { page } from '$app/stores';
	import type { IDeck } from '$lib/components/types';
	import { getDoc, doc } from 'firebase/firestore';
	import { db, auth } from '$lib/db/setup';
	import { userStore } from '$lib/stores';
	import type { User } from 'firebase/auth';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { goto } from '$app/navigation';

	const user = userStore(auth);

	let deckData = writable<IDeck | null>(null);

	const getDeck = async (user: User | null) => {
		if (!user) return;
		console.log('get deck');
		const docRef = doc(db, 'decks', $page.params.id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			let _data = docSnap.data() as IDeck;
			if (_data) {
				console.log(_data);
				deckData.set({ ..._data, id: docSnap.id });
			}
		} else {
			console.log('No such document!');
			goto('./');
		}
	};

	$: getDeck($user);

	setContext('deckData', deckData);
</script>

{#if $deckData}
	<slot />
{/if}
