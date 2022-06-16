import discord from "discord.js";
import dotenv from "dotenv";
import dirFlat from "./utils/dirFlat.js";
import express from "express";

dotenv.config();

const client = new discord.Client({
	intents: [
		"GUILDS",
		"GUILD_MESSAGES",
		"DIRECT_MESSAGES",
		"GUILD_VOICE_STATES"
	],
	partials: [
		"CHANNEL"
	]
});

Promise.all(dirFlat("./events").map(async v => {
	let imported = await import("./" + v);

	return {
		command: v.replace(/\.[^\.]+$/, ""),
		file: v,
		...imported.default
	};
})).then(events => events.forEach(event => client[event.type](event.name, event.execute)));

client.login(process.env.TOKEN).catch(console.log);

const app = express();

app.use((req, res) => {
	res.send("Server running");
});

app.listen(3030);