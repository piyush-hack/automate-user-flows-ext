import { RecordableEventHandler, ExtScrollDownEvent } from "../../../common";
import { AppUtils } from "../../app-utils";

export class ScrollEventHandler extends RecordableEventHandler {

    constructor(private isRecording: boolean) {
        super()
    }

    listen() {
        document.addEventListener('scroll', this.recordScroll.bind(this), true);
        window.addEventListener('scroll', this.recordDocumentScroll.bind(this), true);
    }

    remove() {
        document.removeEventListener('scroll', this.recordScroll.bind(this), true);
        window.removeEventListener('scroll', this.recordDocumentScroll.bind(this), true);
    }

    private async recordScroll(event: any) {
        if (!this.isRecording || event.target === document) return;
        const interaction = new ExtScrollDownEvent(event.target.scrollLeft, event.target.scrollTop, AppUtils.getElementSelector(event.target))
        await AppUtils.saveInteraction(interaction);
    }

    private async recordDocumentScroll(event: any) {
        if (!this.isRecording) return;
        const interaction = new ExtScrollDownEvent(window.scrollX, window.scrollY, 'document')
        await AppUtils.saveInteraction(interaction);
    }

}