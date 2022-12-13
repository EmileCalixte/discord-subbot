import {CommandInterface} from "../../types/Commands";
import {SlashCommandBuilder} from "discord.js";

enum SubCommand {
    Add = "add",
    Remove = "remove",
    View = "view",
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
        const subCommand = interaction.options.getSubcommand();

        interaction.reply({content: `Pong ${subCommand}`, ephemeral: true});
    }
}

export default SubRoles;
