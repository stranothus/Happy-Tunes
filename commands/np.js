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

		interaction.reply(`Now playing [${song.title}](https://www.youtube.com/watch?v=${song.id}) by [${song.metadata.channel_name}](<${song.metadata.channel_url}>)`);
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

		msg.channel.send(`Now playing [${song.title}](https://www.youtube.com/watch?v=${song.id}) by [${song.metadata.channel_name}](<${song.metadata.channel_url}>)`);
	}
}