import {
    ActionRowBuilder,
    ButtonInteraction, GuildMemberRoleManager,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import Bot from "../bot/Bot";
import ButtonId from "../types/ButtonId";
import InputId from "../types/InputId";
import ModalId from "../types/ModalId";
import {getLocaleString} from "../utils/LocaleUtil";

async function handleRegisterButtonClick(interaction: ButtonInteraction) {
    const allowedRoleIds = await Bot.getInstance().getStorage().getAllowedRoleIds();

    const memberRoleIds = Array.from((interaction.member.roles as GuildMemberRoleManager).cache.keys());

    const isMemberAllowedToRegister = allowedRoleIds.some(allowedRoleId => memberRoleIds.includes(allowedRoleId));

    if (!isMemberAllowedToRegister) {
        await interaction.reply({
            content: getLocaleString(interaction.locale, {
                "en-US": "You are not allowed to register your email address.",
                fr: "Vous n'êtes pas autorisé à enregistrer votre adresse e-mail.",
            }),
            ephemeral: true,
        });

        return;
    }

    const modal = new ModalBuilder()
        .setCustomId(ModalId.RegisterEmailAddress)
        .setTitle(getLocaleString(interaction.locale, {
            "en-US": "Your email address",
            fr: "Votre adresse e-mail",
        }))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId(InputId.EmailAddress)
                    .setLabel(getLocaleString(interaction.locale, {
                        "en-US": "Email address",
                        fr: "Adresse e-mail",
                    }))
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMinLength(3)
                    .setMaxLength(320)
            )
        );

    await interaction.showModal(modal);
}

async function handleCheckRegistrationButtonClick(interaction: ButtonInteraction) {
    await interaction.deferReply({ephemeral: true});

    const registeredEmailAddress = await Bot.getInstance().getStorage().getRegisteredUserEmailAddress(interaction.user.id);

    if (!registeredEmailAddress) {
        await interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": "You did not provide your email address.",
            fr: "Vous n'avez pas fourni votre adresse e-mail.",
        }));

        return;
    }

    await interaction.editReply(getLocaleString(interaction.locale, {
        "en-US": `You did not provide your email address.`,
        fr: `L'adresse e-mail que vous avez enregistrée est : \`${registeredEmailAddress}\``,
    }));
}

async function handleDeleteRegistrationButtonClick(interaction: ButtonInteraction) {
    await interaction.deferReply({ephemeral: true});

    const registeredEmailAddress = await Bot.getInstance().getStorage().getRegisteredUserEmailAddress(interaction.user.id);

    if (!registeredEmailAddress) {
        await interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": "You did not provide your email address.",
            fr: "Vous n'avez pas fourni votre adresse e-mail.",
        }));

        return;
    }

    await Bot.getInstance().getStorage().deleteRegisteredUserEmailAddress(interaction.user.id);

    await interaction.editReply(getLocaleString(interaction.locale, {
        "en-US": "Your registration has successfully been deleted, your email address is no longer registered.",
        fr: "Votre enregistrement a bien été supprimé, votre adresse e-mail n'est plus enregistrée.",
    }));
}

export async function onButtonClick(interaction: ButtonInteraction) {
    switch (interaction.customId) {
        case ButtonId.RegisterSubscriber:
            await handleRegisterButtonClick(interaction);
            break;
        case ButtonId.CheckRegistration:
            await handleCheckRegistrationButtonClick(interaction);
            break;
        case ButtonId.DeleteRegistration:
            await handleDeleteRegistrationButtonClick(interaction);
            break;
    }
}
