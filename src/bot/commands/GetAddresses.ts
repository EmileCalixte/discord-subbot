import {AttachmentBuilder, GuildMemberRoleManager, SlashCommandBuilder} from "discord.js";
import {CommandInterface} from "../../types/Commands";
import {getGuildMember} from "../../utils/DiscordJsManagerUtil";
import Bot from "../Bot";

const GetAddresses: CommandInterface = {
    commandBuilder: new SlashCommandBuilder()
        .setName("getaddresses")
        .setDescription("Returns the list of email addresses of registered subscribers")
        .setDescriptionLocalizations({
            fr: "Renvoie la liste des adresses email des abonnés enregistrés",
        })
        .setDefaultMemberPermissions(0),

    execute: async (interaction) => {
        await interaction.deferReply({ephemeral: true});

        const registeredSubscribers = await Bot.getInstance().getStorage().getAllRegisteredUserEmailAddresses();

        const allowedRoleIds = await Bot.getInstance().getStorage().getAllowedRoleIds();

        for (const memberId in registeredSubscribers) {
            const member = await getGuildMember(interaction.guildId!, memberId);

            if (!member) {
                delete registeredSubscribers[memberId];
                continue;
            }

            const memberRoleIds = Array.from((member.roles as GuildMemberRoleManager).cache.keys());

            const isMemberSubscriber = allowedRoleIds.some(allowedRoleId => memberRoleIds.includes(allowedRoleId));

            if (!isMemberSubscriber) {
                delete registeredSubscribers[memberId];
            }
        }

        const addressesExportString = Object.values(registeredSubscribers).join(';');

        const attachment = new AttachmentBuilder(Buffer.from(addressesExportString, "utf-8"), {name: "subscribers.txt"});

        interaction.editReply({files: [attachment]});
    }
}

export default GetAddresses;
