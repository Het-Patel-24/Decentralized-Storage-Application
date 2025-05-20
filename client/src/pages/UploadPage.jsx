import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle } from "lucide-react";
import * as ethers from "ethers";

// Removed TypeScript interface for props because JS does not support interfaces
// Props will be accepted as a destructured object directly

const UploadPage = ({ account, contract, provider, setModalOpen }) => {
  // Removed all explicit type annotations like `File | null`, `string | null`, etc.
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [preview, setPreview] = useState(null);

  // Removed explicit React.FormEvent typing from event parameter
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Please select a file first");
      return;
    }
    try {
      setUploading(true);
      setUploadError("");
      setUploadSuccess("");
      const formData = new FormData();
      formData.append("file", file);

      // Pinata API keys should not be hardcoded in production, but kept same here for demonstration
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        body: formData,
        headers: {
          pinata_api_key: `3107ce2e1c4bb63f4cb8`,
          pinata_secret_api_key: `31121a4eea56e83c292ff74145f12bab281550491b2e71be4add73ff6d99cfe0`,
          
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to upload to Pinata: ${response.statusText}`);
      }
      const resFile = await response.json();
      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.IpfsHash}`;
      if (contract) {
        await contract.add(account, ImgHash);
        setUploadSuccess("File uploaded successfully to IPFS and blockchain!");
      } else {
        setUploadError("Contract is not initialized");
      }
      setFileName("No file selected");
      setFile(null);
      setPreview(null);
    } catch (error) {
      // Removed explicit type `any` for error, just use normal catch block in JS
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Removed explicit typing from event parameter
  const retrieveFile = (e) => {
    const target = e.target;
    const data = target.files?.[0];
    if (!data) return;
    setUploadError("");
    setUploadSuccess("");
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
    if (data.type.includes("image/")) {
      const imageReader = new window.FileReader();
      imageReader.readAsDataURL(data);
      imageReader.onload = () => {
        setPreview(imageReader.result);
      };
    } else {
      setPreview(null);
    }
    setFileName(data.name);
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-[3px]">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">Upload Files to IPFS</h1>
          <p className="text-secondary-foreground">
            Securely upload and store your files on the decentralized web
          </p>
        </div>

        <Card className="border-border/60 bg-card/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-accent/10 rounded-t-lg">
            <CardTitle className="text-primary">Upload a New File</CardTitle>
            <CardDescription className="text-secondary-foreground">
              Files are stored on IPFS and references are saved on the blockchain
            </CardDescription>
          </CardHeader>

          <CardContent className="py-0">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-secondary-foreground">
                  Choose File
                </Label>

                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
                    bg-accent/10 hover:bg-accent/20 border-primary/30 hover:border-primary/60 
                    transition-colors group"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                      <Upload className="w-8 h-8 mb-3 text-primary group-hover:text-primary/80 transition-colors" />
                      <p className="mb-2 text-sm text-secondary-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">Any file type (MAX 100MB)</p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={retrieveFile}
                      disabled={!account || uploading}
                    />
                  </label>
                </div>
              </div>

              {preview && (
                <div className="flex justify-center">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                    <img src={preview} alt="File preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between bg-muted/50 rounded-md p-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-background rounded-md">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="truncate max-w-xs">
                    <p className="text-sm font-medium truncate">{fileName}</p>
                    {file && <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
                  </div>
                </div>
              </div>

              {uploadError && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertTitle className="text-destructive">Error</AlertTitle>
                  <AlertDescription className="text-destructive-foreground">{uploadError}</AlertDescription>
                </Alert>
              )}

              {uploadSuccess && (
                <Alert className="bg-primary/10 border-primary/30 text-primary">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Success</AlertTitle>
                  <AlertDescription className="text-primary-foreground">{uploadSuccess}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between bg-accent/5 rounded-b-lg py-[11px] px-[5px]">
            <Button type="button" variant="outline" onClick={() => setModalOpen(true)} disabled={!contract} className="w-full sm:w-auto hover:bg-secondary/10">
              Manage Access
            </Button>

            <Button onClick={handleSubmit} disabled={!file || !account || uploading} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
