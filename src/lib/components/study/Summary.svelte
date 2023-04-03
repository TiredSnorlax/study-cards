<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ICard, IDeck, IReport, ISummary } from '../types';

	import {
		arrayUnion,
		collection,
		doc,
		getDocs,
		limit,
		query,
		serverTimestamp,
		updateDoc,
		addDoc,
		where,
		Timestamp
	} from 'firebase/firestore';
	import { db } from '$lib/db/setup';

	export let easyQns: string[] = [];
	export let hardQns: string[] = [];
	export let cards: ICard[] = [];
	export let displaySummary: boolean;
	export let deckData: IDeck;

	let existingSummary: ISummary | null = null;

	let easyCards = easyQns.map((id) => cards.find((card) => card.id === id));
	let hardCards = hardQns.map((id) => cards.find((card) => card.id === id));

	let currentReport: IReport = {
		numEasy: easyQns.length,
		numHard: hardQns.length,
		total: cards.length,
		date: Timestamp.now()
	};

	let pieEle: HTMLCanvasElement;
	let lineEle: HTMLCanvasElement;

	const createPieGraph = async () => {
		if (!pieEle) return;
		const data = {
			labels: ['Easy Questions', 'Normal Questions', 'Hard Questions'],
			datasets: [
				{
					label: 'Questions',
					data: [easyQns.length, cards.length - easyQns.length - hardQns.length, hardQns.length],
					backgroundColor: ['Green', 'Yellow', 'Red']
				}
			]
		};

		const config: any = {
			type: 'doughnut',
			data: data,
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Questions Distribution'
					}
				}
			}
		};
		new Chart(pieEle, config);
	};

	const timeStampToString = (ts: Timestamp) => {
		let date = ts.toDate();
		return `${date.getDate()}/${date.getMonth() + 1}`;
	};

	const createLineGraph = async () => {
		if (!lineEle) return;
		let easyData: number[] = [];
		let hardData: number[] = [];
		let dates: string[] = [];
		if (existingSummary) {
			console.log('there is an existing summary');
			easyData = existingSummary.pastReports.map((reports) => reports.numEasy);
			hardData = existingSummary.pastReports.map((reports) => reports.numHard);
			dates = existingSummary.pastReports.map((report) => {
				let dateTS = report.date as Timestamp;
				return timeStampToString(dateTS);
			});
		}

		const data = {
			labels: [...dates, timeStampToString(Timestamp.now())],
			datasets: [
				{
					label: 'Easy Count',
					data: [...easyData, currentReport.numEasy],
					backgroundColor: 'Green',
					borderColor: 'Green'
				},
				{
					label: 'Hard Count',
					data: [...hardData, currentReport.numHard],
					backgroundColor: 'Red',
					borderColor: 'Red'
				}
			]
		};

		const config: any = {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Past Distributions'
					}
				}
			}
		};
		new Chart(lineEle, config);
	};

	const saveSummary = async () => {
		if (existingSummary && existingSummary.id) {
			console.log('get existing summary');
			const ref = doc(db, 'summaries', existingSummary.id);

			await updateDoc(ref, {
				pastReports: arrayUnion(currentReport),
				lastUpdated: serverTimestamp()
			});
		} else {
			console.log('create new summary');
			if (!deckData.id) return;
			// TODO: Change owner id
			let newSummary: ISummary = {
				deckId: deckData.id,
				userId: 'owner',
				pastReports: [currentReport],
				lastUpdated: serverTimestamp()
			};

			await addDoc(collection(db, 'summaries'), newSummary);
		}
		console.log('summary saved');
	};

	const getExistingSummary = async () => {
		const summaryRef = collection(db, 'summaries');
		const q = query(
			summaryRef,
			where('deckId', '==', deckData.id),
			where('userId', '==', 'owner'),
			limit(1)
		);

		const existingDocSnapshot = await getDocs(q);

		if (existingDocSnapshot.empty === false) {
			let _doc = existingDocSnapshot.docs[0];
			existingSummary = { id: _doc.id, ..._doc.data() } as ISummary;
		}
		createPieGraph();
		createLineGraph();
	};

	onMount(() => {
		getExistingSummary();

		console.log(Timestamp.now().toDate());
	});
</script>

<div class="menu" transition:fade={{ duration: 500 }}>
	<div class="top">
		<h1>Summary</h1>
		<button on:click={saveSummary} class="saveBtn">Save</button>
	</div>
	<div class="scrollable">
		<div class="graphsContainer">
			<div>
				<canvas bind:this={pieEle} />
			</div>
			<div>
				<canvas bind:this={lineEle} />
			</div>
		</div>
		<h2>Hard Questions</h2>
		<div class="questions">
			{#if hardCards.length > 0}
				{#each hardCards as card, i}
					{#if card}
						<div class="questionItem">
							<p>{i + 1}.</p>
							<p>{card.question}</p>
						</div>
					{/if}
				{/each}
			{:else}
				<p>None</p>
			{/if}
		</div>
		<h2>Easy Questions</h2>
		<div class="questions">
			{#if easyCards.length > 0}
				{#each easyCards as card, i}
					{#if card}
						<div class="questionItem">
							<p>{i + 1}.</p>
							<p>{card.question}</p>
						</div>
					{/if}
				{/each}
			{:else}
				<p>None</p>
			{/if}
		</div>
	</div>
	<button class="closeBtn" on:click={() => (displaySummary = false)}>Close</button>
</div>

<style>
	.menu {
		position: fixed;
		z-index: 10;
		width: 100%;
		max-width: 800px;
		max-height: 600px;
		inset: 0;
		margin: auto;

		padding: 1rem;
		background: whitesmoke;
		border-radius: 0.5rem;

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.top {
		position: relative;
	}

	.top h1 {
		text-align: center;
	}

	.saveBtn {
		background: Blue;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		font-size: 1rem;
		color: white;

		position: absolute;
		top: 0;
		right: 1rem;
	}

	.menu > div {
		width: 100%;
	}

	.menu .scrollable {
		flex: 1 1 auto;

		display: flex;
		flex-direction: column;
		align-items: center;
		overflow-y: auto;

		padding: 2rem 1rem;
	}

	.graphsContainer {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		flex-wrap: wrap;
	}

	.graphsContainer > div {
		flex: 1 1 250px;

		aspect-ratio: 1;

		position: relative;
	}

	canvas {
		position: absolute;
		width: 350px;
		height: 350px;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	.scrollable h2 {
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

	.questions {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		width: 100%;
	}

	.questionItem {
		display: flex;
		gap: 1rem;
		width: 100%;

		font-size: 1.3rem;
	}

	.questionItem p:first-child {
		color: grey;
	}

	.questionItem p:nth-child(2) {
		flex: 1 1 auto;
	}

	.closeBtn {
		margin: 0.5rem;
		padding-top: 1rem;

		font-size: 1.2rem;
		color: grey;
		width: 100%;
		border-top: 1px solid grey;
	}
</style>
