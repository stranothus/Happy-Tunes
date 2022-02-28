import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";
import fs from "fs";

const youtube = await new Innertube();

export default {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play music from a link")
		.addStringOption(option => option
			.setName("search")
			.setDescription("The music to search for")
			.setRequired(true)
		),
	DMs: false,
	execute: async function(interaction) {
		const guildId = interaction.guild.id;
		const connection = getVoiceConnection(guildId);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		const searchFor = interaction.options.getString("search");

		if(!searchFor) {
			interaction.reply("No search criteria provided");
			return;
		}

		interaction.deferReply();

		const results = await youtube.search(searchFor);

		if(!results.videos.length) {
			interaction.editReply("No videos found");
			return;
		}

		const id = results.videos[0].id;
		
		if(interaction.client.servers[guildId] && interaction.client.servers[guildId].length) {
			interaction.client.servers[guildId].push(id);
			interaction.editReply(`Queued https://www.youtube.com/watch?v=${id}`);
			return;
		}

		interaction.editReply(`Playing https://www.youtube.com/watch?v=${id}`);
		
		interaction.client.servers[guildId] = [id];

		const video = ytdl("https://www.youtube.com/watch?v=" + id, {
			filter: "audioonly",
			quality: "highestaudio",
			highWaterMark: 1 << 25,
			requestOptions: { headers: { cookie: process.env['COOKIE'] }}
		});
		
		const player = createAudioPlayer();
		const resource = createAudioResource(video);

		connection.subscribe(player);
		player.play(resource);

		player.on('error', console.error);

		player.on(AudioPlayerStatus.Idle, () => {
			const songs = interaction.client.servers[guildId];

			if(songs.filter(v => v.match(/loop/i)).length) {
				interaction.client.servers[guildId].push(songs[0]);
			}

			interaction.client.servers[guildId].shift();

			if(songs.length) {
				if(songs[0].match(/loop/i)) {
					interaction.client.servers[guildId].push(songs[0]);
					interaction.client.servers[guildId].shift();

					if(songs.length < 2) return;
				}
				interaction.channel.send(`Playing https://www.youtube.com/watch?v=${songs[0]}`);
				const video = ytdl("https://www.youtube.com/watch?v=" + songs[0], {
					filter: "audioonly",
					quality: "highestaudio",
					highWaterMark: 1 << 25,
					requestOptions: { headers: { cookie: process.env['COOKIE'] }}
				});
				const resource = createAudioResource(video);

				player.play(resource);
			}
		});
	},
	executeText: async function(msg, args) {
		const guildId = msg.guild.id;
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		const searchFor = args.join(" ");

		if(!searchFor) {
			msg.channel.send("No search criteria provided");
			return;
		}

		const results = await youtube.search(searchFor);

		if(!results.videos.length) {
			msg.channel.send("No videos found");
			return;
		}

		const id = results.videos[0].id;
		
		if(msg.client.servers[guildId] && msg.client.servers[guildId].length) {
			msg.client.servers[guildId].push(id);
			msg.channel.send(`Queued https://www.youtube.com/watch?v=${id}`);
			return;
		}

		msg.channel.send(`Playing https://www.youtube.com/watch?v=${id}`);

		msg.client.servers[guildId] = [id];

		const video = ytdl("https://www.youtube.com/watch?v=" + id, {
			filter: "audioonly",
			quality: "highestaudio",
			highWaterMark: 1 << 25,
			requestOptions: { headers: { cookie: process.env['COOKIE'] }}
		});
		const player = createAudioPlayer();
		const resource = createAudioResource(video);

		connection.subscribe(player);
		player.play(resource);

		player.on('error', console.error);

		player.on(AudioPlayerStatus.Idle, () => {
			const songs = msg.client.servers[guildId];

			if(songs.filter(v => v.match(/loop/i)).length) {
				msg.client.servers[guildId].push(songs[0]);
			}

			msg.client.servers[guildId].shift();

			if(songs.length) {
				if(songs[0].match(/loop/i)) {
					msg.client.servers[guildId].push(songs[0]);
					msg.client.servers[guildId].shift();

					if(songs.length < 2) return;
				}

				msg.channel.send(`Playing https://www.youtube.com/watch?v=${songs[0]}`);
				const video = ytdl("https://www.youtube.com/watch?v=" + songs[0], {
					filter: "audioonly",
					quality: "highestaudio",
					highWaterMark: 1 << 25,
					requestOptions: { headers: { cookie: process.env['COOKIE'] }}
				});
				const resource = createAudioResource(video);

				player.play(resource);
			}
		});
	}
}