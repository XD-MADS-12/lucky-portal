
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from './types';
import { toast } from '@/components/ui/use-toast';

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, profiles:user_id(username)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast({
      title: 'Error',
      description: 'Failed to load transactions',
      variant: 'destructive',
    });
    return [];
  }
};

export const updateTransactionStatus = async (transactionId: string, newStatus: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', transactionId);

    if (error) {
      throw error;
    }

    // Get the transaction to check if we need to update user balance
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
    
    if (txError) throw txError;

    // Update user balance if we're approving a deposit or withdrawal
    if (newStatus === 'completed' && 
       (transaction.type === 'deposit' || transaction.type === 'withdrawal')) {
      
      // Get current user balance
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('balance, total_deposit, total_withdrawal')
        .eq('id', transaction.user_id)
        .single();
      
      if (userError) throw userError;
      
      const newBalance = transaction.type === 'deposit' 
        ? userData.balance + transaction.amount
        : userData.balance - transaction.amount;
      
      // Update balance based on transaction type
      if (transaction.type === 'deposit') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            balance: newBalance,
            total_deposit: userData.total_deposit + transaction.amount
          })
          .eq('id', transaction.user_id);
        
        if (updateError) throw updateError;
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            balance: newBalance,
            total_withdrawal: userData.total_withdrawal + transaction.amount
          })
          .eq('id', transaction.user_id);
        
        if (updateError) throw updateError;
      }
    }

    toast({
      title: 'Success',
      description: `Transaction status updated to ${newStatus}`,
    });
    
    return true;
  } catch (error) {
    console.error('Error updating transaction:', error);
    toast({
      title: 'Error',
      description: 'Failed to update transaction status',
      variant: 'destructive',
    });
    return false;
  }
};

export const filterTransactions = (
  transactions: Transaction[], 
  searchTerm: string, 
  statusFilter: string, 
  typeFilter: string
): Transaction[] => {
  return transactions.filter(transaction => {
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
};
