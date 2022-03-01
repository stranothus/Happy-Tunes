import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';
import ytdl from "ytdl-core";
import playSong from "../utils/playSong.js";
import fetch from "node-fetch";

export default {
	data: new SlashCommandBuilder()
		.setName("playsaved")
		.setDescription("Play a saved album from /save")
		.addStringOption(option => option
			.setName("link")
			.setDescription("The link to the saved album")
			.setRequired(true)
		),
	DMs: false,
	execute: async function(interaction) {
		const guildId = interaction.guild.id;
		const client = interaction.client;
		const channel = interaction.channel;
		const connection = getVoiceConnection(guildId);

		if(!connection) {
			await interaction.reply("Not connected to any voice chat");
			return;
		}

		const link = interaction.options.getString("link");

		if(!link) {
			await interaction.reply("No album provided");
			return;
		}

		await interaction.deferReply();

		const text = await fetch(link).then(response => response.text());

		if(!text) {
			await interaction.reply("Invalid link");
			return;
		}

		const songs = text.split("\n");

		if(client.servers[guildId] && client.servers[guildId].length) {
			client.servers[guildId].push(songs[0]);
			await interaction.editReply(`Queued https://www.youtube.com/watch?v=${songs[0]}`);
			return;
		}

		await interaction.editReply(`Playing https://www.youtube.com/watch?v=${songs[0]}`);

		await playSong(songs[0], client, guildId, channel);

		client.servers[guildId].push(...songs.slice(1));
	},
	executeText: async function(msg, args) {
		const guildId = msg.guild.id;
		const client = msg.client;
		const channel = msg.channel;
		const connection = getVoiceConnection(guildId);

		if(!connection) {
			await channel.send("Not connected to any voice chat");
			return;
		}

		const link = args[0]

		if(!link) {
			await channel.send("No album provided");
			return;
		}

		const text = await fetch(link).then(response => response.text());

		if(!text) {
			await channel.send("Invalid link");
			return;
		}

		const songs = text.split("\n");

		if(client.servers[guildId] && client.servers[guildId].length) {
			client.servers[guildId].push(songs[0]);
			await channel.send(`Queued https://www.youtube.com/watch?v=${songs[0]}`);
			return;
		}

		await channel.send(`Playing https://www.youtube.com/watch?v=${songs[0]}`);

		await playSong(songs[0], client, guildId, channel);

		client.servers[guildId].push(...songs.slice(1));
	}
}