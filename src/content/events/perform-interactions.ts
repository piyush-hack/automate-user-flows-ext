import { RecordableEvent } from "../../common";
import { ExtensionEvent } from "./extension-event";

export class PerformInteractions implements ExtensionEvent {
    constructor() {
    }

    async init(interaction: RecordableEvent, sendResponse: (arg: any) => void) {
        interaction.execute(sendResponse.bind(this));
        sendResponse({status : "Success"});
    }
}