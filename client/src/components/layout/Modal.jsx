import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as ethers from "ethers";
import { AlertCircle, Share, UserPlus, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Modal = ({ setModalOpen, modalOpen, contract }) => {
  const [addressToShare, setAddressToShare] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAccessList = async () => {
      if (!contract) return;
      try {
        setLoading(true);
        const addressList = await contract.shareAccess();
        setAddresses(addressList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching access list:", error);
      }
    };

    if (modalOpen && contract) {
      fetchAccessList();
    }
  }, [contract, modalOpen]);

  const handleShare = async () => {
    if (!contract || !addressToShare) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!addressToShare.startsWith("0x") || addressToShare.length !== 42) {
        setError("Invalid Ethereum address format");
        setLoading(false);
        return;
      }

      await contract.allow(addressToShare);
      setSuccess(
        `Access granted to ${addressToShare.substring(
          0,
          6
        )}...${addressToShare.substring(addressToShare.length - 4)}`
      );

      const addressList = await contract.shareAccess();
      setAddresses(addressList);
      setAddressToShare("");
    } catch (error) {
      console.error("Error sharing access:", error);
      setError(error.message || "Failed to grant access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" /> Share Access
          </DialogTitle>
          <DialogDescription>
            Grant access to your files for specific Ethereum addresses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="address">Grant Access To</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="address"
                placeholder="0x..."
                value={addressToShare}
                onChange={(e) => setAddressToShare(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleShare}
                disabled={!addressToShare || loading}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-primary/20 text-primary border-primary/50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" /> People With Access
            </Label>

            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading addresses...
              </div>
            ) : addresses.length > 0 ? (
              <Select
                value={selectedAddress}
                onValueChange={setSelectedAddress}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((item, index) => {
                    const address = String(item); // ensure it’s a string
                    return (
                      <SelectItem key={index} value={address}>
                        {address.substring(0, 6)}...
                        {address.substring(address.length - 4)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-4 text-center border rounded-md border-dashed text-sm text-muted-foreground">
                No addresses with access yet
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
