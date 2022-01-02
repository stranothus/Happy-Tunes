import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";

const youtube = await new Innertube();

export default {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip the current song"),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		const player = connection._state.subscription.player;
		const songs = interaction.client.servers[interaction.guild.id];

		if(!player || !songs || !songs.length) {
			interaction.reply("There are no songs playing");
			return;
		}

		interaction.reply(`Skipped https://www.youtube.com/watch?v=${songs[0]}. Playing https://www.youtube.com/watch?v=${songs[1]}`);

		interaction.client.servers[interaction.guild.id].shift();

		const video = ytdl("https://www.youtube.com/watch?v=" + songs[0], {
			filter: "audioonly",
		});
		const resource = createAudioResource(video);

		player.play(resource);
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		const player = connection._state.subscription.player;
		const songs = msg.client.servers[msg.guild.id];

		if(!player || !songs || !songs.length) {
			msg.channel.send("There are no songs playing");
			return;
		}

		msg.channel.send(`Skipped https://www.youtube.com/watch?v=${songs[0]}. Playing https://www.youtube.com/watch?v=${songs[1]}`);

		msg.client.servers[msg.guild.id].shift();

		const video = ytdl("https://www.youtube.com/watch?v=" + songs[0], {
			filter: "audioonly",
		});
		const resource = createAudioResource(video);

		player.play(resource);
	}
}