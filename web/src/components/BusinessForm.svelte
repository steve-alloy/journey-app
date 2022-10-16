<script lang="ts">
	import { createEventDispatcher } from "svelte";
	export let businessId: string;

	const dispatch = createEventDispatcher();

	const dispatchId = (id: string) => {
		dispatch("id", {
			id: id,
			type: "business"
		});
	};
</script>

<div class="business-form" id={businessId}>
	<label for="{businessId}.business_name">Business Name</label>
	<input name="{businessId}.business_name" type="name" />

	<label for="{businessId}.business_address_country_code"
		>Business County Code</label>
	<input name="{businessId}.business_address_country_code" type="text" />

	<img
		src="https://cdn-icons-png.flaticon.com/512/484/484611.png"
		on:click={() => dispatchId(businessId)}
		alt="delete business" />
</div>

<style>
	img {
		height: 20px;
		width: 20px;
	}
</style>
