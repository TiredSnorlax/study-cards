<script lang="ts">
	import type { IDeck } from '$lib/components/types';
	import { db } from '$lib/db/setup';
	import { userStore } from '$lib/stores';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { getAuth } from 'firebase/auth';
	import { goto } from '$app/navigation';

	const auth = getAuth();
	let user = userStore(auth);

	let newName = '';
	let newDescription = '';

	const createNewDeck = async () => {
		if (newName.length === 0 || newDescription.length === 0 || !$user) return;
		let newDeck: IDeck = {
			ownerId: $user.uid,
			permissions: [],
			name: newName,
			description: newDescription,
			createdAt: serverTimestamp(),
			cards: [],
			isPublic: false
		};

		await addDoc(collection(db, 'decks'), newDeck)
			.then((docRef) => {
				console.log('Doc added:', docRef.id);
				goto(`./${docRef.id}/edit`);
			})
			.catch((err) => {
				console.log(err);
			});
	};
</script>

<div class="page">
	<h2>New Deck</h2>
	<div class="fields">
		<p>Name:</p>
		<input type="text" bind:value={newName} />
	</div>
	<div class="fields">
		<p>Description:</p>
		<textarea bind:value={newDescription} />
	</div>
	<button on:click={createNewDeck}>Add</button>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		min-height: 100svh;
		overflow-x: hidden;

		gap: 1rem;
	}

	.fields {
		display: flex;
	}
</style>
