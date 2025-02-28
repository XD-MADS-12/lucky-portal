
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BanknoteIcon, Phone, QrCode } from "lucide-react";

const PaymentSettings = () => {
  const { toast } = useToast();
  const [bkashNumber, setBkashNumber] = useState('01324062666');
  const [nagadNumber, setNagadNumber] = useState('01324062666');
  const [editingBkash, setEditingBkash] = useState(false);
  const [editingNagad, setEditingNagad] = useState(false);
  const [tempBkashNumber, setTempBkashNumber] = useState(bkashNumber);
  const [tempNagadNumber, setTempNagadNumber] = useState(nagadNumber);

  const handleSaveBkash = () => {
    // Validate the number
    if (!/^01\d{9}$/.test(tempBkashNumber)) {
      toast({
        title: "Invalid number format",
        description: "Please enter a valid Bangladeshi phone number (01XXXXXXXXX)",
        variant: "destructive"
      });
      return;
    }
    
    setBkashNumber(tempBkashNumber);
    setEditingBkash(false);
    
    toast({
      title: "Success",
      description: "bKash number updated successfully",
    });
  };

  const handleSaveNagad = () => {
    // Validate the number
    if (!/^01\d{9}$/.test(tempNagadNumber)) {
      toast({
        title: "Invalid number format",
        description: "Please enter a valid Bangladeshi phone number (01XXXXXXXXX)",
        variant: "destructive"
      });
      return;
    }
    
    setNagadNumber(tempNagadNumber);
    setEditingNagad(false);
    
    toast({
      title: "Success",
      description: "Nagad number updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BanknoteIcon className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Payment Settings</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* bKash Settings */}
        <Card className="bg-casino-secondary/30 border-casino-muted/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center">
                <span className="text-white font-bold">b</span>
              </div>
              bKash Settings
            </CardTitle>
            <CardDescription>Configure payment information for bKash</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bkash-number">bKash Number</Label>
                {editingBkash ? (
                  <div className="flex gap-2">
                    <Input
                      id="bkash-number"
                      value={tempBkashNumber}
                      onChange={(e) => setTempBkashNumber(e.target.value)}
                      className="bg-casino-muted/10 border-casino-muted/20 text-white"
                    />
                    <Button 
                      onClick={handleSaveBkash}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEditingBkash(false);
                        setTempBkashNumber(bkashNumber);
                      }}
                      className="border-casino-muted/20"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 p-2 bg-casino-muted/10 rounded-md">
                      <Phone className="text-pink-500 h-5 w-5" />
                      <span>{bkashNumber}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingBkash(true);
                        setTempBkashNumber(bkashNumber);
                      }}
                      className="bg-casino-muted/10 border-casino-muted/20 hover:bg-casino-muted/20"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="border-t border-casino-muted/20 pt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <QrCode className="h-4 w-4" />
                  QR Code (Coming soon)
                </h4>
                <div className="bg-casino-muted/10 border border-casino-muted/20 rounded-md p-6 flex items-center justify-center">
                  <div className="text-center text-sm text-gray-400">
                    QR code generation will be available soon
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Nagad Settings */}
        <Card className="bg-casino-secondary/30 border-casino-muted/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              Nagad Settings
            </CardTitle>
            <CardDescription>Configure payment information for Nagad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nagad-number">Nagad Number</Label>
                {editingNagad ? (
                  <div className="flex gap-2">
                    <Input
                      id="nagad-number"
                      value={tempNagadNumber}
                      onChange={(e) => setTempNagadNumber(e.target.value)}
                      className="bg-casino-muted/10 border-casino-muted/20 text-white"
                    />
                    <Button 
                      onClick={handleSaveNagad}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEditingNagad(false);
                        setTempNagadNumber(nagadNumber);
                      }}
                      className="border-casino-muted/20"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 p-2 bg-casino-muted/10 rounded-md">
                      <Phone className="text-orange-500 h-5 w-5" />
                      <span>{nagadNumber}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingNagad(true);
                        setTempNagadNumber(nagadNumber);
                      }}
                      className="bg-casino-muted/10 border-casino-muted/20 hover:bg-casino-muted/20"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="border-t border-casino-muted/20 pt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <QrCode className="h-4 w-4" />
                  QR Code (Coming soon)
                </h4>
                <div className="bg-casino-muted/10 border border-casino-muted/20 rounded-md p-6 flex items-center justify-center">
                  <div className="text-center text-sm text-gray-400">
                    QR code generation will be available soon
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSettings;
