// import { SupportGroupInfo, SupportGroupTeammembers } from "src/caching/model";

export enum StorageKeys {
    GROUP_CREATION_RESPONSE_DATA = "GROUP_CREATION_RESPONSE_DATA",
    CALC_DATA  = "CALC_DATA",
    INTERACTIONS = "INTERACTION",
    IS_RECORDING = "IS_RECORDING",
    IS_PLAYING = "IS_PLAYING",
    LAST_INTERACTION_TIME = "LAST_INTERACTION_TIME",
    RELATIVE_SCROLL = "RELATIVE_SCROLL"
}

export class Storage {

    static setStorage(key: string, value: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const obj: any = {};
            obj[key] = value;
            chrome.storage.local.set(obj, () => {
                resolve();
            });
        });
    }

    static getStorage(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (result) => {
                resolve(result[key]);
            });
        });
    }

    static async removeStorage(key: string) {
        await chrome.storage.local.remove([key]);
    }



    public static clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.clear(function () {
                var error = chrome.runtime.lastError;
                if (error) {
                    reject(error)
                }
                resolve();
            });
        });

    }

    private static parseBoolean(str: string) {
        return str === "true";
    }
}