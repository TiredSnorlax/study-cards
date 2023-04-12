<script lang="ts">
	import { getDocs, collection, where, query } from 'firebase/firestore';
	import type { IDeck } from '../types';

	import { auth, db } from '$lib/db/setup';
	import { userStore } from '$lib/stores';

	export let searchResults: IDeck[][] | null;

	let user = userStore(auth);

	let searchTimeout: NodeJS.Timeout;
	const changeSearch = (e: Event) => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			console.log('search');
			let target = e.target as HTMLInputElement;
			executeSearch(target.value || '');
		}, 800);
	};

	const executeSearch = async (searchStr: string) => {
		if (!searchStr || searchStr.length === 0) return;
		searchResults = [[], []];
		const searchQuery = searchStr
			.split(' ')
			.filter((text) => text !== '')
			.map((text) => text.toLowerCase());
		if (searchQuery.length === 0) return;
		console.log(searchQuery);

		const qOwner = query(
			collection(db, 'decks'),
			where('searchIndex', 'array-contains-any', searchQuery),
			where('ownerId', '==', $user?.uid)
		);

		const ownerSnapshot = await getDocs(qOwner);

		const qSharedWith = query(
			collection(db, 'decks'),
			where('sharedWith', 'array-contains', $user?.uid)
		);

		const sharedWithSnapshot = await getDocs(qSharedWith);
		let filteredDecks = sharedWithSnapshot.docs
			.map((doc) => {
				let data = doc.data() as IDeck;
				if (searchQuery.every((index) => data.searchIndex.includes(index))) {
					return data;
				}
				return null;
			})
			.filter((deck) => deck !== null) as IDeck[];

		searchResults[0] = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IDeck));
		searchResults[1] = filteredDecks;
		console.log(searchResults, searchResults.length);
	};
</script>

<div class="container">
	<input
		type="text"
		class="deckSearchBar"
		on:keyup={(e) => changeSearch(e)}
		placeholder="Search for your decks here..."
	/>
	{#if searchResults}
		<div class="searchResults">
			<h3>Made by you</h3>
			{#if searchResults[0].length > 0}
				{#each searchResults[0] as deck}
					<a href="./deck/{deck.id}">
						<div class="resultItem">
							<p>{deck.title}</p>
							<p>created by <span>You</span></p>
						</div>
					</a>
				{/each}
			{:else}
				<p class="warning">No such deck</p>
			{/if}
			<h3>Shared with you</h3>
			{#if searchResults[1].length > 0}
				{#each searchResults[1] as deck}
					<div class="resultItem">
						<p>{deck.title}</p>
						<p />
					</div>
				{/each}
			{:else}
				<p class="warning">No such deck</p>
			{/if}
			<button on:click={() => (searchResults = null)} class="closeBtn">Close</button>
		</div>
	{/if}
</div>

<style>
	.container {
		position: relative;
		min-width: 200px;
		max-width: 600px;
		margin-inline: auto;
		margin-top: 2rem;
	}

	.deckSearchBar {
		width: 100%;
		border: 2px solid var(--primary-color);
		border-radius: 3rem;
		padding: 0.5rem 1rem;
		font-size: 1.2rem;
		color: var(--primary-color);

		transition: 0.3s;
	}

	.deckSearchBar:focus {
		background: var(--primary-color);
		color: grey;
	}

	h3 {
		font-weight: normal;
		font-size: 1.5rem;
	}

	a {
		text-decoration: none;
		color: initial;
	}

	.searchResults {
		position: absolute;

		left: 1.5rem;
		right: 1.5rem;
		top: 100%;
		background: var(--primary-color);
		padding: 1rem;

		border-radius: 0.5rem;
		border-top-left-radius: 0px;
		border-top-right-radius: 0px;

		display: flex;
		flex-direction: column;

		max-height: 400px;
		overflow-y: auto;

		cursor: pointer;
	}

	.resultItem {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		color: grey;

		position: relative;
	}

	.resultItem p:first-child {
		font-weight: bold;
		color: initial;
	}

	.resultItem span {
		color: initial;
		font-weight: bold;
	}

	.resultItem::after {
		content: '';
		position: absolute;
		inset: 0;

		opacity: 0;
		background: rgba(0, 0, 0, 0.1);
	}

	.resultItem:hover::after {
		opacity: 1;
	}

	p.warning {
		text-align: center;
		color: grey;
	}

	.closeBtn {
		margin-top: 2rem;
		color: grey;
		font-size: 1rem;
		cursor: pointer;
	}
</style>
