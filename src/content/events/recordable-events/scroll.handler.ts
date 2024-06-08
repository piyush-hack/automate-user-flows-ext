import { RecordableEventHandler, ExtScrollDownEvent } from "../../../common";
import { AppUtils } from "../../app-utils";

export class ScrollEventHandler extends RecordableEventHandler {
    private boundRecordScroll: any;
    private boundRecordDocumentScroll: any;

    constructor(private isRecording: boolean) {
        super();
        this.boundRecordScroll = this.recordScroll.bind(this);
        this.boundRecordDocumentScroll = this.recordDocumentScroll.bind(this);
    }

    listen() {
        document.addEventListener('scroll', this.boundRecordScroll, true);
        window.addEventListener('scroll', this.boundRecordDocumentScroll, true);
    }

    remove() {
        document.removeEventListener('scroll', this.boundRecordScroll, true);
        window.removeEventListener('scroll', this.boundRecordDocumentScroll, true);
    }

    private async recordScroll(event: any) {
        if (!this.isRecording || event.target === document) return;

        await this.checkScrollPositions(event.target, 'element');
    }

    private async recordDocumentScroll(event: any) {
        if (!this.isRecording) return;

        await this.checkScrollPositions(event.target, 'document');
    }

    private async checkScrollPositions(target: HTMLElement | Document, type: 'element' | 'document') {
        console.log('recording scroll on ' , target)
        let scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth;

        let interaction: ExtScrollDownEvent = null
        if (type === 'element') {
            const element = target as HTMLElement;
            interaction = new ExtScrollDownEvent(element.scrollLeft, element.scrollTop, AppUtils.getElementSelector(event.target));
            scrollTop = element.scrollTop;
            scrollLeft = element.scrollLeft;
            scrollHeight = element.scrollHeight;
            scrollWidth = element.scrollWidth;
            clientHeight = element.clientHeight;
            clientWidth = element.clientWidth;
        } else {
            interaction = new ExtScrollDownEvent(window.scrollX, window.scrollY, 'document');
            scrollTop = window.scrollY;
            scrollLeft = window.scrollX;
            scrollHeight = document.body.scrollHeight;
            scrollWidth = document.body.scrollWidth;
            clientHeight = window.innerHeight;
            clientWidth = window.innerWidth;
        }

        if (scrollHeight - scrollTop === clientHeight) {
            interaction.scrollY = 1000000000000000000000000000000000;
        }

        // Check if scrolled to the top
        if (scrollTop === 0) {
            interaction.scrollY = 0;
        }

        // Check if scrolled to the leftmost
        if (scrollLeft === 0) {
            interaction.scrollX = 0;
        }

        // Check if scrolled to the rightmost
        if (scrollLeft + clientWidth === scrollWidth) {
            interaction.scrollX = 100000000000000000000000000000000000;
        }

        await AppUtils.saveInteraction(interaction);

    }
}
