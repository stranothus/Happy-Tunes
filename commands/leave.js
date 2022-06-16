import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';

export default {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("Leaves your voice chat"),
	DMs: false,
	execute: function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		connection.destroy();
		interaction.client.servers[interaction.guild.id] = [];

		interaction.reply(`Left <#${connection.joinConfig.channelId}>`);
	},
	executeText: function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		connection.destroy();
		msg.client.servers[msg.guild.id] = [];

		msg.channel.send(`Left <#${connection.joinConfig.channelId}>`);
	}
}