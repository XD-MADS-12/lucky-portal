
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import TransactionStatusBadge from "./TransactionStatusBadge";
import TransactionTypeBadge from "./TransactionTypeBadge";
import { Transaction } from "./types";

interface TransactionRowProps {
  transaction: Transaction;
  updateTransactionStatus: (transactionId: string, newStatus: string) => Promise<void>;
}

const TransactionRow = ({ transaction, updateTransactionStatus }: TransactionRowProps) => {
  return (
    <TableRow key={transaction.id}>
      <TableCell><TransactionTypeBadge type={transaction.type} /></TableCell>
      <TableCell className="font-medium">
        ${transaction.amount.toFixed(2)}
      </TableCell>
      <TableCell>{transaction.profiles?.username || 'Unknown'}</TableCell>
      <TableCell><TransactionStatusBadge status={transaction.status} /></TableCell>
      <TableCell>
        {transaction.metadata?.method && (
          <div>
            <div>{transaction.metadata.method}</div>
            {transaction.metadata.phone_number && (
              <div className="text-xs text-gray-400">Phone: {transaction.metadata.phone_number}</div>
            )}
            {transaction.metadata.transaction_id && (
              <div className="text-xs text-gray-400">ID: {transaction.metadata.transaction_id}</div>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
      <TableCell>
        {transaction.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => updateTransactionStatus(transaction.id, 'completed')}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateTransactionStatus(transaction.id, 'rejected')}
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              Reject
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
