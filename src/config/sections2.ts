import type { SectionMenuType } from "../types/sections"


export const sections2: SectionMenuType[] = [
    {
        "id": "c01ce69e-72ba-4bef-98d4-5ecff5e4eba1",
        "name": "Управление доступами",
        "link": null,
        "icon": null,
        "isEnabled": false,
        "iconPosition": "left",
        "parentId": null,
        "children": [
            {
                "id": "c12349e-72ba-4bef-98d4-5ecff5e4eba1",
                "name": "Роли",
                "link": "/backoffice/access-control/roles",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "c01ce69e-72ba-4bef-98d4-5ecff5e4eba1",
                "children": []
            },
            {
                "id": "c01ce33e-72ba-4bef-98d4-5ecff5e4eba1",
                "name": "Привилегии",
                "link": "/backoffice/access-control/privileges",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "c01ce69e-72ba-4bef-98d4-5ecff5e4eba1",
                "children": []
            },
            {
                "id": "c01ce643-72ba-4bef-98d4-5ecff5e4eba1",
                "name": "Профили",
                "link": "/backoffice/access-control/profiles",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "c01ce69e-72ba-4bef-98d4-5ecff5e4eba1",
                "children": []
            },
        ],
    },
    {
        "id": "fa5cc36c-236b-4226-b3d8-f49e733a4095",
        "name": "Комплаенс",
        "link": null,
        "icon": null,
        "isEnabled": true,
        "iconPosition": "left",
        "parentId": null,
        "children": [
            {
                "id": "ff1080f0-03ee-4f29-99bc-8eb6582c45b7",
                "name": "Клиенты",
                "link": "/compliance/clients",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "fa5cc36c-236b-4226-b3d8-f49e733a4095",
                "children": []
            },
            {
                "id": "0f0c95f3-88d4-433d-8777-b432cd24f78d",
                "name": "Операции",
                "link": "/compliance/operations",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "fa5cc36c-236b-4226-b3d8-f49e733a4095",
                "children": []
            },
            {
                "id": "c4beb81b-1402-4a77-8494-1a77d65ecf65",
                "name": "Блэклист",
                "link": "/compliance/blacklist",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "fa5cc36c-236b-4226-b3d8-f49e733a4095",
                "children": []
            },
            {
                "id": "2f65bc3c-f499-41fc-9eb7-9796f4613252",
                "name": "Антифрод",
                "link": "/compliance/antifraud",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "fa5cc36c-236b-4226-b3d8-f49e733a4095",
                "children": []
            },
        ]
    },
    {
        "id": "faf2c231-8cb8-48a5-bc81-75f53f4bc2af",
        "name": "Аналитика",
        "link": null,
        "icon": null,
        "isEnabled": true,
        "iconPosition": "left",
        "parentId": null,
        "children": [
            {
                "id": "60b256dc-eaa4-4a15-9b13-9e68e3638c36",
                "name": "Отчёты",
                "link": null,
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "faf2c231-8cb8-48a5-bc81-75f53f4bc2af",
                "children": [
                    {
                        "id": "93f85c98-753c-43c5-bc27-074f69db3e17",
                        "name": "Клиенты",
                        "link": "/analytics/reports/clients",
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "60b256dc-eaa4-4a15-9b13-9e68e3638c36",
                        "children": []
                    },
                    {
                        "id": "adb80705-f053-4506-ac4a-d5067adee6af",
                        "name": "Транзакции",
                        "link": "/analytics/reports/transactions",
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "60b256dc-eaa4-4a15-9b13-9e68e3638c36",
                        "children": []
                    }
                ]
            },
            {
                "id": "9e2a32e8-fcd3-4619-b236-e70a207f11b3",
                "name": "Акты сверки",
                "link": "/analytics/acts",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "faf2c231-8cb8-48a5-bc81-75f53f4bc2af",
                "children": []
            },
            {
                "id": "9e2a32e8-fcd3-4619-b236-e70a207f07b3",
                "name": "Диспуты",
                "link": "/analytics/disputes",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "faf2c231-8cb8-48a5-bc81-75f53f4bc2af",
                "children": []
            },
            {
                "id": "9e2a32e8-fcd3-4619-b211-e70a207f07b3",
                "name": "Бизнес мониторинг",
                "link": "/analytics/monitoring",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "faf2c231-8cb8-48a5-bc81-75f53f4bc2af",
                "children": []
            },
        ]
    },
    {
        "id": "0fb02900-b14e-4176-af72-3fef8ba311c1",
        "name": "Сервис деск",
        "link": null,
        "icon": null,
        "isEnabled": true,
        "iconPosition": "left",
        "parentId": null,
        "children": [
            {
                "id": "3294ab45-d6ee-4603-8a12-e87ad3ba699c",
                "name": "Клиенты",
                "link": "/service-desk/clients",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "0fb02900-b14e-4176-af72-3fef8ba311c1",
                "children": []
            },
            {
                "id": "8f044fd0-5818-4da0-9f80-bf2803c3a018",
                "name": "Заявки",
                "link": "/service-desk/requests",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "0fb02900-b14e-4176-af72-3fef8ba311c1",
                "children": []
            },
            {
                "id": "8f044fd0-5818-4da0-9f80-bf2803c1a022",
                "name": "Транзакции",
                "link": "/service-desk/transactions",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "0fb02900-b14e-4176-af72-3fef8ba311c1",
                "children": []
            },
            {
                "id": "8f044fd0-5818-4da0-9f80-bf2203c1a022",
                "name": "Диспуты",
                "link": "/service-desk/disputes",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "0fb02900-b14e-4176-af72-3fef8ba311c1",
                "children": []
            },
        ]
    },
    {
        "id": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
        "name": "Администрирование",
        "link": null,
        "icon": null,
        "isEnabled": true,
        "iconPosition": "left",
        "parentId": null,
        "children": [
            {
                "id": "70f1ea76-3c80-45f4-b7d2-0224fec722c4",
                "name": "Системные настройки",
                "link": null,
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                "children": [
                    {
                        "id": "70f1ea76-3c80-45f4-b7d2-0224fec746c4",
                        "name": "Продукты",
                        "link": null,
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                        "children": [
                            {
                                "id": "fb5e0181-bdd5-499b-8e04-990a98c8b123",
                                "name": "Счета",
                                "link": "/administration/products/accounts",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "70f1ea76-3c80-45f4-b7d2-0224fec746c4",
                                "children": []
                            },
                            {
                                "id": "fb5e0181-bdd5-499b-8e04-990a98c8b222",
                                "name": "Карты",
                                "link": "/administration/products/cards",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "70f1ea76-3c80-45f4-b7d2-0224fec746c4",
                                "children": []
                            },
                            {
                                "id": "fb5e0181-bdd5-499b-8e04-990a98c8b333",
                                "name": "Мудараба",
                                "link": "/administration/products/mudaraba",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "70f1ea76-3c80-45f4-b7d2-0224fec746c4",
                                "children": []
                            },
                            {
                                "id": "fb5e0181-bdd5-499b-8e04-990a98c8b231",
                                "name": "Мурабаха",
                                "link": "/administration/products/murabaha",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "70f1ea76-3c80-45f4-b7d2-0224fec746c4",
                                "children": []
                            },
                            {
                                "id": "fb5e0181-bdd5-499b-8e04-990a98c8b112",
                                "name": "Сейфовые ячейки",
                                "link": "/administration/products/safe",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "70f1ea76-3c80-45f4-b7d2-0224fec746c4",
                                "children": []
                            },
                        ]
                    },
                    {
                        "id": "70f1ea54-3c80-45f4-b7d2-0224fec746c3",
                        "name": "Оповещения",
                        "link": "/administration/notifications",
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                        "children": []
                    },
                    {
                        "id": "70f1ea13-3c80-45f4-b7d2-0224fec746c3",
                        "name": "Сервисы",
                        "link": "/administration/services",
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                        "children": []
                    },
                    {
                        "id": "70f1ea31-3c80-45f4-b7d2-0224fec746c3",
                        "name": "Тарифы",
                        "link": "/administration/tariffs",
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                        "children": []
                    },
                    {
                        "id": "ac26c329-ff93-4e26-b43a-557a1aa0ca85",
                        "name": "Лимиты",
                        "link": null,
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                        "children": [
                            {
                                "id": "d06c3018-f39f-4143-8ac6-76ff1e3cf276",
                                "name": "Юр.лица",
                                "link": "/administration/limits/corporate",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "ac26c329-ff93-4e26-b43a-557a1aa0ca85",
                                "children": []
                            },
                            {
                                "id": "a3362bb8-11f7-42e8-81e5-877516880d56",
                                "name": "ИП",
                                "link": "/administration/limits/pe",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "ac26c329-ff93-4e26-b43a-557a1aa0ca85",
                                "children": []
                            },
                            {
                                "id": "e0d65866-8ca4-4c04-b0b3-7e8037e0788c",
                                "name": "Физ.лица",
                                "link": "/administration/limits/retail",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "ac26c329-ff93-4e26-b43a-557a1aa0ca85",
                                "children": []
                            },
                            {
                                "id": "c6e1dcb5-5b47-4b90-a665-c6f1b84f1ca1",
                                "name": "Онлайн",
                                "link": "/administration/limits/online",
                                "icon": null,
                                "isEnabled": true,
                                "iconPosition": "left",
                                "parentId": "ac26c329-ff93-4e26-b43a-557a1aa0ca85",
                                "children": []
                            }
                        ]
                    },]
            },
            {
                "id": "22f1ea76-3c80-45f4-b7d2-0224fec746c3",
                "name": "Настройки СУД",
                "link": null,
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                "children": [
                    {
                        "id": "70f1ea76-3c80-45f4-b7d2-1114fec746c3",
                        "name": "Роли",
                        "link": null,
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "22f1ea76-3c80-45f4-b7d2-0224fec746c3",
                        "children": []
                    },
                    {
                        "id": "70f1ea76-3c11-45f4-b7d2-1114fec746c3",
                        "name": "Пользователи",
                        "link": null,
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "22f1ea76-3c12-45f4-b7d2-0224fec746c3",
                        "children": []
                    },
                    {
                        "id": "70f1ea76-3c80-45f4-b722-1114fec746c3",
                        "name": "Группы",
                        "link": null,
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "22f1ea76-3c13-45f4-b7d2-0224fec746c3",
                        "children": []
                    },
                    {
                        "id": "70f1ea76-3c81-45f4-b7d2-1114fec746c3",
                        "name": "Привилегии",
                        "link": null,
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "22f1ea76-3c14-45f4-b7d2-0224fec746c3",
                        "children": []
                    },
                ]
            },
            {
                "id": "70f1ea76-3c80-45f4-b7d3-1114fec746c3",
                "name": "Агентские настройки",
                "link": null,
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                "children": [
                    {
                        "id": "70f1ea76-3c80-45f1-b7d2-1114fec746c3",
                        "name": "Агенты",
                        "link": null,
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                        "children": []
                    },
                    {
                        "id": "70f1ea76-3c11-45f4-b7d2-1114fec746c3",
                        "name": "Счета",
                        "link": null,
                        "icon": null,
                        "isEnabled": true,
                        "iconPosition": "left",
                        "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                        "children": []
                    },
                ]
            },
            {
                "id": "70f1ea76-3c80-45f4-b7d2-2222fec746c3",
                "name": "Клиентские настройки",
                "link": null,
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "ba730078-c1ae-42b7-9a24-616c77f3b2ab",
                "children": []
            },
        ],
    },
    {
        "id": "cb33018a-60ba-4f8f-bac3-dccb6770db3a",
        "name": "Маркетинг",
        "link": null,
        "icon": null,
        "isEnabled": true,
        "iconPosition": "left",
        "parentId": null,
        "children": [
            {
                "id": "928dc56d-3b56-4100-b69c-2591c7b8a74b",
                "name": "Акции",
                "link": "/marketing/promotions",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "cb33018a-60ba-4f8f-bac3-dccb6770db3a",
                "children": []
            },
            {
                "id": "5045edc7-af95-4253-b55f-942bf320af6a",
                "name": "Баннеры",
                "link": "/marketing/banners",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "cb33018a-60ba-4f8f-bac3-dccb6770db3a",
                "children": []
            },
            {
                "id": "5045edc7-af95-4253-b55f-942bf320af2a",
                "name": "Новости",
                "link": "/marketing/news",
                "icon": null,
                "isEnabled": true,
                "iconPosition": "left",
                "parentId": "cb33018a-60ba-4f8f-bac3-dccb6770db3a",
                "children": []
            },
        ]
    }
]