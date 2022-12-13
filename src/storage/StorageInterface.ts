import {Snowflake} from "discord.js";

interface StorageInterface {
    saveRegisterMessageId: (messageId: Snowflake) => Promise<any>

    saveRegisterMessageChannelId: (channelId: Snowflake) => Promise<any>

    getRegisterMessageId: () => Promise<Snowflake | null>

    getRegisterMessageChannelId: () => Promise<Snowflake | null>

    addAllowedRoleId: (roleId: Snowflake) => Promise<any>

    removeAllowedRoleId: (roleId: Snowflake) => Promise<any>

    getAllowedRoleIds: () => Promise<Snowflake[]>
}

export default StorageInterface;
