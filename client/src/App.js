import { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { BrowserProvider } from 'ethers';
import Upload from './artifacts/contracts/Upload.sol/Upload.json'
import Display from './components/Display.js';
import FileUpload from './components/FileUpload.js';
import Modal from './components/Modal.js';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen]  = useState(false);

  useEffect(() =>{
    const provider = new BrowserProvider(window.ethereum);
    const wallet = async () => {

      if(provider){
        await provider.send("eth_requestAccounts", []);

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        })

        const signer = await provider.getSigner();
        const address = signer.address;
        console.log(address);
        setAccount(address);

        const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(signer);

      } else
          alert("Metamask is Not Installed");
    }
    provider && wallet()
  }, [])

  return (
    <>
    {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
    <div className="App">
        <h1 style={{ color: 'white' }}>Decentralized Storage App</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: 'white' }}>
          Account : {account}
        </p>
        <FileUpload account={account} contract={contract} provider={provider}></FileUpload>
        <Display account={account} contract={contract}></Display>
    </div>
  </> 
  );
}

export default App;
