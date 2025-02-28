
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { randomUUID } from '@/lib/utils';

const DepositForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !paymentMethod || !phoneNumber || !transactionId) {
      toast({
        title: 'Missing fields',
        description: 'Please fill out all fields',
        variant: 'destructive',
      });
      return;
    }
    
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid deposit amount',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create a deposit transaction
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          amount: depositAmount,
          type: 'deposit',
          status: 'pending',
          metadata: {
            method: paymentMethod,
            phone_number: phoneNumber,
            transaction_id: transactionId,
            provider: paymentMethod,
          }
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Deposit request submitted',
        description: 'Your deposit request is being processed. Once approved, the funds will be added to your account.',
      });
      
      // Reset form
      setAmount('');
      setPhoneNumber('');
      setTransactionId('');
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting deposit:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit deposit request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Deposit Amount</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          step="0.01"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-casino-muted/10 border-casino-muted/20 text-white"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select 
          value={paymentMethod} 
          onValueChange={setPaymentMethod}
          required
        >
          <SelectTrigger id="payment-method" className="bg-casino-muted/10 border-casino-muted/20 text-white">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bKash">bKash</SelectItem>
            <SelectItem value="Nagad">Nagad</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {paymentMethod && (
        <>
          <div className="rounded-md bg-casino-primary/10 border border-casino-primary/30 p-4">
            <h3 className="font-medium mb-2">Deposit Instructions:</h3>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>Send the exact amount to: <span className="font-bold">01324062666</span></li>
              <li>Use the "<strong>Send Money</strong>" option in your {paymentMethod} app</li>
              <li>After sending, copy the Transaction ID from your {paymentMethod} app</li>
              <li>Enter the Transaction ID below</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone-number">Your {paymentMethod} Number</Label>
            <Input
              id="phone-number"
              type="text"
              placeholder="e.g., 017XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-casino-muted/10 border-casino-muted/20 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transaction-id">Transaction ID</Label>
            <Input
              id="transaction-id"
              type="text"
              placeholder="Enter transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="bg-casino-muted/10 border-casino-muted/20 text-white"
              required
            />
          </div>
        </>
      )}
      
      <Button
        type="submit"
        className="w-full bg-casino-primary hover:bg-casino-primary/80"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Submit Deposit Request'}
      </Button>
    </form>
  );
};

export default DepositForm;
