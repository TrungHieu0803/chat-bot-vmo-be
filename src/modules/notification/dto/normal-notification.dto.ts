

export class NormalNotificationDto implements Readonly<NormalNotificationDto>{

    name: string;

    content: string;

    tags: [];

    dayOfWeek: [];

    minute: string;

    hour: string;

    dayOfMonth: string;

    month: string;

    year: string;

    threadId: string;

    spaceId: number;
}