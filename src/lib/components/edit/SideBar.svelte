<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { IDeck } from '$lib/components/types';

	export let sideChanged: boolean;
	export let sideOpen: boolean;
	export let newTitle: string;
	export let newDescription: string;
	export let newPermissions: string[];
	export let newIsPublic: boolean;

	$: sideChanged = hasSideChanged(newTitle, newDescription, newPermissions, newIsPublic);

	const deckData = getContext<Writable<IDeck>>('deckData');

	let emailToAdd = '';

	const hasSideChanged = (
		newTitle: string,
		newDescription: string,
		newPermissions: string[],
		newIsPublic: boolean
	) => {
		return (
			$deckData.title !== newTitle ||
			$deckData.description !== newDescription ||
			[...$deckData.permissions].sort().toString() !== newPermissions.sort().toString() ||
			$deckData.isPublic !== newIsPublic
		);
	};

	const addUserPerm = async () => {
		newPermissions = [...newPermissions, emailToAdd];
		emailToAdd = '';
	};

	const removeUserPerm = async (emailToRemove: string) => {
		newPermissions = newPermissions.filter((email) => email !== emailToRemove);
	};
</script>

<div class="side" class:open={sideOpen}>
	<button class="sideToggle" on:click={() => (sideOpen = !sideOpen)}
		>{#if sideOpen}
			<span class="material-icons-outlined"> close </span>
		{:else}
			<span class="material-icons-outlined"> menu </span>
		{/if}</button
	>
	<a href="./" class="backBtn">
		<span class="material-icons-outlined"> arrow_back_ios </span>
		Go back</a
	>
	<div>
		<input type="text" bind:value={newTitle} class="titleInput" />
		<textarea bind:value={newDescription} class="descriptionInput" rows="5" />
	</div>

	<h2>
		Access
		<button
			on:click={() => (newIsPublic = !newIsPublic)}
			class="isPublicField"
			class:true={!newIsPublic}
		>
			<span class="material-icons-outlined"> {newIsPublic ? 'lock_open' : 'lock'} </span>
		</button>
	</h2>
	<div class="searchBar">
		<input type="text" bind:value={emailToAdd} />
		<button on:click={addUserPerm}>Add</button>
	</div>
	<div class="permList">
		{#each newPermissions as email}
			<div class="permItem">
				<p>{email}</p>
				<button on:click={() => removeUserPerm(email)}
					><span class="material-icons-outlined"> close </span></button
				>
			</div>
		{/each}
	</div>
</div>

<style>
	.backBtn {
		border-radius: 3rem;
		border: 1px solid grey;
		padding: 0.5rem 1rem;

		font-size: 1.2rem;
		text-decoration: none;
		color: grey;

		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.backBtn span {
		font-size: 1.2rem;
	}

	.side {
		flex-shrink: 0;
		background: var(--primary-color);

		width: 330px;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 1rem;

		padding: 1.5rem 1rem;
		padding-right: 0;
		margin-left: calc(-330px + 3rem);

		transition: 0.3s;
	}

	.side > * {
		margin-right: 3rem;
		transition: 0.3s;
	}

	.side.open > * {
		margin-right: 1rem;
	}

	.sideToggle {
		position: sticky;
		top: 1rem;
		left: 1.5rem;
		color: grey;
		z-index: 10;
		font-size: 1rem;

		margin-right: 0;
		transform: translateX(-50%);
	}

	.side.open .sideToggle {
		margin-right: 0;
	}

	.side.open {
		margin-left: 0;
	}

	.side .titleInput {
		font-weight: bold;
		font-size: 2.5rem;
		text-align: center;
		margin-bottom: 1rem;

		width: 100%;
	}

	.side .descriptionInput {
		font-size: 1.2rem;
		background: none;
		border: 1px solid grey;
		outline: none;
		border-radius: 0.5rem;
		resize: none;
		padding: 0.5rem;

		width: 100%;
	}

	h2 {
		margin-top: 1rem;
		font-size: 2rem;

		display: flex;
		gap: 1rem;
	}

	.isPublicField {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.isPublicField span {
		color: grey;
		display: flex;
		font-size: 2rem;
	}

	.isPublicField.true span {
		color: #4040ff;
	}

	.searchBar {
		border: 1px solid grey;
		border-radius: 0.5rem;
		padding: 0.5rem;
		background: white;
	}

	.searchBar input {
		font-size: 1rem;
	}

	.permList {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 1rem;
	}

	.permList .permItem {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		border-radius: 3rem;
		padding: 0.5rem 1rem;
		border: 1px solid grey;

		max-width: 200px;

		font-size: 1rem;
		background: #e0e0e0;
	}

	.permItem p {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.permItem button span {
		display: flex;
		color: grey;
		font-size: 1rem;
	}

	.permItem button:hover {
		cursor: pointer;
	}

	.permItem button span:hover {
		color: red;
	}
</style>
