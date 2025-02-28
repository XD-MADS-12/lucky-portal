
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import TransactionManagement from "@/components/admin/transactions";
import PaymentSettings from "@/components/admin/PaymentSettings";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");
  
  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 w-full justify-start">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionManagement />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
