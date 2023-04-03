<script lang="ts">
	const domain = 'http://' + window.location.host;
</script>

<a href={domain}>
	<span class="material-icons-outlined"> home </span>
</a>

<style>
	a {
		border-radius: 50%;
		padding: 0.5rem;
		text-decoration: none;
		color: white;

		background: blue;

		position: fixed;
		top: 2rem;
		left: 2rem;

		display: flex;
	}

	a span {
		font-size: 2rem;
	}
</style>
