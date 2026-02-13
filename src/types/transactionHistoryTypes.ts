export interface TransactionHistoryType {
    transactionId: string;
    userId: string;
    senderShortName: string;
    receiverShortName: string;
    senderAccountNumber: string | null;
    receiverAccountNumber: string | null;
    senderAccountCurrency: string | null;
    receiverAccountCurrency: string | null;
    senderCardNumber: string | null;
    receiverCardNumber: string | null;
    senderCardCurrency: string | null;
    receiverCardCurrency: string | null;
    paymentType: string;
    amount: number;
    fee: number;
    totalAmount: number;
    operationCurrency: string;
    feeCurrency: string;
    direction: "INCOMING" | "OUTGOING";
    status: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
}