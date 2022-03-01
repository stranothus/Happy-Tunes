import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";
import playSong from "../utils/playSong.js";

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
					.setAuthor({
						name: v.author,
						url: v.channel_url
					})
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
					.setAuthor({
						name: v.author,
						url: v.channel_url
					})
					.setThumbnail(v.metadata.thumbnails[0].url)
			),
			components: [row]
		});
	},
	selectMenu: async function(interaction) {
		const guildId = interaction.guild.id;
		const client = interaction.client;
		const channel = interaction.channel;
		const connnection = getVoiceConnection(guildId);
		
		if(!connnection) return;

		interaction.update({ content: 'A song was selected!', components: [], embeds: [] });

		const id = interaction.values[0];

		if(client.servers[guildId] && client.servers[guildId].length) {
			client.servers[guildId].push(id);
			await channel.send(`Queued https://www.youtube.com/watch?v=${id}`);
			return;
		}

		await channel.send(`Playing https://www.youtube.com/watch?v=${id}`);
		
		await playSong(id, client, guildId, channel);
	}
}