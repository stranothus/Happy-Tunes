import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";
import playSong from "../utils/playSong.js";

const youtube = await new Innertube();

export default {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play music from a link")
		.addStringOption(option => option
			.setName("search")
			.setDescription("The music to search for")
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

		const searchFor = interaction.options.getString("search");

		if(!searchFor) {
			await interaction.reply("No search criteria provided");
			return;
		}

		await interaction.deferReply();

		const results = await youtube.search(searchFor);

		if(!results.videos.length) {
			await interaction.editReply("No videos found");
			return;
		}

		const id = results.videos[0].id;

		if(client.servers[guildId] && client.servers[guildId].length) {
			client.servers[guildId].push(id);
			await interaction.editReply(`Queued https://www.youtube.com/watch?v=${id}`);
			return;
		}

		await interaction.editReply(`Playing https://www.youtube.com/watch?v=${id}`);
		
		await playSong(id, client, guildId, channel);
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

		const searchFor = args.join(" ");

		if(!searchFor) {
			await channel.send("No search criteria provided");
			return;
		}

		const results = await youtube.search(searchFor);

		if(!results.videos.length) {
			await channel.send("No videos found");
			return;
		}

		const id = results.videos[0].id;

		if(client.servers[guildId] && client.servers[guildId].length) {
			client.servers[guildId].push(id);
			await channel.send(`Queued https://www.youtube.com/watch?v=${id}`);
			return;
		}

		await channel.send(`Playing https://www.youtube.com/watch?v=${id}`);
		
		await playSong(id, client, guildId, channel);
	}
}