import { RecordableEventHandler , ExtInputEvent } from "../../../common/";
import { AppUtils } from "../../app-utils";


export class InputEventHandler extends RecordableEventHandler {

    constructor(private isRecording: boolean) {
        super()
    }

    listen() {
        document.addEventListener('input', this.recordInput.bind(this));
    }

    remove() {
        document.removeEventListener('input', this.recordInput.bind(this));
    }

    private async recordInput(event: any) {
        if (!this.isRecording) return;
        const activeElement = event.target;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) {
            const interaction = new ExtInputEvent(
                activeElement.value || activeElement.innerText,
                AppUtils.getElementSelector(activeElement)
            );
            await AppUtils.saveInteraction(interaction);
        }
    }
}