import { randomUUID } from "node:crypto";
import path from "node:path";
import express from "express";
import cors from "cors";
import axios from "axios";
import { envVars } from "./configs/env.config";
import type { Application, Request, Response } from "express";

const port = envVars.port;
const app: Application = express();
const publicPath = path.join(__dirname, "../build/public");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(publicPath));
app.use(cors({
	"origin": ["http://localhost/", "https://journey-alloy.herokuapp.com/"]
}));

interface IJourney {
	entities: any[];
	external_product_id: string;
	external_group_id: string;
}

app.post("/healthcheck", (req: Request, res: Response) => {
	return res.json({
		"ok": true
	});
});

app.post("/journey", (req: Request, res: Response) => {
	console.log("ALLOY REQUEST", req.body);
	const persons = req.body.person;
	const businesses = req.body.business;

	const journeysToken = envVars.journeysToken;
	const journeysObj: IJourney = {
		entities: [],
		external_product_id: "P-" + randomUUID(),
		external_group_id: "G-" + randomUUID()
	};

	const authToken = Buffer.from(
		`${envVars.workflowToken}:${envVars.workflowSecret}`,
		"utf-8"
	).toString("base64");

	if (persons && persons.length) {
		persons.forEach((person: any) => {
			const personObj = {
				data: person,
				external_entity_id: "I-" + randomUUID(),
				entity_type: "person",
				branch_name: "persons"
			};

			journeysObj.entities.push(personObj);
		});
	}

	if (businesses && businesses.length) {
		businesses.forEach((business: any) => {
			const businessObj = {
				data: business,
				external_entity_id: "B-" + randomUUID(),
				entity_type: "business",
				branch_name: "business"
			};

			journeysObj.entities.push(businessObj);
		});
	}

	const submitApplication = async () => {
		const response = await axios({
			method: "POST",
			url: `https://sandbox.alloy.co/v1/journeys/${journeysToken}/applications`,
			headers: {
				Authorization: `Basic ${authToken}`
			},
			data: journeysObj
		});

		console.log("Alloy Response:", response.data);

		return res.json({
			ok: true,
			data: {
				entityApplications: response.data._embedded.entity_applications,
				journeyApplicationToken: response.data.journey_application_token,
				journeyToken: journeysToken
			}
		});
	};

	submitApplication();
});

app.get("*", (req: Request, res: Response) => {
	res.sendFile(path.resolve(publicPath, "index.html"));
});

app.listen(port, () => {
	console.log(`Listening on port ${port}.`);
});
