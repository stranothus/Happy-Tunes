import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';

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

		const song = interaction.client.servers[interaction.guild.id][0];

		if(!song) {
			interaction.reply("No songs currently playing");
			return;
		}

		interaction.reply(`Now playing [${song.title}](${song.url}) by [${song.author}](<${song.channel_url}>)`);
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		const song = msg.client.servers[msg.guild.id][0];

		if(!song) {
			msg.channel.send("No songs currently playing");
			return;
		}

		msg.channel.send(`Now playing [${song.title}](${song.url}) by [${song.author}](<${song.channel_url}>)`);
	}
}