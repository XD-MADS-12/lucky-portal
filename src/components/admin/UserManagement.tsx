
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Search, RefreshCw, Edit, UserCog } from 'lucide-react';

type Profile = {
  id: string;
  username: string;
  balance: number;
  created_at: string;
  total_deposit: number;
  total_withdrawal: number;
};

const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setUsers(data as Profile[]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (user: Profile) => {
    setEditingUser(user);
    setEditBalance(user.balance.toString());
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditBalance('');
  };

  const saveUserBalance = async () => {
    if (!editingUser) return;
    
    try {
      const newBalance = parseFloat(editBalance);
      
      if (isNaN(newBalance)) {
        toast({
          title: 'Invalid amount',
          description: 'Please enter a valid number',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', editingUser.id);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, balance: newBalance } 
          : user
      ));

      toast({
        title: 'Success',
        description: `Updated balance for ${editingUser.username}`,
      });
      
      cancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          User Management
        </h2>
        <Button 
          variant="outline" 
          className="bg-casino-muted/10 border-casino-muted/20 hover:bg-casino-muted/20"
          onClick={fetchUsers}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search users by username or ID..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 bg-casino-muted/10 border-casino-muted/20 text-white"
        />
      </div>

      <div className="rounded-md overflow-hidden border border-casino-muted/20">
        <Table>
          <TableCaption>List of registered users</TableCaption>
          <TableHeader className="bg-casino-muted/20">
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Total Deposits</TableHead>
              <TableHead>Total Withdrawals</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">Loading users...</TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username || 'N/A'}</TableCell>
                  <TableCell className="text-sm text-gray-400">{user.id}</TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editBalance}
                          onChange={(e) => setEditBalance(e.target.value)}
                          className="w-24 bg-casino-muted/10 border-casino-accent/50"
                        />
                        <Button 
                          size="sm" 
                          onClick={saveUserBalance}
                          className="bg-casino-accent hover:bg-casino-accent/80"
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={cancelEdit}
                          className="border-casino-muted/20"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <span>${user.balance.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>${user.total_deposit.toFixed(2)}</TableCell>
                  <TableCell>${user.total_withdrawal.toFixed(2)}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {editingUser?.id !== user.id && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => startEdit(user)}
                        className="hover:bg-casino-muted/20"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
