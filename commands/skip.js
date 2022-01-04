import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";

const youtube = await new Innertube();

export default {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip the current song")
		.addStringOption(option => option
			.setName("skipto")
			.setDescription("the song to skip to in the queue")
			.setRequired(false)
		),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		const songs = interaction.client.servers[interaction.guild.id];
		const player = connection._state.subscription.player;
		const skipTo = interaction.options.getString("skipto") || 1;

		if(!player || !songs || !songs.length) {
			interaction.reply("There are no songs playing");
			return;
		}

		const oldSong = songs[0];
		const newSong = skipTo >= songs.length ? undefined : songs[skipTo];

		for(let i = skipTo; i < skipTo && interaction.client.servers[interaction.guild.id].length; i++) {
			interaction.client.servers[interaction.guild.id].shift();
		}

		if(!newSong) {
			interaction.reply(`Skipped https://www.youtube.com/watch?v=${oldSong}. No more songs to play`);
			player.stop();
			return;
		}

		interaction.reply(`Skipped https://www.youtube.com/watch?v=${oldSong}. Playing https://www.youtube.com/watch?v=${newSong}`);

		const video = ytdl("https://www.youtube.com/watch?v=" + newSong, {
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

		const songs = msg.client.servers[msg.guild.id];
		const player = connection._state.subscription.player;
		const skipTo = args[0] || 1;

		if(!player || !songs || !songs.length) {
			interaction.reply("There are no songs playing");
			return;
		}

		const oldSong = songs[0];
		const newSong = skipTo >= songs.length ? undefined : songs[skipTo];

		for(let i = skipTo; i < skipTo && msg.client.servers[msg.guild.id].length; i++) {
			msg.client.servers[msg.guild.id].shift();
		}

		if(!newSong) {
			msg.channel.send(`Skipped https://www.youtube.com/watch?v=${oldSong}. No more songs to play`);
			player.stop();
			return;
		}

		msg.channel.send(`Skipped https://www.youtube.com/watch?v=${oldSong}. Playing https://www.youtube.com/watch?v=${newSong}`);

		const video = ytdl("https://www.youtube.com/watch?v=" + newSong, {
			filter: "audioonly",
		});
		const resource = createAudioResource(video);

		player.play(resource);
	}
}