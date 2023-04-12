<script lang="ts">
	import type { IDeck } from '$lib/components/types';
	import { auth, db } from '$lib/db/setup';
	import { userStore } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	import HomeBtn from '$lib/components/HomeBtn.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import ShareMenu from '$lib/components/ShareMenu.svelte';
	import { page } from '$app/stores';
	import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import type { User } from 'firebase/auth';

	const user = userStore(auth);

	const deckData = getContext<Writable<IDeck>>('deckData');

	let allowed = true;

	let shareMenuOpen = false;

	const checkAllowed = (user: User | null) => {
		if (!user || !deckData) return;
		let sharing = $page.url.searchParams.has('sharing');
		if ($deckData.isPublic) {
			updateSharedWith(sharing);
		} else if ($deckData.ownerId === user?.uid) {
			console.log('allowed');
		} else if ($deckData.permissions.find((email) => email === user?.email)) {
			console.log('allowed');
			updateSharedWith(sharing);
		} else {
			console.log('not allowed');
			allowed = false;
		}
	};

	const updateSharedWith = async (_sharing: boolean) => {
		if (!$deckData.id) return;
		console.log('update sharing');
		const ref = doc(db, 'decks', $deckData.id);
		await updateDoc(ref, {
			sharedWith: arrayUnion($user?.uid)
		});
	};

	checkAllowed($user);
</script>

<div class="page">
	<HomeBtn path={'../../'} />
	<Profile />
	{#if shareMenuOpen}
		<ShareMenu deckId={$deckData.id} bind:shareMenuOpen />
	{/if}
	{#if allowed}
		<div class="menu">
			<div class="menu__img">Img placed here</div>
			<div class="menu__deck">
				{#if deckData}
					<div class="menu__info">
						<button class="shareBtn" on:click={() => (shareMenuOpen = true)}
							><span class="material-icons-outlined"> share </span></button
						>
						<h1>{$deckData.title}</h1>
						<p>{$deckData.description}</p>
						{#if $deckData.ownerId === $user?.uid}
							<a href="./{$deckData.id}/edit/" class="edit__btn"
								><span class="material-icons-outlined"> edit </span>Edit</a
							>
						{/if}
					</div>
					<div class="btn__container">
						<a href="./{$deckData.id}/study/" class="study__btn"
							><span class="material-icons-outlined"> play_arrow </span></a
						>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<p>You have no access to this deck</p>
	{/if}
</div>

<style>
	.page {
		display: flex;
		justify-content: center;
		align-items: center;

		height: 100vh;
		overflow: hidden;
	}

	.menu {
		width: 80%;
		max-width: 800px;
		height: 60%;
		max-height: 600px;

		background: var(--primary-color);

		border-radius: 0.5rem;
		border: 1px solid black;
		display: grid;
		align-items: stretch;
		justify-content: center;
		grid-template-columns: 3fr 2fr;
		text-align: center;
	}

	.menu__img {
		background: blueviolet;
	}

	.menu__deck {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 2rem;
	}

	.menu__info {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.menu__info h1 {
		font-size: 3rem;
	}

	.menu__info p {
		font-size: 1.2rem;
		color: grey;
	}

	.shareBtn {
		background: #aaaaff;
		padding: 0.5rem 1rem;
		border-radius: 3rem;
		color: white;

		margin-top: 1rem;
		margin-right: 1rem;
		align-self: flex-end;

		text-decoration: none;
	}

	.shareBtn span {
		display: flex;
	}

	.edit__btn {
		padding: 0.5rem;
		border-radius: 5px;
		font-size: 1.2rem;
		background: green;

		color: white;
		text-decoration: none;
		width: min-content;

		margin-top: 1rem;

		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.menu .btn__container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-inline: 1rem;
	}

	.btn__container > a {
		color: white;
		font-size: 1.2rem;

		text-decoration: none;
	}

	.btn__container .study__btn {
		background: var(--secondary-color);
		border-radius: 50%;
		padding: 1rem;

		display: flex;
	}

	.btn__container .study__btn span {
		font-size: 2.5rem;
	}

	@media (max-width: 600px) {
		.menu {
			grid-template-columns: 1fr;
			grid-template-rows: 2fr 3fr;
		}

		.menu__info h1 {
			font-size: 2rem;
		}

		.study__btn {
			padding: 0.75rem !important;
		}

		.study__btn span {
			font-size: 2rem !important;
		}

		.edit__btn {
			font-size: 1rem;
		}
	}
</style>
