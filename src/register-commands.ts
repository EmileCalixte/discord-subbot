import * as dotenv from "dotenv";
import Bot from "./bot/Bot";
import {REST, Routes} from "discord.js";

dotenv.config();

async function main() {
    const token = process.env.BOT_TOKEN;
    const clientId = process.env.CLIENT_ID;

    const bot = new Bot(token);

    const commands = bot.getCommands();

    if (commands.size === 0) {
        console.log("No command to register, exiting");
        process.exit(0);
    }

    console.log(`Found ${commands.size} command${commands.size > 1 ? "s" : ""}:`)

    const commandsToRegister = [];

    for (const [commandName, command] of commands) {
        console.log(`- ${commandName}`);

        commandsToRegister.push(command.commandBuilder.toJSON());
    }

    const rest = new REST({version: "10"}).setToken(token);

    console.log("Performing API request to register commands...");

    await rest.put(
        Routes.applicationCommands(clientId),
        {body: commandsToRegister},
    );

    console.log("Done");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
