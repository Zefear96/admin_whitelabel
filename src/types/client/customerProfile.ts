export interface CustomerProfileType {
    id:                        string;
    absClientId:               string;
    mpcClientId:               null;
    keycloakClientId:          string;
    inn:                       string;
    firstName:                 string;
    lastName:                  string;
    birthDate:                 Date;
    phoneNumber:               string;
    email:                     string;
    confirmOfferAgreementDate: Date;
    deviceInfo:                string;
    currentStatus:             CurrentStatusCustomerType;
    createDate:                Date;
    updateDate:                Date;
    isCitizen:                 boolean;
}

export interface CurrentStatusCustomerType {
    status:    string;
    comment:   string;
    createdAt: Date;
    changedBy: string;
}
