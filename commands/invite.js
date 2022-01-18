import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Get my invite link"),
	DMs: false,
	execute: function(interaction) {
		interaction.reply(`https://discord.com/oauth2/authorize?client_id=925206963086852146&permissions=3164160&scope=bot%20applications.commands`);
	},
	executeText: async function(msg, args) {
		msg.channel.send(`https://discord.com/oauth2/authorize?client_id=925206963086852146&permissions=3164160&scope=bot%20applications.commands`);
	}
}