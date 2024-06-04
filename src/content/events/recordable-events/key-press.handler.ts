import { ExtKeyPressEvent, RecordableEventHandler } from "../../../common";
import { AppUtils } from "../../app-utils";

export class KeyPressEventHandler extends RecordableEventHandler {

    constructor(private isRecording: boolean) {
        super()
    }

    listen() {
        document.addEventListener('keydown', this.recordKeyPress.bind(this));
    }

    remove() {
        document.removeEventListener('keydown', this.recordKeyPress.bind(this));
    }

    private async recordKeyPress(event: any) {
        if (!this.isRecording) return;
        const interaction = new ExtKeyPressEvent(AppUtils.getElementSelector(event.target), event.key);
        await AppUtils.saveInteraction(interaction);

    }
}