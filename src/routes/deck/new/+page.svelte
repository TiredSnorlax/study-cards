<script lang="ts">
	import type { IDeck } from '$lib/components/types';
	import { db } from '$lib/db/setup';
	import { userStore } from '$lib/stores';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { getAuth } from 'firebase/auth';
	import { goto } from '$app/navigation';

	const auth = getAuth();
	let user = userStore(auth);

	let newTitle = '';
	let newDescription = '';

	const createNewDeck = async () => {
		if (newTitle.length === 0 || newDescription.length === 0 || !$user) return;
		let newDeck: IDeck = {
			ownerId: $user.uid,
			permissions: [],
			sharedWith: [],
			title: newTitle,
			searchIndex: newTitle.split(' '),
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
	<div class="menu">
		<h2>Create Deck</h2>
		<div class="fields title">
			<input type="text" bind:value={newTitle} placeholder="Eg: Physics Chapter 13" />
		</div>
		<div class="fields description">
			<p>Description:</p>
			<textarea bind:value={newDescription} rows="7" />
		</div>
		<button on:click={createNewDeck} class="addBtn">
			<span class="material-icons-outlined"> add </span>Create</button
		>
	</div>
</div>

<style>
	.page {
		display: flex;
		justify-content: center;
		align-items: center;

		min-height: 100svh;
		overflow-x: hidden;

		gap: 1rem;
	}

	.menu {
		background: var(--primary-color);
		padding: 2rem;
		border-radius: 1rem;

		max-width: 500px;
		width: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		gap: 2rem;
	}

	.fields {
		display: flex;
		flex-direction: column;
	}

	.fields input,
	.fields textarea {
		background: rgba(200, 200, 200, 0.4);
		border-radius: 0.5rem;
		padding: 0.5rem;

		border: none;
		outline: none;
	}

	.fields.title input {
		font-size: 1.5rem;
		padding: 0.75rem;
		text-align: center;
	}

	.fields.description {
		font-size: 1.2rem;
	}
	.fields.description textarea {
		resize: none;
		font-size: 1rem;
		font-family: inherit;
		margin-top: 1rem;
	}

	.addBtn {
		display: flex;
		justify-content: center;
		align-items: center;

		align-self: center;
		border: 2px solid var(--secondary-color);

		background: var(--secondary-color);
		padding: 0.5rem 1rem;
		width: min-content;

		border-radius: 3rem;
		font-size: 1.2rem;
		color: white;

		gap: 0.5rem;

		cursor: pointer;
	}

	.addBtn span {
		font-size: 1.5rem;
	}

	.addBtn:hover {
		color: var(--secondary-color);
		background: white;
	}
</style>
