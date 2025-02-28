
interface TransactionTypeBadgeProps {
  type: string;
}

const TransactionTypeBadge = ({ type }: TransactionTypeBadgeProps) => {
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

export default TransactionTypeBadge;
