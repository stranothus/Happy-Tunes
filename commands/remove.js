import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';
import InnerTube from "youtubei.js";

const youtube = await new InnerTube();

export default {
	data: new SlashCommandBuilder()
		.setName("remove")
		.setDescription("Remove a song from the queue")
		.addIntegerOption(option => option
			.setName("toremove")
			.setDescription("Which queue item to remove")
			.setRequired(true)
		),
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

		const remove = +interaction.options.getInteger("toremove");

		if(!songs[remove]) {
			interaction.reply("The queue is not that big");
			return;
		}

		const removed = songs[remove];

		interaction.client.servers[interaction.guild.id].splice(remove, 1);
		
		interaction.reply(`Removed https://www.youtube.com/watch?v=${removed}`);
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
		
		const remove = +args[0];

		if(!remove) {
			msg.channel.send("No item index provided for removal");
			return;
		}

		if(!songs[remove]) {
			msg.channel.send("The queue is not that big");
			return;
		}

		const removed = songs[remove];

		msg.client.servers[msg.guild.id].splice(remove, 1);
		
		msg.channel.send(`Removed https://www.youtube.com/watch?v=${removed}`);
	}
}