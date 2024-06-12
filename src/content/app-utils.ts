import { StorageKeys, Storage } from "../common/storage/storage";
import { ClickEventHandler } from "./events/recordable-events/click.handler";
import { CustomEventHandler } from "./events/recordable-events/custom.handler";
import { InputEventHandler } from "./events/recordable-events/input.handler";
import { KeyPressEventHandler } from "./events/recordable-events/key-press.handler";
import { ScrollEventHandler } from "./events/recordable-events/scroll.handler";

export abstract class AppUtils {
    static getElementSelector(element: any) {
        let response = null;
        if (element) {
            if (element.id) {
                response = `#${element.id}`;
            } else if (element.className) {
                const className = element.className.replace(/^\s+|\s+$/g, '');
                response = `.${className.trim().split(' ').filter((classVal: any) => classVal.replace(/^\s+|\s+$/g, '')).join('.')}`;
            } else {
                response = element.tagName.toLowerCase();
            }
        }
        return response;
    }

    static async loadData() {
        const isRecording = await Storage.getStorage(StorageKeys.IS_RECORDING)
        const lastInteractionTime = await Storage.getStorage(StorageKeys.LAST_INTERACTION_TIME)
        return { isRecording, lastInteractionTime }
    }

    static async saveState(isRecording: boolean, interaction: string[], lastInteractionTime: number | null) {
        await Storage.setStorage(StorageKeys.IS_RECORDING, isRecording);
        await Storage.setStorage(StorageKeys.INTERACTIONS, interaction);
        await Storage.setStorage(StorageKeys.LAST_INTERACTION_TIME, lastInteractionTime);
    }

    static async saveInteraction(interaction: any) {
        const interactions = await Storage.getStorage(StorageKeys.INTERACTIONS);
        const currentTime = new Date().getTime();
        if (!interaction.timeGap) {
            const lastInteractionTime = await Storage.getStorage(StorageKeys.LAST_INTERACTION_TIME);
            const timeGap = lastInteractionTime ? currentTime - lastInteractionTime : 0;
            interaction.timeGap = timeGap;
        }
        ((interactions && Array.isArray(interactions)) ? interactions : []).push(interaction);
        await Storage.setStorage(StorageKeys.INTERACTIONS, interactions);
        await Storage.setStorage(StorageKeys.LAST_INTERACTION_TIME, currentTime);
    }

    static getListenEventHandlers() {
        return [ClickEventHandler, InputEventHandler, KeyPressEventHandler, ScrollEventHandler]
    };

    static getRemoveEventHandlers() {
        return [ClickEventHandler, InputEventHandler, KeyPressEventHandler, ScrollEventHandler, CustomEventHandler]
    };
}