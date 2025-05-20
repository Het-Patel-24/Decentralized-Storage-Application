// Removed type annotations from props
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Folder, Upload, Database, Shield, Share, Wallet } from "lucide-react";

// Removed TypeScript interface definition
// interface HomePageProps {
//   account: string;
//   onConnect: () => void;
//   walletConnected: boolean;
// }

const HomePage = ({ account, onConnect, walletConnected }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center space-y-8">

        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Decentralized Storage
          </h1>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            Securely store and share your files using blockchain technology.
            Own your data with a decentralized file system powered by IPFS.
          </p>
        </div>

        {/* Wallet Connection or File Options */}
        {!walletConnected ? (
          // Wallet not connected section
          <div className="max-w-md w-full">
            <div className="border border-primary/50 rounded-lg p-6 bg-primary/10">
              <div className="flex items-center space-x-3 mb-4">
                <Wallet className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Connect Wallet</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Please connect your wallet to access decentralized storage features.
              </p>
              <Button className="w-full" onClick={onConnect}>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          </div>
        ) : (
          // Wallet connected: show options
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
            <Link to="/upload" className="w-full">
              <div className="border border-muted rounded-lg p-6 bg-card hover:bg-card/80 transition-colors h-full flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Upload Files</h2>
                <p className="text-muted-foreground">Upload and store your files securely on IPFS</p>
              </div>
            </Link>

            <Link to="/files" className="w-full">
              <div className="border border-muted rounded-lg p-6 bg-card hover:bg-card/80 transition-colors h-full flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Folder className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-semibold">My Files</h2>
                <p className="text-muted-foreground">Access and manage your uploaded files</p>
              </div>
            </Link>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
          <div className="border border-border rounded-lg p-4 bg-card/50">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Security</h3>
            <p className="text-sm text-muted-foreground">
              Your files are encrypted and stored across a distributed network
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 bg-card/50">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Decentralized</h3>
            <p className="text-sm text-muted-foreground">
              No central authority has control over your personal data
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 bg-card/50">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Share className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Sharable</h3>
            <p className="text-sm text-muted-foreground">
              Easily share access to your files with specific addresses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
