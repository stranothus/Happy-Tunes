import { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import ytdl from "ytdl-core";

async function playSong(id, client, guildId, channel) {
	const connection = getVoiceConnection(guildId);

	client.servers[guildId] = [id];

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
		const songs = client.servers[guildId];

		if(songs.filter(v => v.match(/loop/i)).length) {
			client.servers[guildId].push(songs[0]);
		}

		client.servers[guildId].shift();

		if(songs.length) {
			if(songs[0].match(/loop/i)) {
				client.servers[guildId].push(songs[0]);
				client.servers[guildId].shift();

				if(songs.length < 2) return;
			}
			
			channel.send(`Playing https://www.youtube.com/watch?v=${songs[0]}`);
			
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

	connection.on("disconnect", () => {
		client.servers[guildId] = [];
		player.unsubscribe();
		connection.destroy();
	});
}

export default playSong;