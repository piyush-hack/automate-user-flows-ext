import { StorageKeys, Storage } from "../../common/storage/storage";
import { AppUtils } from "../app-utils";
import { ExtensionEvent } from "./extension-event";


export class StopRecording implements ExtensionEvent {
    constructor() {
    }

    async init(data: any, sendResponse: (arg: any) => void) {
        await Storage.setStorage(StorageKeys.IS_RECORDING, false);
        const interactions = await Storage.getStorage(StorageKeys.INTERACTIONS);
        sendResponse(interactions);

        const handlers = AppUtils.getAciveEventHandlers();
        handlers.forEach((_, i) => new handlers[i](false).remove());

        alert("Stopped recording");
    }

}