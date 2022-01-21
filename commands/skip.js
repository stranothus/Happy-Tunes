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

		const songs = interaction.client.servers[interaction.guild.id].filter(v => !v.match(/loop/i));
		const player = connection._state.subscription.player;
		const skipTo = interaction.options.getString("skipto") || 1;

		if(!player || !songs || !songs.length) {
			interaction.reply("There are no songs playing");
			return;
		}

		const oldSong = songs[0];
		let newSong = skipTo >= songs.length ? undefined : songs[skipTo];
		const loop = !!interaction.client.servers[interaction.guild.id].filter(v => v.match(/loop/i)).length;

		for(let i = 0; i < skipTo && interaction.client.servers[interaction.guild.id].length; i++) {
			if(loop) interaction.client.servers[interaction.guild.id].push(interaction.client.servers[interaction.guild.id][0]);
			interaction.client.servers[interaction.guild.id].shift();
		}

		if(loop) newSong = interaction.client.servers[interaction.guild.id][0];

		if(!newSong) {
			interaction.reply(`Skipped https://www.youtube.com/watch?v=${oldSong}. No more songs to play`);
			player.stop();
			return;
		}

		interaction.reply(`Skipped https://www.youtube.com/watch?v=${oldSong}. Playing https://www.youtube.com/watch?v=${newSong}`);

		const video = ytdl("https://www.youtube.com/watch?v=" + newSong, {
			filter: "audioonly",
			quality: "highestaudio",
			highWaterMark: 1 << 25,
			requestOptions: { headers: { cookie: process.env['COOKIE'] }}
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

		const songs = msg.client.servers[msg.guild.id].filter(v => !v.match(/loop/i));
		const player = connection._state.subscription.player;
		const skipTo = args[0] || 1;

		if(!player || !songs || !songs.length) {
			interaction.reply("There are no songs playing");
			return;
		}

		const oldSong = songs[0];
		let newSong = skipTo >= songs.length ? undefined : songs[skipTo];
		const loop = !!msg.client.servers[msg.guild.id].filter(v => v.match(/loop/i)).length;

		for(let i = 0; i < skipTo && msg.client.servers[msg.guild.id].length; i++) {
			if(loop) msg.client.servers[msg.guild.id].push(msg.client.servers[msg.guild.id][0]);
			msg.client.servers[msg.guild.id].shift();
		}

		if(loop) newSong = interaction.client.servers[interaction.guild.id][0];

		if(!newSong) {
			msg.channel.send(`Skipped https://www.youtube.com/watch?v=${oldSong}. No more songs to play`);
			player.stop();
			return;
		}

		msg.channel.send(`Skipped https://www.youtube.com/watch?v=${oldSong}. Playing https://www.youtube.com/watch?v=${newSong}`);

		const video = ytdl("https://www.youtube.com/watch?v=" + newSong, {
			filter: "audioonly",
			quality: "highestaudio",
			highWaterMark: 1 << 25,
			requestOptions: { headers: { cookie: process.env['COOKIE'] }}
		});
		const resource = createAudioResource(video);

		player.play(resource);
	}
}