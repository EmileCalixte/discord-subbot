import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";



export interface CommandInterface {
    /**
     * A command builder defining the command information
     */
    commandBuilder: SlashCommandBuilder;

    /**
     * The function which is executed when an interaction is created with this command
     */
    execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
}
