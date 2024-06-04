export enum RoutingPath {
  ENTERPRISE_INFO = 'enterprise-info',
  API_KEY = 'api-key',
  USER_TICKETS = 'user-tickets',
  WA_NOT_LOADED = 'wa-not-loaded',
  GROUP_INFO = 'group-info',
  BLANK = 'blank',
  BULK_GROUP_MESSAGE = 'bulk-group-message',
  BULK_MESSAGE_REPORT = 'bulk-message-report',
  GROUP_CREATION = 'group-creation',
  BULK_CONTACT_MESSAGING = "BULK_CONTACT_MESSAGING"
}

export class RouteLinkGenerator {
    static grpCreationPage() {
        return `${RoutingPath.GROUP_CREATION}`
    }

    static bulkGroupMessagePage(): any {
        return `${RoutingPath.BULK_GROUP_MESSAGE}`;
    }

    static enterpriseInfoPage() {
        return `${RoutingPath.ENTERPRISE_INFO}`;
    }

    static apiKeyPage() {
        return `${RoutingPath.API_KEY}`;
    }

    static groupInfo() {
        return `${RoutingPath.GROUP_INFO}`;
    }

    static userTicketsPage() {
        return `${RoutingPath.USER_TICKETS}`;
    }

    static blankPage() {
        return `${RoutingPath.BLANK}`;
    }

    static messagingReport() {
        return `${RoutingPath.BULK_MESSAGE_REPORT}`;
    }

}

export enum RouteNames {
    ENTERPRISE = 'enterprise',
    TEAMMEMBER = 'teammember',
}