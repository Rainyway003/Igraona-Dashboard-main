import { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
    {
        name: 'home',
        list: '/',
    },
    {
        name: 'tournaments',
        list: '/tournaments',
        create: '/tournaments/new',
        edit: '/tournaments/edit/:id'
    }
]