<script lang="ts">
	import { createEventDispatcher } from "svelte";
	export let personId: string;

	const dispatch = createEventDispatcher();

	const dispatchId = (id: string) => {
		dispatch("id", {
			id: id,
			type: "person"
		});
	};

	let email = "";
	let nameFirst = "";
	let nameLast = "";
</script>

<div class="person-form" id={personId}>
	<label for="{personId}.email">Email</label>
	<input
		bind:value={email}
		placeholder="email@domain.com"
		name="{personId}.email"
		type="email" />

	<label for="{personId}.name_first">First Name</label>
	<input
		bind:value={nameFirst}
		placeholder="Steve"
		name="{personId}.name_first"
		type="text" />

	<label for="{personId}.name_last">Last Name</label>
	<input
		bind:value={nameLast}
		placeholder="Giordano"
		name="{personId}.name_last"
		type="text" />

	<img
		src="https://cdn-icons-png.flaticon.com/512/484/484611.png"
		on:click={() => dispatchId(personId)}
		alt="delete person" />
</div>

<style>
	img {
		height: 20px;
		width: 20px;
	}
</style>
