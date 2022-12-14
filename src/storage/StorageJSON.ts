import StorageInterface from "./StorageInterface";
import {Snowflake} from "discord.js";
import * as fs from "fs";
import * as path from "path";

enum Key {
    RegisterMessageId = "registerMessage.messageId",
    RegisterMessageChannelId = "registerMessage.channelId",
    AllowedRoleIds = "allowedRoleIds",
    RegisteredUsers = "registeredUsers",
}

type StorageObjectValue = StorageObject | string | number | Array<StorageObjectValue>;

type StorageObject = {
    [key: string]: StorageObjectValue;
}

class StorageJSON implements StorageInterface {
    private storageFilePath: string;

    constructor(storageFilePath: string) {
        this.storageFilePath = storageFilePath;

        this.ensureStorageFileExists();
    }

    public async saveRegisterMessageId(messageId: Snowflake) {
        await this.saveKeyValue(Key.RegisterMessageId, messageId);
    }

    public async getRegisterMessageId(): Promise<Snowflake | null> {
        return this.getSnowflakeKeyValue(Key.RegisterMessageId);
    }

    public async saveRegisterMessageChannelId(channelId: Snowflake) {
        await this.saveKeyValue(Key.RegisterMessageChannelId, channelId);
    }

    public async getRegisterMessageChannelId(): Promise<Snowflake | null> {
        return this.getSnowflakeKeyValue(Key.RegisterMessageChannelId);
    }

    public async addAllowedRoleId(roleId: Snowflake) {
        const allowedRoleIds = await this.getAllowedRoleIds();

        allowedRoleIds.push(roleId);

        await this.saveKeyValue(Key.AllowedRoleIds, allowedRoleIds);
    }

    public async removeAllowedRoleId(roleId: Snowflake) {
        const allowedRoleIds = await this.getAllowedRoleIds();

        const roleIdIndex = allowedRoleIds.indexOf(roleId);

        if (roleIdIndex < 0) {
            return;
        }

        allowedRoleIds.splice(roleIdIndex, 1);

        await this.saveKeyValue(Key.AllowedRoleIds, allowedRoleIds);
    }

    public async getAllowedRoleIds(): Promise<Snowflake[]> {
        const value = await this.getArrayKeyValue(Key.AllowedRoleIds);

        for (const [i, roleId] of value.entries()) {
            if (typeof roleId !== "string") {
                throw new Error(`Expected StorageObject ${Key.AllowedRoleIds}[${i}] to be a string, got ${typeof roleId}`);
            }
        }

        return value as string[];
    }

    public async saveRegisteredUserEmailAddress(userId: Snowflake, emailAddress: string): Promise<any> {
        const key = `${Key.RegisteredUsers}.${userId}`;

        await this.saveKeyValue(key as Key, emailAddress);
    }

    public async getRegisteredUserEmailAddress(userId: Snowflake): Promise<string | null> {
        const key = `${Key.RegisteredUsers}.${userId}`;

        return await this.getStringKeyValue(key as Key);
    }

    public async deleteRegisteredUserEmailAddress(userId: Snowflake): Promise<any> {
        // TODO
    }

    private async getStringKeyValue(key: Key): Promise<string | null> {
        const value = await this.getKeyValue(key);

        if (value === undefined) {
            return null;
        }

        if (typeof value !== "string") {
            throw new Error(`Expected StorageObject ${key} to be a string, got ${typeof value}`);
        }

        return value;
    }

    private async getSnowflakeKeyValue(key: Key): Promise<Snowflake | null> {
        const value = await this.getKeyValue(key);

        if (value === undefined) {
            return null;
        }

        if (typeof value !== "string") {
            throw new Error(`Expected StorageObject ${key} to be a string, got ${typeof value}`);
        }

        return value;
    }

    private async getArrayKeyValue(key: Key): Promise<StorageObjectValue[]> {
        const value = await this.getKeyValue(key);

        if (value === undefined) {
            return [];
        }

        if (!(value instanceof Array)) {
            throw new Error(`Expected StorageObject ${key} to be an array, got ${typeof value}`);
        }

        return value;
    }

    private async saveKeyValue(key: Key, value: StorageObjectValue) {
        this.ensureStorageFileExists();

        const storageObject = await this.getStorageObject();

        const keyNames = key.split(".");

        let object = storageObject;

        for (const [i, keyName] of keyNames.entries()) {
            if (i === keyNames.length - 1) {
                object[keyName] = value;
                break;
            }

            if (!(keyName in object)) {
                object[keyName] = {};
            }

            if (!(object[keyName] instanceof Object)) {
                throw new Error(`Expected StorageObject ${keyNames.splice(0, i+1).join(".")} to be an object, got ${typeof object[keyName]}`);
            }

            object = object[keyName] as StorageObject;
        }

        this.writeStorageObject(storageObject);
    }

    private async getKeyValue(key: Key): Promise<StorageObjectValue | undefined> {
        this.ensureStorageFileExists();

        const storageObject = await this.getStorageObject();

        const keyNames = key.split(".");

        let object = storageObject;
        let value = undefined;

        for (const [i, keyName] of keyNames.entries()) {
            if (!(keyName in object)) {
                break;
            }

            if (i === keyNames.length - 1) {
                value = object[keyName];
                break;
            }

            if (!(object[keyName] instanceof Object)) {
                throw new Error(`Expected StorageObject ${keyNames.splice(0, i+1).join(".")} to be an object, got ${typeof object[keyName]}`);
            }

            object = object[keyName] as StorageObject;
        }

        return value;
    }

    private async getStorageObject(): Promise<StorageObject> {
        await this.ensureStorageFileExists();

        const fileContent = fs.readFileSync(this.storageFilePath).toString();

        try {
            const parsedContent = JSON.parse(fileContent);

            if (!(parsedContent instanceof Object)) {
                throw new SyntaxError(`Storage JSON must be an object, read ${typeof parsedContent}`);
            }

            return parsedContent;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(`Invalid or corrupted storage file: ${error.message}`);
            }
        }
    }

    private async writeStorageObject(storageObject: StorageObject) {
        await this.ensureStorageFileExists();

        await fs.writeFileSync(this.storageFilePath, JSON.stringify(storageObject));
    }

    private async ensureStorageFileExists() {
        if (!fs.existsSync(this.storageFilePath)) {
            this.createStorageFile();
            return;
        }

        const stats = fs.statSync(this.storageFilePath);

        if (!stats.isFile()) {
            throw new Error(`Storage file path (${this.storageFilePath}) exists but is not a file`);
        }
    }

    private async createStorageFile() {
        console.log(`Creating storage file ${this.storageFilePath}`);

        fs.mkdirSync(path.dirname(this.storageFilePath), {recursive: true});
        fs.writeFileSync(this.storageFilePath, JSON.stringify({}));
    }
}

export default StorageJSON;
