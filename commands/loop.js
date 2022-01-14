import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';
import InnerTube from "youtubei.js";

const youtube = await new InnerTube();

export default {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loop the current queue"),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		const songs = interaction.client.servers[interaction.guild.id];

		if(!songs.length) {
			interaction.reply("No songs currently playing or in queue");
			return;
		}

		interaction.client.servers[interaction.guild.id].push("Loop");
		
		interaction.reply(`Looping the queue`);
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		const songs = msg.client.servers[msg.guild.id];

		if(!songs.length) {
			msg.channel.send("No songs currently playing or in queue");
			return;
		}
		
		interaction.client.servers[interaction.guild.id].push("Loop");
		
		interaction.reply(`Looping the queue`);
	}
}