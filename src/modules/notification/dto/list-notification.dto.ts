

export class ListNotificationDto implements Readonly<ListNotificationDto>{

    spaceId: number;

    notifications: [
        {
            id: number,
            name: string,
            isEnable: boolean,
        }
    ]
   
}