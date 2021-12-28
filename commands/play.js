import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";

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

        const results = await youtube.search(searchFor);

        interaction.reply(`Playing https://www.youtube.com/watch?v=${results.videos[0].id}`);

        const video = ytdl("https://www.youtube.com/watch?v=" + results.videos[0].id, {
            filter: "audioonly",
        });
        const player = createAudioPlayer();
        const resource = createAudioResource(video);

        getVoiceConnection(interaction.guild.id).subscribe(player);
        player.play(resource);

        player.on('error', error => {
            console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        });
        player.on(AudioPlayerStatus.Playing, () => {
            console.log('The audio player has started playing!');
        });
        player.on(AudioPlayerStatus.Paused, () => {
            console.log('The audio player has been paused');
        });
        player.on(AudioPlayerStatus.AutoPaused, () => {
            console.log('The audio player has been paused');
        });
        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Idle");
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

        msg.channel.send(`Playing https://www.youtube.com/watch?v=${results.videos[0].id}`);

        const video = ytdl("https://www.youtube.com/watch?v=" + results.videos[0].id, {
            filter: "audioonly",
        });
        const player = createAudioPlayer();
        const resource = createAudioResource(video);

        getVoiceConnection(msg.guild.id).subscribe(player);
        player.play(resource);

        player.on('error', error => {
            console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        });
        player.on(AudioPlayerStatus.Playing, () => {
            console.log('The audio player has started playing!');
        });
        player.on(AudioPlayerStatus.Paused, () => {
            console.log('The audio player has been paused');
        });
        player.on(AudioPlayerStatus.AutoPaused, () => {
            console.log('The audio player has been paused');
        });
        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Idle");
        });
    }
}