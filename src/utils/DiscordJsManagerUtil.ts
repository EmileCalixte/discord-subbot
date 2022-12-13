import {
    BaseGuildTextChannel,
    ChannelType,
    DiscordAPIError,
    Guild,
    GuildBasedChannel,
    Message,
    RESTJSONErrorCodes,
    Snowflake
} from "discord.js";
import Bot from "../bot/Bot";

export async function getMessage(guildId: Snowflake, channelId: Snowflake, messageId: Snowflake): Promise<Message | null> {
    const channel = await getChannel(guildId, channelId);

    if (!channel) {
        return null;
    }

    if (!(channel instanceof BaseGuildTextChannel)) {
        return null;
    }

    try {
        return await channel.messages.fetch(messageId)
    } catch (error) {
        if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownMessage) {
            return null;
        }
    }
}

export async function getChannel(guildId: Snowflake, channelId: Snowflake): Promise<GuildBasedChannel> {
    const guild = await getGuild(guildId);

    if (!guild) {
        return null;
    }

    try {
        return await guild.channels.fetch(channelId);
    } catch (error) {
        if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownChannel) {
            return null;
        }
    }
}

export async function getGuild(guildId: Snowflake): Promise<Guild | null> {
    const client = Bot.getInstance().getClient();

    try {
        return await client.guilds.fetch(guildId);
    } catch (error) {
        if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownGuild) {
            return null;
        }
    }
}
