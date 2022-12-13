import {Snowflake} from "discord.js";

interface StorageInterface {
    saveRegisterMessageId: (messageId: Snowflake) => Promise<any>

    saveRegisterMessageChannelId: (channelId: Snowflake) => Promise<any>

    getRegisterMessageId: () => Promise<Snowflake | null>

    getRegisterMessageChannelId: () => Promise<Snowflake | null>
}

export default StorageInterface;
