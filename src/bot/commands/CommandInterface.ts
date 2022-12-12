import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

interface CommandInterface {
    commandBuilder: SlashCommandBuilder;

    execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
}

export default CommandInterface;
