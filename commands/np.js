import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';
import InnerTube from "youtubei.js";

const youtube = await new InnerTube();

export default {
	data: new SlashCommandBuilder()
		.setName("np")
		.setDescription("See which song is playing"),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		if(!interaction.client.servers[interaction.guild.id][0]) {
			interaction.reply("No songs currently playing");
			return;
		}

		const song = await youtube.getDetails(interaction.client.servers[interaction.guild.id][0]);

		const played = Math.floor(connection._state.subscription.player._state.playbackDuration / 1000);
		const totalDuration = +song.metadata.length_seconds;
		const playBar = "\u2588".repeat(Math.floor(played / totalDuration * 25) || 1) + "\u2591".repeat(25 - Math.floor(played / totalDuration * 25) || 1);

		const embed = new MessageEmbed()
			.setTitle(`Now playing ${song.title}`)
			.setDescription(
				`${song.description.substring(0, 200)}...\n\n` +
				`[${playBar}] %${Math.floor(played / totalDuration * 100)}\n` +
				`${totalDuration - played} seconds left out of ${totalDuration}`
			)
			.addFields(
				{
					name: "Song",
					value: `[${song.title}](<https://www.youtube.com/watch?v=${song.id}>)`
				},
				{
					name: "Author",
					value: `[${song.metadata.channel_name}](<${song.metadata.channel_url}>)`
				}
			)
			.setURL(`https://www.youtube.com/watch?v=${song.id}`)
			.setThumbnail(song.thumbnail.url);

		interaction.reply({ embeds: [embed] });
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		if(!msg.client.servers[msg.guild.id][0]) {
			msg.channel.send("No songs currently playing");
			return;
		}

		const song = await youtube.getDetails(msg.client.servers[msg.guild.id][0]);

		const played = Math.floor(connection._state.subscription.player._state.playbackDuration / 1000);
		const totalDuration = +song.metadata.length_seconds;
		const playBar = "\u2588".repeat(Math.floor(played / totalDuration * 25) || 1) + "\u2591".repeat(25 - Math.floor(played / totalDuration * 25) || 1);

		const embed = new MessageEmbed()
			.setTitle(`Now playing ${song.title}`)
			.setDescription(
				`${song.description.substring(0, 200)}...\n\n` +
				`[${playBar}] %${Math.floor(played / totalDuration * 100)}\n` +
				`${totalDuration - played} seconds left out of ${totalDuration}`
			)
			.addFields(
				{
					name: "Song",
					value: `[${song.title}](<https://www.youtube.com/watch?v=${song.id}>)`
				},
				{
					name: "Author",
					value: `[${song.metadata.channel_name}](<${song.metadata.channel_url}>)`
				}
			)
			.setURL(`https://www.youtube.com/watch?v=${song.id}`)
			.setThumbnail(song.thumbnail.url);

		msg.channel.send({ embeds: [embed] });
	}
}