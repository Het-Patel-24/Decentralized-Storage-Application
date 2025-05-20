import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Folder, Upload, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = ({ account, onDisconnect, walletConnected }) => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Folder className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">D-Storage</span>
          </Link>

          {walletConnected && (
            <div className="flex items-center space-x-1">
              <Link
                to="/"
                className={cn(
                  "flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === "/"
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-muted hover:text-primary"
                )}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>

              <Link
                to="/upload"
                className={cn(
                  "flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === "/upload"
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-muted hover:text-primary"
                )}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Link>

              <Link
                to="/files"
                className={cn(
                  "flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === "/files"
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-muted hover:text-primary"
                )}
              >
                <Folder className="mr-2 h-4 w-4" />
                Files
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {account && (
            <>
              <div className="hidden md:block">
                <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                  <span className="text-muted-foreground mr-1">Account:</span>
                  <span className="font-mono truncate max-w-[140px]">{account}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
