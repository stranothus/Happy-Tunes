import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";

const youtube = await new Innertube();

export default {
	data: new SlashCommandBuilder()
		.setName("search")
		.setDescription("Search for music to play")
		.addStringOption(option => option
			.setName("search")
			.setDescription("The music to search for")
			.setRequired(true)
		),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

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

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(results.videos.slice(0, 10).map(v => ({
						label: v.title,
						description: v.description.substring(0, 100),
						value: v.url.split("/").reverse()[0]
					}))),
			);

		interaction.editReply({
			content: `**Search results for** *${searchFor}*`,
			embeds: results.videos.slice(0, 10).map(v => 
				new MessageEmbed()
					.setTitle(v.title)
					.setURL(v.url)
					.setDescription(v.description.substring(0, 100))
					.setAuthor(v.author)
					.setThumbnail(v.metadata.thumbnails[0].url)
			),
			components: [row]
		});
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		const searchFor = interaction.options.getString("search");

		if(!searchFor) {
			msg.channel.send("No search criteria provided");
			return;
		}

		const results = await youtube.search(searchFor);

		if(!results.videos.length) {
			msg.channel.send("No videos found");
			return;
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(results.videos.slice(0, 10).map(v => ({
						label: v.title,
						description: v.description.substring(0, 100),
						value: v.url.split("/").reverse()[0]
					}))),
			);

		msg.channel.send({
			content: `**Search results for** *${searchFor}*`,
			embeds: results.videos.slice(0, 10).map(v => 
				new MessageEmbed()
					.setTitle(v.title)
					.setURL(v.url)
					.setDescription(v.description.substring(0, 100))
					.setAuthor(v.author)
					.setThumbnail(v.metadata.thumbnails[0].url)
			),
			components: [row]
		});
	},
	selectMenu: async function(interaction) {
		const connnection = getVoiceConnection(interaction.guild.id);

		if(!connnection) return;

		interaction.update({ content: 'A song was selected!', components: [], embeds: [] });

		const key = interaction.values[0];

		if(interaction.client.servers[interaction.guild.id] && interaction.client.servers[interaction.guild.id].length) {
			interaction.client.servers[interaction.guild.id].push(key);
			interaction.channel.send(`Queued https://www.youtube.com/watch?v=${key}`);
			return;
		}

		interaction.channel.send(`Playing https://www.youtube.com/watch?v=${key}`);

		interaction.client.servers[interaction.guild.id] = [key];

		const video = ytdl("https://www.youtube.com/watch?v=" + key, {
			filter: "audioonly",
			quality: "highestaudio"
		});
		const player = createAudioPlayer();
		const resource = createAudioResource(video);

		connnection.subscribe(player);
		player.play(resource);

		player.on('error', console.error);

		player.on(AudioPlayerStatus.Idle, () => {
			interaction.client.servers[interaction.guild.id].shift();

			const songs = interaction.client.servers[interaction.guild.id];

			if(songs.length) {
				interaction.channel.send(`Playing https://www.youtube.com/watch?v=${songs[0]}`);
				const video = ytdl("https://www.youtube.com/watch?v=" + songs[0], {
					filter: "audioonly",
					quality: "highestaudio"
				});
				const resource = createAudioResource(video);

				player.play(resource);
			}
		});
	}
}