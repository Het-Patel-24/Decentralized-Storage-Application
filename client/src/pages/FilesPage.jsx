import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Folder, Search, AlertCircle, ExternalLink } from "lucide-react";
import * as ethers from "ethers";

// Removed Typescript interface and used comments instead
// Props: account: string, contract: object | null
const FilesPage = ({ account, contract }) => {
  const [data, setData] = useState([]); // Removed JSX.Element[] type
  const [otherAddress, setOtherAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  let dataArray;
  const myFiles = async (e) => {
    setLoading(true);
    dataArray = await contract.display(account);
    fetchFiles(dataArray);
    setLoading(false);
  }
  const fetchFiles = async (dataArray = "") => {
    if (!contract) {
      setError("Smart contract not initialized");
      return;
    }

    setLoading(true);
    setError("");

    try {
    //   const targetAddress = address || account;
    //   const dataArray = await contract.display(targetAddress);

      if (!dataArray || dataArray.length === 0) {
        setData([]);
        setError("No files found");
        return;
      }

      const fileElements = dataArray.map((item, i) => (
        <div key={i} className="group relative overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary">
          <div className="aspect-square overflow-hidden">
            {item.includes('.jpg') || item.includes('.jpeg') || item.includes('.png') || item.includes('.gif') ? (
              <img
                src={item}
                alt={`File ${i}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Folder className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="p-3 flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate">File {i + 1}</p>
              <a 
                href={item} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground truncate">{item.split("/").pop()}</p>
          </div>
        </div>
      ));

      setData(fileElements);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to load files. You may not have access to this address.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      myFiles();
    }
  }, [contract, account]);

  const handleAddressSearch = async(e) => {
    // Removed React.FormEvent and used plain event
    e.preventDefault();
    setHasSearched(false);
    try{
        if (otherAddress.trim()) {
          setLoading(true);
          dataArray = await contract.display(otherAddress);
          await fetchFiles(dataArray);
          setHasSearched(true);
        }
    } catch(error){
        console.error("Files Loading Error:",error);
        setError("You Don't have access to this addess");
        setHasSearched(false);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Your Files</h1>
          <p className="text-muted-foreground">Manage and view your stored files</p>
        </div>

        <Tabs defaultValue="my-files" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="my-files" onClick={() => myFiles()}>My Files</TabsTrigger>
            <TabsTrigger value="shared">Access Shared Files</TabsTrigger>
          </TabsList>

          <TabsContent value="my-files">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <Folder className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading files...</p>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Info</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {data.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data}
                  </div>
                ) : !error && (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <div className="flex flex-col items-center space-y-2">
                      <Folder className="h-8 w-8 text-muted-foreground" />
                      <h3 className="font-medium">No files found</h3>
                      <p className="text-sm text-muted-foreground">Upload some files to see them here</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="shared">
            <Card>
              <CardHeader>
                <CardTitle>Access Shared Files</CardTitle>
                <CardDescription>
                  Enter an address to view files shared with you
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleAddressSearch} className="flex flex-col space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Ethereum Address</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="address"
                        placeholder="0x..."
                        value={otherAddress}
                        onChange={(e) => setOtherAddress(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!otherAddress.trim() || loading}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>

              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  You can only access files if the address owner has given you permission
                </p>
              </CardFooter>
            </Card>

            {loading && otherAddress && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <Folder className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading files...</p>
                </div>
              </div>
            )}

            {hasSearched && !loading && data.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">
                  Files from {otherAddress.substring(0, 6)}...{otherAddress.substring(otherAddress.length - 4)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FilesPage;
