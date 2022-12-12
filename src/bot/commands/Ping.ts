import {CommandInterface} from "../../types/Commands";
import {SlashCommandBuilder} from "discord.js";

const Ping: CommandInterface = {
    commandBuilder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responds with 'pong'"),

    execute: async (interaction) => {
        interaction.reply({content: "Pong", ephemeral: true});
    }
}

export default Ping;
