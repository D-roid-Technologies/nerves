// Transaction entry
interface WalletTransaction {
    transactionId: string;
    type: "credit" | "debit";
    amount: number;
    method: "card" | "bank_transfer" | "wallet" | "refund";
    status: "pending" | "successful" | "failed";
    createdAt: string; // or Date
}

// Wallet structure
export interface Wallet {
    balance: number;
    currency: "NGN" | "USD" | "EUR"; // extendable
    transactions: WalletTransaction[];
}
