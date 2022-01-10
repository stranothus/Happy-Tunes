import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";

const youtube = await new Innertube();

export default {
	data: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("Shuffle the queue"),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		const songs = interaction.client.servers[interaction.guild.id];
		
		if(songs.length < 2) {
			interaction.reply("Not enough songs in the queue to shuffle");
			return;
		}

		interaction.client.servers[interaction.guild.id] = [songs[0], ...songs.slice(1).sort(() => Math.random() - 0.5)];

		interaction.reply(`Queue shuffled`);
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		const songs = msg.client.servers[msg.guild.id];
		
		if(songs.length < 2) {
			msg.channel.send("Not enough songs in the queue to shuffle");
			return;
		}

		msg.client.servers[msg.guild.id] = [songs[0], ...songs.slice(1).sort(() => Math.random() - 0.5)];

		msg.channel.send(`Queue shuffled`);
	}
}