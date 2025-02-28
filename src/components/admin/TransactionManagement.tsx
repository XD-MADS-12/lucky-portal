
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, RefreshCw, CheckCircle, XCircle, AlertCircle,
  CreditCard, Clock, Filter
} from 'lucide-react';

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'game_win' | 'game_loss';
  status: string;
  created_at: string;
  updated_at: string;
  metadata: {
    method?: string;
    phone_number?: string;
    transaction_id?: string;
    provider?: string;
    notes?: string;
  };
  profiles?: {
    username: string;
  };
};

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, profiles:user_id(username)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setTransactions(data as Transaction[]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
  };

  const updateTransactionStatus = async (transactionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', transactionId);

      if (error) {
        throw error;
      }

      // Update user balance if we're approving a deposit or withdrawal
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction && newStatus === 'completed' && 
         (transaction.type === 'deposit' || transaction.type === 'withdrawal')) {
        
        // Get current user balance
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', transaction.user_id)
          .single();
        
        if (userError) throw userError;
        
        const newBalance = transaction.type === 'deposit' 
          ? userData.balance + transaction.amount
          : userData.balance - transaction.amount;
        
        // Update balance
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            balance: newBalance,
            ...(transaction.type === 'deposit' 
              ? { total_deposit: supabase.rpc('increment', { x: transaction.amount }) } 
              : { total_withdrawal: supabase.rpc('increment', { x: transaction.amount }) })
          })
          .eq('id', transaction.user_id);
        
        if (updateError) throw updateError;
      }

      // Update local state
      setTransactions(transactions.map(t => 
        t.id === transactionId ? { ...t, status: newStatus } : t
      ));

      toast({
        title: 'Success',
        description: `Transaction status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transaction status',
        variant: 'destructive',
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Filter by search term (transaction ID, username, or transaction metadata)
    const searchMatch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.metadata?.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.metadata?.phone_number?.includes(searchTerm);
    
    // Filter by status
    const statusMatch = statusFilter === 'all' || transaction.status === statusFilter;
    
    // Filter by type
    const typeMatch = typeFilter === 'all' || transaction.type === typeFilter;
    
    return searchMatch && statusMatch && typeMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <span className="inline-flex items-center bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
            Deposit
          </span>
        );
      case 'withdrawal':
        return (
          <span className="inline-flex items-center bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
            Withdrawal
          </span>
        );
      case 'game_win':
        return (
          <span className="inline-flex items-center bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
            Game Win
          </span>
        );
      case 'game_loss':
        return (
          <span className="inline-flex items-center bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
            Game Loss
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs">
            {type}
          </span>
        );
    }
  };

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
          onClick={fetchTransactions}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by ID, username, or transaction details..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 bg-casino-muted/10 border-casino-muted/20 text-white"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              className={statusFilter === 'all' ? 'bg-casino-primary' : 'bg-casino-muted/10 border-casino-muted/20'}
              onClick={() => handleStatusFilter('all')}
            >
              All
            </Button>
            <Button 
              size="sm" 
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              className={statusFilter === 'pending' ? 'bg-yellow-600' : 'bg-casino-muted/10 border-casino-muted/20'}
              onClick={() => handleStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              size="sm" 
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              className={statusFilter === 'completed' ? 'bg-green-600' : 'bg-casino-muted/10 border-casino-muted/20'}
              onClick={() => handleStatusFilter('completed')}
            >
              Completed
            </Button>
            <Button 
              size="sm" 
              variant={statusFilter === 'rejected' ? 'default' : 'outline'}
              className={statusFilter === 'rejected' ? 'bg-red-600' : 'bg-casino-muted/10 border-casino-muted/20'}
              onClick={() => handleStatusFilter('rejected')}
            >
              Rejected
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-2">
        <Button 
          size="sm" 
          variant={typeFilter === 'all' ? 'default' : 'outline'}
          className={typeFilter === 'all' ? 'bg-casino-primary' : 'bg-casino-muted/10 border-casino-muted/20'}
          onClick={() => handleTypeFilter('all')}
        >
          All Types
        </Button>
        <Button 
          size="sm" 
          variant={typeFilter === 'deposit' ? 'default' : 'outline'}
          className={typeFilter === 'deposit' ? 'bg-blue-600' : 'bg-casino-muted/10 border-casino-muted/20'}
          onClick={() => handleTypeFilter('deposit')}
        >
          Deposits
        </Button>
        <Button 
          size="sm" 
          variant={typeFilter === 'withdrawal' ? 'default' : 'outline'}
          className={typeFilter === 'withdrawal' ? 'bg-purple-600' : 'bg-casino-muted/10 border-casino-muted/20'}
          onClick={() => handleTypeFilter('withdrawal')}
        >
          Withdrawals
        </Button>
      </div>

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
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                  <TableCell className="font-medium">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.profiles?.username || 'Unknown'}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">No transactions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionManagement;
