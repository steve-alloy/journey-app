<script lang="ts">
	import Header from "./components/Header.svelte";
	import AddButton from "./components/AddButton.svelte";
	import BusinessForm from "./components/BusinessForm.svelte";
	import PersonForm from "./components/PersonForm.svelte";
	import { personCount, businessCount } from "./stores";
	import * as yup from "yup";
	import { createForm } from "felte";
	import { validator } from "@felte/validator-yup";
	import alloy from "@alloyidentity/web-sdk";

	let businesses: string[] = [];
	let persons: string[] = [];
	let formValues: any;

	const getAppStatus = async (values: any) => {
		const response = await fetch("/journey", {
			"method": "POST",
			"body": JSON.stringify(values),
			"headers": {
				"content-type": "application/json"
			}
		});

		const data = await response.json();
		const journeyData = data.data;
		console.log(data);

		const alloyInitParams = {
			"key": "55926f62-901b-4fe1-a48d-15b3c518b9aa",
			"production": false,
			"color": { "primary": "#CD7D2D", "secondary": "#862633" },
			"journeyApplicationToken": journeyData.journeyApplicationToken,
			"journeyToken": journeyData.journeyToken,
			"isNext": true,
			"isSingleEntity": false
		};

		const totalPendingDocs = journeyData.entityApplications.filter(
			(app: any) => app.entity_application_status === "pending_documents"
		);

		const runDocV = () => {
			alloy.init(alloyInitParams);

			const respCallback = () => {
				alloy.close();
			};

			const sdkAnchor = document.getElementById("sdk-anchor");

			alloy.open(respCallback, sdkAnchor);
		};

		if (totalPendingDocs.length) {
			runDocV();
		}

		return journeyData.journeyApplicationStatus;
	};

	const schema = yup.object({
		"business_name": yup.string().min(2).max(50),
		"business_address_country_code": yup.string().min(2).max(2),
		"name_first": yup.string().min(2).max(25),
		"email": yup.string().email()
	});

	// Note: Add validation for empty values
	const { form } = createForm({
		"extend": validator({ schema }),

		async onSubmit(values) {
			formValues = values;
		},

		onSuccess() {
			console.log("SUCCESS");
		},

		onError(error) {
			console.log("ERROR", error);
		}
	});

	const deleteEntity = (event: any) => {
		const type = event.detail.type;
		const id = event.detail.id;

		if (type === "person") {
			persons = persons.filter((person) => person !== id);
			$personCount--;
		} else {
			businesses = businesses.filter((business) => business !== id);
			$businessCount--;
		}
	};

	const addEntity = (event: any) => {
		const type = event.detail.type;
		if (type === "person") {
			const newPerson = "person." + $personCount;
			persons = [...persons, newPerson];
			$personCount++;
		} else {
			const newBusiness = "business." + $businessCount;
			businesses = [...businesses, newBusiness];
			$businessCount++;
		}
	};

	$: console.log("Total Entities:", $businessCount + $personCount);
</script>

<div>
	<Header />

	{#if !formValues}
		<AddButton type="person" on:count={addEntity} />
		<AddButton type="business" on:count={addEntity} />

		<div id="continue-form">
			<input type="radio" id="finish" name="continue" value="finish" checked />
			<label for="finish">Finish</label>

			<input
				type="radio"
				id="addl-entities"
				name="continue"
				value="addl-entities" />
			<label for="addl-entities">Await Entities</label>
		</div>

		{#if (businesses.length || persons.length) && !formValues}
			<form use:form>
				{#if persons.length}
					<h3>Persons</h3>
					{#each persons as person (person)}
						<PersonForm personId={person} on:id={deleteEntity} />
					{/each}
				{/if}

				{#if businesses.length}
					<h3>Businesses</h3>
					{#each businesses as business (business)}
						<BusinessForm businessId={business} on:id={deleteEntity} />
					{/each}
				{/if}

				<button id="submit-button">Submit</button>
			</form>
		{/if}
	
	{:else}
		{#await getAppStatus(formValues)}
			<h2>Determing application status...</h2>
		{:then status}
			<h2>Your application status: {status}</h2>
		{/await}
	{/if}
</div>

<style>
	input {
		display: inline;
	}
</style>
