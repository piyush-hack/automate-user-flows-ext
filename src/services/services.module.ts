import { NgModule, ModuleWithProviders } from "@angular/core";

@NgModule({
    imports: []
})
export class ServicesModule {
    static forRoot(): ModuleWithProviders<ServicesModule> {
        return {
            ngModule: ServicesModule,
            providers: [
            ]
        };
    }
}

export {
};


