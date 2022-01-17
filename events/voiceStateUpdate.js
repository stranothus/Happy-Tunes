import { getVoiceConnection } from '@discordjs/voice';

export default {
	type: "on",
	name: "voiceStateUpdate",
	execute: async (oldMember, newMember) => {
		const guild = oldMember.guild;
		if(!guild) return;
		
		const connection = getVoiceConnection(guild.id);
		if(!connection) return;

		const channelId = oldMember.channelId || newMember.channelId;
		const isSame = channelId === connection.joinConfig.channelId;
		if(!isSame) return;

		const channel = await guild.channels.fetch(channelId);
		const members = channel.members;

		if(members.size < 2) {
			oldMember.client.servers[guild.id + " leave"] = setTimeout(() => {
				try {
					connection.destroy();
				} catch(e) {}
			}, 1000 * 60 * 5);
		} else if(oldMember.client.servers[guild.id + " leave"]) {
			clearTimeout(oldMember.client.servers[guild.id + " leave"]);

			delete oldMember.client.servers[guild.id + " leave"];
		}
	}
}