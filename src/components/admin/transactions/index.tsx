
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, RefreshCw } from 'lucide-react';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import { Transaction } from './types';
import { fetchTransactions, updateTransactionStatus as updateStatus, filterTransactions } from './TransactionService';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    const data = await fetchTransactions();
    setTransactions(data);
    setLoading(false);
  };

  const updateTransactionStatus = async (transactionId: string, newStatus: string) => {
    const success = await updateStatus(transactionId, newStatus);
    
    if (success) {
      // Update local state
      setTransactions(transactions.map(t => 
        t.id === transactionId ? { ...t, status: newStatus } : t
      ));
    }
  };

  const filteredTransactions = filterTransactions(
    transactions,
    searchTerm,
    statusFilter,
    typeFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Transaction Management
        </h2>
        <Button 
          variant="outline" 
          className="bg-casino-muted/10 border-casino-muted/20 hover:bg-casino-muted/20"
          onClick={loadTransactions}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <TransactionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      <TransactionTable
        loading={loading}
        transactions={filteredTransactions}
        updateTransactionStatus={updateTransactionStatus}
      />
    </div>
  );
};

export default TransactionManagement;
