<script lang="ts">
	import { page } from '$app/stores';
	import type { IProfile } from '$lib/components/types';
	import { db } from '$lib/db/setup';
	import { onMount } from 'svelte';
	import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
	import HomeBtn from '$lib/components/HomeBtn.svelte';

	let profileId: string | null = null;
	let profile: IProfile | null;
	let newProfile: IProfile = {
		recentlyAccessed: [],
		starred: [],
		username: '',
		userId: '',
		bgColor: '#ffffff',
		primaryColor: '#d0d0d0',
		secondaryColor: '',
		darkTheme: false
	};

	let saving = false;

	const changeBg = (color: string) => {
		if (!color || typeof window === 'undefined') return;
		window.document.body.style.background = color;
	};

	const changePrimary = (color: string) => {
		if (!color || typeof window === 'undefined') return;
		window.document.body.style.setProperty('--primary-color', color);
	};

	const changeSecondary = (color: string) => {
		if (!color || typeof window === 'undefined') return;
		window.document.body.style.setProperty('--secondary-color', color);
	};

	const changeTheme = (event: Event) => {
		if (typeof window === 'undefined') return;
		let target = event.target as HTMLInputElement;
		let isDarkTheme = target.checked;
		window.document.body.style.color = isDarkTheme ? 'white' : 'black';
	};

	const getProfile = async () => {
		const profileDb = collection(db, 'profiles');
		const q = query(profileDb, where('userId', '==', $page.params.id));

		const snapshot = await getDocs(q);

		if (!snapshot.empty) {
			profile = snapshot.docs[0].data() as IProfile;
			profileId = snapshot.docs[0].id;
			newProfile = { ...profile };
			console.log(profile);
		} else {
			console.log('no profile');
		}
	};

	const saveProfile = async () => {
		if (!profileId) return;
		saving = true;
		let ref = doc(db, 'profiles', profileId);
		await updateDoc(ref, { ...newProfile });
		profile = { ...newProfile };
		saving = false;
	};

	$: changeBg(newProfile.bgColor);
	$: changePrimary(newProfile.primaryColor);
	$: changeSecondary(newProfile.secondaryColor);

	onMount(() => {
		getProfile();
	});
</script>

<HomeBtn path={'../../'} />
<main>
	<section>
		<h2>Information</h2>
		<div>
			<p>Username:</p>
			<input type="text" bind:value={newProfile.username} />
		</div>
	</section>
	<section class="color">
		<h2>Color Preferences</h2>
		<div>
			<div>
				<p>Background:</p>
				<span>Background color</span>
			</div>
			<label
				for="background-color-input"
				class="colorLabel"
				style="background: {newProfile.bgColor}"
			/>
			<input id="background-color-input" type="color" bind:value={newProfile.bgColor} hidden />
		</div>
		<div>
			<div>
				<p>Primary:</p>
				<span>Color of containers of content such as the one this is in</span>
			</div>
			<label
				for="primary-color-input"
				class="colorLabel"
				style="background: {newProfile.primaryColor}"
			/>
			<input id="primary-color-input" type="color" bind:value={newProfile.primaryColor} hidden />
		</div>
		<div>
			<div>
				<p>Secondary:</p>
				<span>Color of interactable or important buttons/inputs</span>
			</div>
			<label
				for="secondary-color-input"
				class="colorLabel"
				style="background: {newProfile.secondaryColor}"
			/>
			<input
				id="secondary-color-input"
				type="color"
				bind:value={newProfile.secondaryColor}
				hidden
			/>
		</div>
		<div>
			<div>
				<p>Dark Theme</p>
				<span
					>This would change the font color. Dark theme would have a white font on non-action text</span
				>
			</div>
			<input type="checkbox" bind:value={newProfile.darkTheme} on:change={changeTheme} />
		</div>
	</section>
</main>
<button class="saveProfileBtn" class:saving on:click={saveProfile}
	>{saving ? 'Saving' : 'Save'}</button
>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-items: flex-start;
		align-items: center;
		gap: 1rem;

		padding: 2rem;
		padding-top: 6rem;
	}

	section {
		border-radius: 1rem;
		padding: 2rem;
		padding-top: 1rem;
		background: var(--primary-color);

		max-width: 600px;
		width: 100%;

		font-size: 1.2rem;
	}

	section h2 {
		font-size: 2rem;
	}

	section > div {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		margin-top: 1rem;
	}

	section > div > *:nth-child(2) {
		flex-shrink: 0;
	}

	section span {
		font-size: 0.9rem;
		color: grey;
	}

	section input[type='text'] {
		background: rgba(200, 200, 200, 0.5);
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-align: center;
		font-size: 1rem;
		min-width: 0px;
		flex-shrink: 1 !important;
	}

	section.color label {
		width: 3.5rem;
		height: 2rem;
		border: 1px solid black;
		border-radius: 0.5rem;
	}

	.saveProfileBtn {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		padding: 0.5rem 1.5rem;

		background: var(--secondary-color);
		color: white;
		border-radius: 0.5rem;

		font-size: 1.2rem;
	}

	@media (max-width: 600px) {
		main {
			padding: 1rem;
			padding-top: 5rem;
		}

		section {
			font-size: 1rem;
		}

		section span {
			font-size: 0.8rem;
			color: grey;
		}
	}
</style>
