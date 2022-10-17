<script lang="ts">
	import { createEventDispatcher } from "svelte";
	export let businessId: string;

	let businessName = "";
	let businessCountryCode = "";

	const dispatch = createEventDispatcher();

	const dispatchId = (id: string) => {
		dispatch("id", {
			"id": id,
			"type": "business"
		});
	};
</script>

<div class="entity-form business-form" id={businessId}>
	<label for="{businessId}.business_name">Business Name:</label>
	<input 
		bind:value={businessName}
		placeholder="Alloy"
		name="{businessId}.business_name" 
		type="name" />

	<label for="{businessId}.business_address_country_code"
		>Business County Code:</label>
	<input 
		bind:value={businessCountryCode}
		placeholder="US"
		name="{businessId}.business_address_country_code" 
		type="text" />

	<img
		class="delete-icon"
		src="./assets/delete.png"
		on:click={() => dispatchId(businessId)}
		alt="delete business" />
</div>

<style>
</style>
