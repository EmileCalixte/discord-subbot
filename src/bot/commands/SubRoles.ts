import {CommandInterface} from "../../types/Commands";
import {CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {getLocaleString} from "../../utils/LocaleUtil";
import Bot from "../Bot";

enum SubCommand {
    Add = "add",
    Remove = "remove",
    View = "view",
}

async function executeAdd(interaction: ChatInputCommandInteraction<CacheType>) {
    const role = interaction.options.getRole("role");

    if (!role) {
        await interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": "Role not found",
            fr: "Rôle non trouvé",
        }));

        return;
    }

    const allowedRoleIds = await Bot.getInstance().getStorage().getAllowedRoleIds();

    if (allowedRoleIds.includes(role.id)) {
        await interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": `Role <@&${role.id}> is already allowed to register.`,
            fr: `Le rôle <@&${role.id}> est déjà autorisé à s'enregistrer.`,
        }));

        return;
    }

    await Bot.getInstance().getStorage().addAllowedRoleId(role.id);

    await interaction.editReply(getLocaleString(interaction.locale, {
        "en-US": `Role <@&${role.id}> is now allowed to register.`,
        fr: `Le rôle <@&${role.id}> est désormais autorisé à s'enregistrer.`,
    }));
}

async function executeRemove(interaction: ChatInputCommandInteraction<CacheType>) {
    const role = interaction.options.getRole("role");

    if (!role) {
        await interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": "Role not found",
            fr: "Rôle non trouvé",
        }));

        return;
    }

    const allowedRoleIds = await Bot.getInstance().getStorage().getAllowedRoleIds();

    if (!allowedRoleIds.includes(role.id)) {
        await interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": `Role <@&${role.id}> is not allowed to register.`,
            fr: `Le rôle <@&${role.id}> n'est pas autorisé à s'enregistrer.`,
        }));

        return;
    }

    await Bot.getInstance().getStorage().removeAllowedRoleId(role.id);

    await interaction.editReply(getLocaleString(interaction.locale, {
        "en-US": `Role <@&${role.id}> is no longer allowed to register.`,
        fr: `Le rôle <@&${role.id}> n'est plus autorisé à s'enregistrer.`,
    }));
}

async function executeView(interaction: ChatInputCommandInteraction<CacheType>) {
    const allowedRoleIds = await Bot.getInstance().getStorage().getAllowedRoleIds();

    if (allowedRoleIds.length === 0) {
        await interaction.editReply(getLocaleString(interaction.locale, {
            "en-US": "No roles are currently allowed to register",
            fr: "Aucun rôle n'est actuellement autorisé à s'enregistrer"
        }));

        return;
    }

    const embed = new EmbedBuilder()
        .addFields({
            name: `Il y a actuellement ${allowedRoleIds.length} rôles autorisés à s'enregistrer`,
            value: allowedRoleIds.map(roleId => `<@&${roleId}> (${roleId})`).join("\n"),
        });

    interaction.editReply({
        embeds: [embed],
    });
}

const SubRoles: CommandInterface = {
    commandBuilder: new SlashCommandBuilder()
        .setName("subroles")
        .setDescription("Manage subscriber roles")
        .setDescriptionLocalizations({
            fr: "Gérer les rôles des abonnés",
        })
        .addSubcommand(subCommand =>
            subCommand
                .setName(SubCommand.Add)
                .setDescription("Add a role allowed to register")
                .setDescriptionLocalizations({
                    fr: "Ajouter un rôle autorisé à s'enregistrer",
                })
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("The role to add")
                        .setDescriptionLocalizations({
                            fr: "Le rôle à ajouter",
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName(SubCommand.Remove)
                .setDescription("Remove a role allowed to register")
                .setDescriptionLocalizations({
                    fr: "Enlever un rôle autorisé à s'enregistrer",
                })
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("The role to remove from the list of allowed roles")
                        .setDescriptionLocalizations({
                            fr: "Le rôle à enlever de la liste des rôles autorisés",
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName(SubCommand.View)
                .setDescription("Get list of roles that are allowed to register")
                .setDescriptionLocalizations({
                    fr: "Obtenir la liste des rôles qui sont autorisés à s'enregistrer",
                })
        )
        .setDefaultMemberPermissions(0),

    execute: async (interaction) => {
        await interaction.deferReply({ephemeral: true});

        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case SubCommand.Add:
                executeAdd(interaction);
                break;
            case SubCommand.Remove:
                executeRemove(interaction);
                break;
            case SubCommand.View:
                executeView(interaction);
        }
    }
}

export default SubRoles;
