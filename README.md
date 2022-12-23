# Discord SubBot

A Discord bot designed for [BUG-MAN-FR's Discord Server](https://discord.com/invite/bugmanfr) to facilitate early access to videos for subscribers.

Thanks to SubBot, the users who have a role among those defined by the administrator can provide their email address. The administrator can then retrieve the list of email addresses to authorize them to access a Youtube video in advance, or for any other use.

When retrieving email addresses, the bot checks that each user still has a role that allows them to access the content, and only returns the email addresses of users who still have the required role.

## Requirements

- [Node.JS](https://nodejs.org/) >= 18.x

## Setup

### Get the code and build

After cloning the repository, run the following commands:

```sh
# Install dependencies
npm install

# Create Javascript production builds from Typescript source code
npm run build
```

### Create a Discord Application

Open the [Discord Developer Portal](https://discord.com/developers/applications), log into your account and click on the "New Application" button. Enter a name, for example "SubBot", and validate.

Once on the "General Information" page, locate your **Application ID** and copy it, you will need it. Then, select the "Bot" tab in the left pane, click the "Add Bot" button on the right and confirm.

You can now click the "Reset Token" button to reveal your bot's **Access token**. Copy it, and **DON'T EVER share it with anybody**.

Now you have your **Application ID** (aka **Client ID**) and your **Access token**, we can go on. You can read more information about setting up a bot application in the [discord.js guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) if you want to.

### Setup bot

Copy the `.env.default` file to `.env`. In the `.env` file, fill in the **Application ID** and **Access token** obtained previously. If you want, you can also change the path of the `storage.json` file, which will contain the data stored by the bot. By default, this file will be stored in the project root directory (it will be created automatically).

### Register commands

As the bot use Discord's "slash commands", you need to register the commands to the Discord API. A `register-commands.js` script is provided in order to perform this action. Simply run the following command:

```sh
node dist/register-commands.js
```

> If in the future we update the bot and add or change commands, you will need to rerun this script to update the commands to the Discord API.

### Invite the bot to your server

Use the following template URL to invite the bot to your server:

```
https://discord.com/api/oauth2/authorize?client_id=<APPLICATION_ID>&permissions=2048&scope=bot%20applications.commands
```

Replace `<APPLICATION_ID>` with your **Application ID**, go to the URL and follow the instructions.

> Note : This bot is (currently) NOT designed to work simultaneously on multiple Discord servers. Even though you won't necessarily encounter errors if you try to use the same instance of the bot on several servers, you should run an instance (and thus create an application on the Discord Developer Portal) for each server on which you want to use the bot.

## Run

To run the bot, simply run:

```sh
node dist/index.js
```

> We recommend you to use a process manager, for example [PM2](https://pm2.keymetrics.io/) in order to keep your bot online 24h/24.
>
> ```sh
> # Install PM2
> npm install --global pm2
> 
> # Run bot with PM2
> pm2 start dist/index.js --name subbot
> ```

## Usage

### Set register channel

Use the `/setchannel` command to add an interactive message with buttons that the users can use to register their email address.

![image](https://user-images.githubusercontent.com/26703184/209154994-178f96ea-f458-444f-9fc1-39001a6e8402.png)

> As the bot was designed for a French Discord Server, only the French language is currently supported for the public interactive message. Feel free to [open an Issue](https://github.com/EmileCalixte/discord-subbot/issues/new) if you need other languages.

### Define which roles are allowed to register

By default, nobody is allowed to register an email address.

![image](https://user-images.githubusercontent.com/26703184/209155785-568e6d6b-60dd-4be4-b81a-a9c91a53c474.png)

You need to add allowed roles. Use the `/subroles add <@role>` command to add at least one role. Users with at least one of the specified roles will be allowed to register their email address.

You can see which roles are currently allowed to register with the `/subroles view` command.

![image](https://user-images.githubusercontent.com/26703184/209158024-ad698274-540d-4c58-9007-a41514f57406.png)

### Retrieve registered email addresses

Use the `/getaddresses` command to get a text file containing all email addresses registered by users with at least one of the roles allowed to register.

![image](https://user-images.githubusercontent.com/26703184/209161697-d0f26f06-c23f-41d6-80ea-7969f48b514f.png)

## Prerequisites for development

- Docker Compose
- Make

## Development Commands

### Start development environment

```sh
docker compose up
```

### Create production builds

```sh
make build
```

### Register bot commands

```sh
make regcmds
```
