import { useState } from 'react';
import * as ethers from 'ethers';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import FilesPage from "./pages/FilesPage";
import Navbar from "./components/layout/Navbar";
import Modal from "./components/layout/Modal";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Upload from './artifacts/contracts/Upload.sol/Upload.json';

// Import your contract ABI - adjust the path as needed
// const Upload = { abi: [] }; // Replace with your actual Upload.json import

const queryClient = new QueryClient();

const App = () => {
  const [account, setAccount] = useState('');
  
  // Removed TypeScript type annotations (like ": any | null")
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Removed "as any" cast - just use ethers.BrowserProvider directly
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        
        const signer = await provider.getSigner();
        const address = accounts[0];
        
        setAccount(address);
        setWalletConnected(true);
        
        // Connect to the contract - replace with your contract address
        const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
        // Removed "as any" cast
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        
        setContract(contract);
        setProvider(signer);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: error.message || "Failed to connect wallet",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "MetaMask Required",
        description: "Please install MetaMask to use this application",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setContract(null);
    setProvider(null);
    setWalletConnected(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          {walletConnected && (
            <Navbar 
              account={account} 
              onDisconnect={disconnectWallet}
              walletConnected={walletConnected}
            />
          )}
          
          <main className="flex-1">
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    account={account} 
                    onConnect={connectWallet}
                    walletConnected={walletConnected}
                  />
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute account={account}>
                    <UploadPage 
                      account={account}
                      contract={contract}
                      provider={provider}
                      setModalOpen={setModalOpen}
                    />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/files" 
                element={
                  <ProtectedRoute account={account}>
                    <FilesPage 
                      account={account}
                      contract={contract}
                    />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Modal 
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
            contract={contract}
          />
          
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
