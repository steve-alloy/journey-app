<script lang="ts">
	import Header from "./components/Header.svelte";
	import BusinessForm from "./components/BusinessForm.svelte";
	import PersonForm from "./components/PersonForm.svelte";

	import * as yup from "yup";
	import { createForm } from "felte";
	import { validator } from "@felte/validator-yup";
	import alloy from "@alloyidentity/web-sdk";

	const schema = yup.object({
		business_name: yup.string().min(2).max(50),
		business_address_country_code: yup.string().min(2).max(2),
		name_first: yup.string().min(2).max(25),
		email: yup.string().email()
	});

	const { form } = createForm({
		extend: validator({ schema }),

		async onSubmit(values) {
			const response = await fetch("/journey", {
				method: "POST",
				body: JSON.stringify(values),
				headers: {
					"content-type": "application/json"
				}
			});

			const data = await response.json();
			const journeyData = data.data;
			console.log(data);

			const alloyInitParams = {
				key: "55926f62-901b-4fe1-a48d-15b3c518b9aa",
				production: false,
				color: { primary: "#CD7D2D", secondary: "#862633" },
				journeyApplicationToken: journeyData.journeyApplicationToken,
				journeyToken: journeyData.journeyToken,
				isNext: true,
				isSingleEntity: false
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

		console.log(id);

		if (type === "business") {
			businesses = businesses.filter((business) => business !== id);
		} else {
			persons = persons.filter((person) => person !== id);
		}
	};

	let businessCount = 0;
	let personCount = 0;

	let businesses: string[] = [];
	let persons: string[] = [];

	$: console.log("Total Entities:", businessCount + personCount);

	const addEntity = (type: string) => {
		if (type === "person") {
			const newPerson = "person." + personCount;
			persons = [...persons, newPerson];
			personCount++;
		} else {
			const newBusiness = "business." + businessCount;
			businesses = [...businesses, newBusiness];
			businessCount++;
		}
	};
</script>

<div>
	<Header />
	{#if businesses.length || persons.length}
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

			<button id="submit">Submit</button>
		</form>
	{/if}

	<button
		id="add-person"
		on:click={() => {
			addEntity("person");
		}}>Add Person</button>
	<button
		id="add-business"
		on:click={() => {
			addEntity("business");
		}}>Add Business</button>

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
</div>

<style>
	input {
		display: inline;
	}
</style>
