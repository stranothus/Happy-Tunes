import { SlashCommandBuilder } from "@discordjs/builders";
import { joinVoiceChannel } from '@discordjs/voice';

export default {
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Joins your voice chat"),
	DMs: false,
	execute: function(interaction) {
		const channel = interaction.member.voice.channel;

		if(!channel) {
			interaction.reply("Please connect to a voice channel first");
			return;
		}

		joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator
		});

		interaction.reply(`Joined <#${channel.id}>`);
	},
	executeText: async function(msg, args) {
		const channel = (await msg.guild.members.fetch(msg.author.id)).voice.channel;

		if(!channel) {
			msg.channel.send("Please connect to a voice channel first");
			return;
		}

		joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator
		});

		msg.channel.send(`Joined <#${channel.id}>`);
	}
}