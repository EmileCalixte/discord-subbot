import {Client, Collection, Events, GatewayIntentBits} from "discord.js";
import Ping from "./commands/Ping";
import {CommandInterface} from "../types/Commands";
import SetChannel from "./commands/SetChannel";
import StorageInterface from "../storage/StorageInterface";
import StorageJSON from "../storage/StorageJSON";
import * as path from "path";

type CommandCollection = Collection<string, CommandInterface>;

const commands: CommandInterface[] = [
    Ping,
    SetChannel,
];

class Bot {
    private static instance: Bot | null = null;

    private client: Client;

    private token: string;

    private commands: CommandCollection;

    private storage: StorageInterface;

    constructor(token: string) {
        if (Bot.instance !== null) {
            throw new Error("Bot has already been initialized");
        }

        Bot.instance = this;

        this.client = new Client({
            intents: [GatewayIntentBits.Guilds]
        });

        this.token = token;

        this.commands = new Collection();

        this.storage = new StorageJSON(path.resolve(__dirname, process.env.JSON_STORAGE_PATH));

        for (const command of commands) {
            this.commands.set(command.commandBuilder.name, command);
        }
    }

    public static getInstance(): Bot {
        if (this.instance === null) {
            throw new Error("Bot has not been initialized yet");
        }

        return this.instance;
    }

    public async run() {
        await this.init();
    }

    public getClient(): Client {
        return this.client;
    }

    public getCommands(): CommandCollection {
        return this.commands;
    }

    public getStorage(): StorageInterface {
        return this.storage;
    }

    private async init() {
        this.client.once(Events.ClientReady, () => {
            console.log("Client connected");
        });

        this.registerChatCommandHandler();

        console.log("Starting bot...");

        await this.client.login(this.token);
    }

    private async registerChatCommandHandler() {
        console.log("Registering slash command event handler");

        this.client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) {
                return;
            }

            console.log(`<@${interaction.user.id}> @${interaction.user.username}#${interaction.user.discriminator} issued command ${interaction.commandName}`);

            const command = this.commands.get(interaction.commandName);

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error("Error catched in slash command event handler", error);

                try {
                    await interaction.reply({
                        content: "An internal error occurred while executing command. Please try again later.",
                        ephemeral: true
                    });
                } catch(error) {
                    console.error("Could not reply to interaction after catching error in slash command event handler", error);
                }
            }
        });
    }
}

export default Bot;
