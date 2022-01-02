import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';

export default {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Unpause the current song"),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		connection._state.subscription.player.unpause();

		interaction.reply("The song has been resumed");
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		connection._state.subscription.player.unpause();

		msg.channel.send("The song has been resumed");
	}
}