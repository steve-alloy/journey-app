<script lang="ts">
	import { createEventDispatcher } from "svelte";
	export let personId: string;
	
	let email = "";
	let nameFirst = "";
	let nameLast = "";

	const dispatch = createEventDispatcher();

	const dispatchId = (id: string) => {
		dispatch("id", {
			"id": id,
			"type": "person"
		});
	};


</script>

<div class="entity-form person-form" id={personId}>
	<label for="{personId}.email">Email:</label>
	<input
		bind:value={email}
		placeholder="email@domain.com"
		name="{personId}.email"
		type="email" />

	<label for="{personId}.name_first">First Name:</label>
	<input
		bind:value={nameFirst}
		placeholder="Steve"
		name="{personId}.name_first"
		type="text" />

	<label for="{personId}.name_last">Last Name:</label>
	<input
		bind:value={nameLast}
		placeholder="Giordano"
		name="{personId}.name_last"
		type="text" />

	<img class="delete-icon"
		src="./assets/delete.png"
		on:click={() => dispatchId(personId)}
		alt="delete person" />
</div>

<style>
</style>