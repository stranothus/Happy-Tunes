import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setName("github")
		.setDescription("Get my GitHub repository link"),
	DMs: false,
	execute: function(interaction) {
		interaction.reply(`https://github.com/stranothus/Happy-Tunes`);
	},
	executeText: async function(msg, args) {
		msg.channel.send(`https://github.com/stranothus/Happy-Tunes`);
	}
}