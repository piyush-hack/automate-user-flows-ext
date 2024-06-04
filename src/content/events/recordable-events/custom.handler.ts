import { ExtCustomEvent, RecordableEventHandler } from "src/common";
import { AppUtils } from "src/content/app-utils";

export class CustomEventHandler extends RecordableEventHandler {
    selectElement: boolean = false;
    selectedElement: any;

    listen() {
        alert("hover and click over element to choose for extraction");
        document.addEventListener("mouseover", this.showRelatedElements.bind(this), true);
        document.addEventListener("mouseout", this.hideRelatedElements.bind(this), true);
        document.addEventListener("click", this.saveRelatedElement.bind(this));
    }

    async saveRelatedElement(){
        const interaction = new ExtCustomEvent(this.selectedElement , 'text' , null);
        await AppUtils.saveInteraction(interaction);
        alert("Element selected for extraction");
        this.remove(false);
    }
    
    showRelatedElements(event: any) {
        const elementSelector = AppUtils.getElementSelector(event.target);
        this.selectedElement = elementSelector;
        document.querySelectorAll(elementSelector).forEach(el => { el.style.background = "green"; });
    }

    hideRelatedElements(event: any) {
        const elementSelector = AppUtils.getElementSelector(event.target);
        document.querySelectorAll(elementSelector).forEach(el => { el.style.background = "transparent"; });
    }

    remove(showAlert : boolean = true) {
        document.removeEventListener("mouseover", this.showRelatedElements.bind(this), true);
        document.removeEventListener("mouseout", this.hideRelatedElements.bind(this), true);
        document.removeEventListener("click", this.remove.bind(this), true);
        if(showAlert){
            alert("Element selection stooped");
        }
    }
}