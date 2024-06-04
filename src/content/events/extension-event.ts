export interface ExtensionEvent {
    init(data : any , sendResponse: (arg: any) => void) : Promise<void>

}