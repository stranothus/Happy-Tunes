import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';
import InnerTube from "youtubei.js";

const youtube = await new InnerTube();

export default {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("View the current queue"),
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
		
		const embed = new MessageEmbed()
			.setTitle(`The Queue`)
			.setDescription((await Promise.all(songs.map(async (id, i) => {
				try {
					const details = await youtube.getDetails(id);
					
					return `${i || "Currently playing.."}. [${details.title}](<https://www.youtube.com/watch?v=${id}>)`;
				} catch (e) {
					return `${i || "Currently playing.."}. <https://www.youtube.com/watch?v=${id}>`;
				}
			}))).join("\n"));

		interaction.reply({ embeds: [embed] });
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
		
		const embed = new MessageEmbed()
			.setTitle(`The Queue`)
			.setDescription((await Promise.all(songs.map(async (id, i) => {
				try {
					const details = await youtube.getDetails(id);
					
					return `${i || "Currently playing.."}. [${details.title}](<https://www.youtube.com/watch?v=${id}>)`;
				} catch (e) {
					return `${i || "Currently playing.."}. <https://www.youtube.com/watch?v=${id}>`;
				}
			}))).join("\n"));

		msg.channel.send({ embeds: [embed] });
	}
}