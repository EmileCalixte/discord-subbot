import {Client, Events, GatewayIntentBits} from "discord.js";

class Bot {
    private client: Client;

    private token: string;

    constructor(token: string) {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds]
        });

        this.token = token;
    }

    public async run() {
        await this.init();
    }

    private async init() {
        this.client.once(Events.ClientReady, (client: Client) => {
            console.log("Client connected");
        });

        console.log("Starting bot...");

        await this.client.login(this.token);
    }
}

export default Bot;
