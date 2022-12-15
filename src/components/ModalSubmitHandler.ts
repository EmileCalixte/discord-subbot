import {GuildMemberRoleManager, ModalSubmitInteraction} from "discord.js";
import Bot from "../bot/Bot";
import InputId from "../types/InputId";
import ModalId from "../types/ModalId";
import {getLocaleString} from "../utils/LocaleUtil";
import {isEmailValid} from "../utils/MiscUtil";

async function handleRegisterEmailAddress(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ephemeral: true});

    const allowedRoleIds = await Bot.getInstance().getStorage().getAllowedRoleIds();

    const memberRoleIds = Array.from((interaction.member.roles as GuildMemberRoleManager).cache.keys());

    const isMemberAllowedToRegister = allowedRoleIds.some(allowedRoleId => memberRoleIds.includes(allowedRoleId));

    if (!isMemberAllowedToRegister) {
        await interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": "You are not allowed to register your email address.",
            fr: "Vous n'êtes pas autorisé à enregistrer votre adresse e-mail.",
        }));

        return;
    }

    const emailAddress = String(interaction.fields.getTextInputValue(InputId.EmailAddress)).trim();

    if (!isEmailValid(emailAddress)) {
        interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": "Invalid email address.",
            fr: "Adresse e-mail invalide.",
        }));

        return;
    }

    await Bot.getInstance().getStorage().saveRegisteredUserEmailAddress(interaction.user.id, emailAddress);

    await interaction.editReply(getLocaleString(interaction.locale, {
        "en-US": "Your email address has been successfully saved.",
        fr: "Votre adresse e-mail a bien été enregistrée."
    }));
}

export async function onModalSubmit(interaction: ModalSubmitInteraction) {
    switch (interaction.customId) {
        case ModalId.RegisterEmailAddress:
            await handleRegisterEmailAddress(interaction);
            break;
    }
}
