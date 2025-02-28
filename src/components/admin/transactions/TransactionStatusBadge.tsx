
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface TransactionStatusBadgeProps {
  status: string;
}

const TransactionStatusBadge = ({ status }: TransactionStatusBadgeProps) => {
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

export default TransactionStatusBadge;
