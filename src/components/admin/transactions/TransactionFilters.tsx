
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from 'lucide-react';

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
}

const TransactionFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter
}: TransactionFiltersProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-4">
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
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button 
              size="sm" 
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              className={statusFilter === 'pending' ? 'bg-yellow-600' : 'bg-casino-muted/10 border-casino-muted/20'}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              size="sm" 
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              className={statusFilter === 'completed' ? 'bg-green-600' : 'bg-casino-muted/10 border-casino-muted/20'}
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
            <Button 
              size="sm" 
              variant={statusFilter === 'rejected' ? 'default' : 'outline'}
              className={statusFilter === 'rejected' ? 'bg-red-600' : 'bg-casino-muted/10 border-casino-muted/20'}
              onClick={() => setStatusFilter('rejected')}
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
          onClick={() => setTypeFilter('all')}
        >
          All Types
        </Button>
        <Button 
          size="sm" 
          variant={typeFilter === 'deposit' ? 'default' : 'outline'}
          className={typeFilter === 'deposit' ? 'bg-blue-600' : 'bg-casino-muted/10 border-casino-muted/20'}
          onClick={() => setTypeFilter('deposit')}
        >
          Deposits
        </Button>
        <Button 
          size="sm" 
          variant={typeFilter === 'withdrawal' ? 'default' : 'outline'}
          className={typeFilter === 'withdrawal' ? 'bg-purple-600' : 'bg-casino-muted/10 border-casino-muted/20'}
          onClick={() => setTypeFilter('withdrawal')}
        >
          Withdrawals
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
