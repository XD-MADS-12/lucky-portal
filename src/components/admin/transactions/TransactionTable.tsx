
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import TransactionRow from "./TransactionRow";
import { Transaction } from "./types";

interface TransactionTableProps {
  loading: boolean;
  transactions: Transaction[];
  updateTransactionStatus: (transactionId: string, newStatus: string) => Promise<void>;
}

const TransactionTable = ({ loading, transactions, updateTransactionStatus }: TransactionTableProps) => {
  return (
    <div className="rounded-md overflow-hidden border border-casino-muted/20">
      <Table>
        <TableCaption>Transaction history</TableCaption>
        <TableHeader className="bg-casino-muted/20">
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">Loading transactions...</TableCell>
            </TableRow>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionRow 
                key={transaction.id}
                transaction={transaction} 
                updateTransactionStatus={updateTransactionStatus}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">No transactions found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
