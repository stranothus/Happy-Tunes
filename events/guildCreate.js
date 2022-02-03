import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dirFlat from "../utils/dirFlat.js";
import discord from "discord.js";

const commands = await Promise.all(dirFlat("./commands").map(async v => {
	let imported = await import("../" + v);

	return {
		command: v.replace(/\.[^\.]+$/, ""),
		file: v,
		...imported.default
	};
}));

export default {
	type: "on",
	name: "guildCreate",
	execute: guild => {
		const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

		const server = commands.filter(v => !v.DMs);

		try {
			await rest.put(
				Routes.applicationGuildCommands(guild.client.user.id, guild.id), {
					body: server.map(v => v.data.toJSON())
				}
			);
		} catch (error) {
			console.error(error);
		}
	}
}