import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';
import hastebin from "hastebin"

export default {
	data: new SlashCommandBuilder()
		.setName("save")
		.setDescription("Save the current queue"),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		const songs = interaction.client.servers[interaction.guild.id].filter(v => !v.match(/loop/i));

		if(!songs.length) {
			interaction.reply("No songs currently playing or in queue");
			return;
		}
		
		await interaction.deferReply();

		hastebin.createPaste(songs.join("\n"), {
		  	raw: true,
		  	contentType: 'text/plain',
		  	server: 'https://www.toptal.com/developers/hastebin/'
		}, {})
		.then(url => {
			interaction.editReply(`Queue saved to ${url}`);
		})
		.catch(err => {
			interaction.editReply(`Something went wrong`);
			console.log(err);
		});
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		const songs = msg.client.servers[msg.guild.id].filter(v => !v.match(/loop/i));

		if(!songs.length) {
			msg.channel.send("No songs currently playing or in queue");
			return;
		}
		
		hastebin.createPaste(songs.join("\n"), {
		  	raw: true,
		  	contentType: 'text/plain',
		  	server: 'https://www.toptal.com/developers/hastebin/'
		}, {})
		.then(url => {
			msg.channel.send(`Queue saved to ${url}`);
		})
		.catch(err => {
			msg.channel.send(`Something went wrong`);
			console.log(err);
		});
	}
}