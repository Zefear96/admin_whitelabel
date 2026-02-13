export interface TransactionBankReportType {
    paymentId:       string;
    transactionType: string;
    amount:          number;
    currency:        string;
    date:            string;
    receiverAccount: string;
    status:          string;
}