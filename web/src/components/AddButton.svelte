<script type="ts">
	import { createEventDispatcher } from "svelte";
	export let type: string;

	const typeCapital = type.charAt(0).toUpperCase() + type.slice(1);

	const dispatch = createEventDispatcher();

	const dispatchCount = (updateCount: boolean) => {
		dispatch("count", {
			"type": type,
			"updateCount": updateCount
		});
	};
</script>

<div class="add-buttons-container">
	<button
		class="add-button"
		id="add-{type}"
		on:click={() => dispatchCount(true)}>
		Add {typeCapital}
	</button>
</div>
