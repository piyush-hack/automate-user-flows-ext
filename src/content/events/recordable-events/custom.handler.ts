import { ExtCustomEvent, RecordableEventHandler } from "src/common";
import { AppUtils } from "src/content/app-utils";

export class CustomEventHandler extends RecordableEventHandler {
    selectElement: boolean = false;
    selectedElement: any;
    showRelatedEl: any;
    hideRelatedEl: any;
    saveRelatedEl: any;
    constructor() {
        super()
        this.showRelatedEl = this.showRelatedElements.bind(this);
        this.hideRelatedEl = this.hideRelatedElements.bind(this);
        this.saveRelatedEl = this.saveRelatedElement.bind(this);
    }

    listen() {
        alert("hover and click over element to choose for extraction");

        document.addEventListener("mouseover", this.showRelatedEl);
        document.addEventListener("mouseout", this.hideRelatedEl);
        document.addEventListener("click", this.saveRelatedEl);
    }

    async saveRelatedElement() {
        const interaction = new ExtCustomEvent(this.selectedElement, 'text', null);
        this.resetElementChanges();
        await AppUtils.saveInteraction(interaction);
        alert("Saved element")
        this.remove(false);
    }

    private resetElementChanges() {
        Array.from(document.querySelectorAll(this.selectedElement)).forEach(el => { 
            el.style.backgroundColor = 'transparent';
            el.style.pointerEvents = 'auto';
         });
    }

    showRelatedElements(event: any) {
        const elementSelector = AppUtils.getElementSelector(event.target);
        this.selectedElement = elementSelector;
        Array.from(document.querySelectorAll(elementSelector)).forEach(el => { 
            el.style.backgroundColor = 'green',
            el.style.pointerEvents = 'none';
         });
    }

    hideRelatedElements(event: any) {
        // if (this.listenEvents) {
        // const elementSelector = AppUtils.getElementSelector(event.target);
        this.resetElementChanges();
        // }
    }

    remove(showAlert: boolean = true) {
        document.removeEventListener("mouseover", this.showRelatedEl);
        document.removeEventListener("mouseout", this.hideRelatedEl);
        document.removeEventListener("click", this.saveRelatedEl);
        if (showAlert) {
            alert("Element selection stopped");
        }
    }
}