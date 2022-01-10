import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from '@discordjs/voice';
import Innertube from "youtubei.js";
import fetch from "node-fetch";
import DomParser from "dom-parser";

const youtube = await new Innertube();
const parser = new DomParser();

export default {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Get the lyrics to the current song if available"),
	DMs: false,
	execute: async function(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);

		if(!connection) {
			interaction.reply("Not connected to any voice chat");
			return;
		}

		if(!interaction.client.servers[interaction.guild.id][0]) {
			interaction.reply("No songs currently playing");
			return;
		}

		interaction.reply("**Lyric searching is in beta and some songs may have mismatched, incomplete, or otherwise incorrect lyrics**");

		const song = await youtube.getDetails(interaction.client.servers[interaction.guild.id][0]);
		const abbreviatedTitle = song.title.replace(/\([^\)]+\)/g, "").replace(/official|music|video|remastered|remaster|version|live|\b\d+\b|mix|remake|audio|classic|trailer|rare/gi, "").replace(new RegExp(song.metadata.channel_name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\s+/g, "|"), "gi"), "").replace(/-|;|:|#/g, "").trim();
		const html = await fetch(`https://songmeanings.com/query/?query=${encodeURIComponent(abbreviatedTitle)}&type=all`).then(response => response.text());
		const link = html.match(/songmeanings\.com\/songs\/view\/\d+/);

		if(!link) {
			interaction.channel.send("No lyrics found");
			return;
		}

		const page = await fetch(`https://${link}`).then(result => result.text());
		const dom = parser.parseFromString(page);
		const lyrics = dom.getElementsByClassName("lyric-box");

		if(!lyrics.length) {
			interaction.channel.send("No lyrics found");
			return;
		}

		const text = lyrics[0].textContent.replace(/\s*Edit\s*Lyrics\s*<!--\s*Edit\s*Wiki\s*-->\s*<!--\s*Add\s*Video\s*-->/i, "");

		const embed = new MessageEmbed()
			.setTitle(`Discovered lyrics for ${song.title}`)
			.setURL(`https://${link}`)
			.setDescription(text.substring(0, 4000))
			.setThumbnail(song.thumbnail.url);

		interaction.editReply({ embeds: [embed] });
	},
	executeText: async function(msg, args) {
		const connection = getVoiceConnection(msg.guild.id);

		if(!connection) {
			msg.channel.send("Not connected to any voice chat");
			return;
		}

		if(!msg.client.servers[msg.guild.id][0]) {
			msg.channel.send("No songs currently playing");
			return;
		}

		msg.channel.send("**Lyric searching is in beta and some songs may have mismatched, incomplete, or otherwise incorrect lyrics**");

		const song = await youtube.getDetails(msg.client.servers[msg.guild.id][0]);
		const abbreviatedTitle = song.title.replace(/\([^\)]+\)/g, "").replace(/official|music|video|remastered|remaster|version|live|\b\d+\b|mix|remake|audio|classic|trailer|rare/gi, "").replace(new RegExp(song.metadata.channel_name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\s+/g, "|"), "gi"), "").replace(/-|;|:|#/g, "").trim();
		const html = await fetch(`https://songmeanings.com/query/?query=${encodeURIComponent(abbreviatedTitle)}&type=all`).then(response => response.text());
		const link = html.match(/songmeanings\.com\/songs\/view\/\d+/);

		if(!link) {
			msg.channel.send("No lyrics found");
			return;
		}

		const page = await fetch(`https://${link}`).then(result => result.text());
		const dom = parser.parseFromString(page);
		const lyrics = dom.getElementsByClassName("lyric-box");

		if(!lyrics.length) {
			msg.channel.send("No lyrics found");
			return;
		}

		const text = lyrics[0].textContent.replace(/\s*Edit\s*Lyrics\s*<!--\s*Edit\s*Wiki\s*-->\s*<!--\s*Add\s*Video\s*-->/i, "");

		const embed = new MessageEmbed()
			.setTitle(`Discovered lyrics for ${song.title}`)
			.setURL(`https://${link}`)
			.setDescription(text.substring(0, 4000))
			.setThumbnail(song.thumbnail.url);

		msg.channel.send({ embeds: [embed] });
	}
}