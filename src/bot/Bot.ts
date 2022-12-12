import {Client, Collection, Events, GatewayIntentBits} from "discord.js";
import Ping from "./commands/Ping";
import CommandInterface from "./commands/CommandInterface";

type CommandCollection = Collection<string, CommandInterface>;

const commands: CommandInterface[] = [
    Ping,
];

class Bot {
    private client: Client;

    private token: string;

    private commands: CommandCollection;

    constructor(token: string) {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds]
        });

        this.token = token;

        this.commands = new Collection();

        for (const command of commands) {
            this.commands.set(command.commandBuilder.name, command);
        }
    }

    public async run() {
        await this.init();
    }

    public getCommands(): CommandCollection {
        return this.commands;
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
                console.error(error);
                await interaction.reply({
                    content: "An internal error occurred while executing command. Please try again later.",
                    ephemeral: true
                });
            }
        });
    }
}

export default Bot;
