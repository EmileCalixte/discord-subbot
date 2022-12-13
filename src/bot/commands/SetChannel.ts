import {CommandInterface} from "../../types/Commands";
import {ChannelType, SlashCommandBuilder, TextChannel} from "discord.js";
import {getLocaleString} from "../../utils/LocaleUtil";

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
            await (channel as TextChannel).send("Here");
        } catch (error) {
            interaction.editReply(getLocaleString(interaction.locale, {
                "en-US": `I don't have access to the <#${channel.id}> channel. Please check that I have the permission to write there before trying again.`,
                fr: `Je n'ai pas accès au salon <#${channel.id}>. Merci de vérifier que j'ai la permission d'y écrire avant de réessayer.`,
            }));

            return;
        }

        // TODO handle

        interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": `The <#${channel.id}> channel has been successfully saved as registering channel.`,
            fr: `Le salon <#${channel.id}> a bien été enregistré en tant que salon d'enregistrement.`,
        }));
    }
}

export default SetChannel;
