export default {
    type: "on",
    name: "interactionCreate",
    execute: interaction => {
		if(interaction.isSelectMenu()) {
			if(interaction.user.bot) return;

			const command = interaction.client.commands.get(interaction.message.interaction.commandName);

			if(!command) return;

			command.selectMenu(interaction);
			
			return;
		}
        if (!interaction.isCommand()) return;
    
        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) return;
    
        try {
            if(!command.DMs && !interaction.guild) {
                interaction.reply("This command is not intended for direct message use :(");
                return;
            }
            command.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};