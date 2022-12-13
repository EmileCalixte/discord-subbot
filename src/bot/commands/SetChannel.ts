import {CommandInterface} from "../../types/Commands";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType, DiscordAPIError, RESTJSONErrorCodes,
    SlashCommandBuilder,
    Snowflake,
    TextChannel
} from "discord.js";
import {getLocaleString} from "../../utils/LocaleUtil";
import CannotSendMessageInChannelError from "../../errors/CannotSendMessageInChannelError";
import ButtonId from "../../types/ButtonId";
import Bot from "../Bot";
import {getMessage} from "../../utils/DiscordJsManagerUtil";

type HandleReturnData = {
    failedToDeleteExistingMessage: boolean;
    deletedMessageUrl: string | null;
}

async function handle(channel: TextChannel): Promise<HandleReturnData> {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(ButtonId.RegisterSubscriber)
                .setLabel("M'enregistrer")
                .setStyle(ButtonStyle.Primary),
        );

    const {
        failed: failedToDeleteExistingMessage,
        messageUrl: deletedMessageUrl,
    } = await deleteExistingMessageIfExists(channel.guildId);

    let newMessage;

    try {
        newMessage = await (channel as TextChannel).send({
            content: "Cliquez sur le bouton ci-dessous pour enregistrer votre adresse e-mail",
            components: [row],
        });
    } catch (error) {
        throw new CannotSendMessageInChannelError(`Cannot send message in channel <#${channel.id}>`);
    }

    await Bot.getInstance().getStorage().saveRegisterMessageId(newMessage.id);
    await Bot.getInstance().getStorage().saveRegisterMessageChannelId(newMessage.channel.id);

    return {failedToDeleteExistingMessage, deletedMessageUrl};
}

async function deleteExistingMessageIfExists(guildId: Snowflake): Promise<{failed: boolean, messageUrl: string | null}> {
    const existingMessageChannelId = await Bot.getInstance().getStorage().getRegisterMessageChannelId();
    const existingMessageId = await Bot.getInstance().getStorage().getRegisterMessageId();

    let messageUrl = null;

    if (existingMessageId && existingMessageChannelId) {
        const existingMessage = await getMessage(guildId, existingMessageChannelId, existingMessageId)

        if (existingMessage) {
            messageUrl = existingMessage.url;

            try {
                await existingMessage.delete();
            } catch (error) {
                if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownMessage) {
                    return {
                        failed: true,
                        messageUrl,
                    };
                }
            }
        }
    }

    return {
        failed: false,
        messageUrl,
    };
}

const SetChannel: CommandInterface = {
    commandBuilder: new SlashCommandBuilder()
        .setName("setchannel")
        .setDescription("Allows subscribers to register in the channel where the command is executed")
        .setDescriptionLocalizations({
            fr: "Permet aux abonnés de s'enregistrer dans le salon où la commande est exécutée",
        })
        .setDefaultMemberPermissions(0),

    execute: async (interaction) => {
        await interaction.deferReply({ephemeral: true});

        const channel = interaction.channel;

        if (channel === null) {
            interaction.editReply(getLocaleString(interaction.locale, {
                "en-US": "Unable to find the requested channel.",
                fr: "Impossible de trouver le salon demandé.",
            }));

            return;
        }

        if (channel.type !== ChannelType.GuildText) {
            interaction.editReply(getLocaleString(interaction.locale, {
                "en-US": "Channel must be a text channel.",
                fr: "Le salon doit être un salon textuel.",
            }));

            return;
        }

        try {
            const {
                failedToDeleteExistingMessage,
                deletedMessageUrl,
            } = await handle(channel);

            if (failedToDeleteExistingMessage) {
                if (deletedMessageUrl) {
                    interaction.editReply(":warning: " + getLocaleString(interaction.locale, {
                        "en-US": `I could not delete my existing message: ${deletedMessageUrl} It may have already been deleted, or I can no longer access it. My new message should work anyway.`,
                        fr: `Je n'ai pas pu supprimer mon message existant : ${deletedMessageUrl} Peut-être qu'il a déjà été supprimé, ou je n'y ai plus accès. Mon nouveau message dans ce salon doit quand même fonctionner.`,
                    }));
                } else {
                    interaction.editReply(":warning: " + getLocaleString(interaction.locale, {
                        "en-US": `I could not delete my existing message. It may have already been deleted, or I can no longer access it. My new message should work anyway.`,
                        fr: `Je n'ai pas pu supprimer mon message existant. Peut-être qu'il a déjà été supprimé, ou je n'y ai plus accès. Mon nouveau message dans ce salon doit quand même fonctionner.`,
                    }));
                }

                return;
            }
        } catch (error) {
            if (error instanceof CannotSendMessageInChannelError) {
                interaction.editReply(getLocaleString(interaction.locale, {
                    "en-US": `I don't have access to the <#${channel.id}> channel. Please check that I have the permission to write there before trying again.`,
                    fr: `Je n'ai pas accès au salon <#${channel.id}>. Merci de vérifier que j'ai la permission d'y écrire avant de réessayer.`,
                }));

                return;
            } else {
                throw error;
            }
        }

        interaction.deleteReply();
    }
}

export default SetChannel;
