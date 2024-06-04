import { environment } from "../environment";

export class LinkGenerator {
    static activityPage(enterpriseid: string): string | undefined {
        return `${environment.CLIENT_URL}/my-activities/calls`
    }
}