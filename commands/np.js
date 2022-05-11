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
		const player = connection?.state_?.subscription?.player;

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		if(!interaction.client.servers[interaction.guild.id][0] || !player) {
			interaction.reply("No songs currently playing");
			return;
		}

		const song = await youtube.getDetails(interaction.client.servers[interaction.guild.id][0]);

		const played = Math.floor(player._state.playbackDuration / 1000);
		const totalDuration = +song.metadata.length_seconds;
		const playBar = "\u2588".repeat(Math.floor(played / totalDuration * 20) || 1) + "\u2591".repeat(20 - Math.floor(played / totalDuration * 20) || 1);

		const playedString = Math.floor(played / 60) + ":" + ("0" + (played % 60)).slice(-2);
		const lengthString = Math.floor(totalDuration / 60) + ":" + ("0" + (totalDuration % 60)).slice(-2);

		const description = song.description;

		const embed = new MessageEmbed()
			.setTitle(`Now playing ${song.title}`)
			.setDescription(
				`${description.length > 4000 ? description.substring(0, 3997) + "..." : description}\n\n` +
				`${playedString} |${playBar}| ${lengthString}\n`
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
		const player = connection?.state_?.subscription?.player;

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		if(!msg.client.servers[msg.guild.id][0] || !player) {
			msg.channel.send("No songs currently playing");
			return;
		}

		const song = await youtube.getDetails(msg.client.servers[msg.guild.id][0]);

		const played = Math.floor(player._state.playbackDuration / 1000);
		const totalDuration = +song.metadata.length_seconds;
		const playBar = "\u2588".repeat(Math.floor(played / totalDuration * 20) || 1) + "\u2591".repeat(20 - Math.floor(played / totalDuration * 20) || 1);

		const playedString = Math.floor(played / 60) + ":" + ("0" + (played % 60)).slice(-2);
		const lengthString = Math.floor(totalDuration / 60) + ":" + ("0" + (totalDuration % 60)).slice(-2);

		const description = song.description;

		const embed = new MessageEmbed()
			.setTitle(`Now playing ${song.title}`)
			.setDescription(
				`${description.length > 4000 ? description.substring(0, 3997) + "..." : description}\n\n` +
				`${playedString} |${playBar}| ${lengthString}\n`
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