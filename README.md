
# Decentralized Storage Application

A decentralized file storage platform built with Ethereum smart contracts and a React frontend. This application enables users to securely upload, store, and retrieve files on a blockchain network, ensuring data integrity and decentralization.

## 🧩 Project Structure

```
Decentralized-Storage-Application/
├── client/                 # React frontend application
├── contracts/              # Solidity smart contracts
├── scripts/                # Deployment scripts for smart contracts
├── ignition/               # Hardhat Ignition modules (optional)
├── hardhat.config.js       # Hardhat configuration file
├── package.json            # Project metadata and dependencies
└── README.md               # Project documentation
```

### 🔹 Key Components

- **client/**: Contains the React application that interacts with the deployed smart contracts, providing a user-friendly interface for file operations.

- **contracts/**: Houses the Solidity smart contracts that define the logic for file storage and retrieval on the Ethereum blockchain.

- **scripts/**: Includes scripts to deploy the smart contracts to a local or test Ethereum network using Hardhat.

- **ignition/**: (Optional) Contains Hardhat Ignition modules for advanced deployment scenarios.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Hardhat](https://hardhat.org/) (for Ethereum development)
- [MetaMask](https://metamask.io/) browser extension (for interacting with the blockchain)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Het-Patel-24/Decentralized-Storage-Application.git
   cd Decentralized-Storage-Application
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

### MetaMask Configuration

To interact with the local Ethereum network:

1. **Install MetaMask**: Add the MetaMask extension to your browser from the [official website](https://metamask.io/).

2. **Add a Custom Network**:

   - **Network Name**: `Localhost 8545`
   - **New RPC URL**: `http://localhost:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH` (optional)
   - **Block Explorer URL**: Leave blank

3. **Import an Account**:

   - After starting the Hardhat node (see below), you'll see a list of generated accounts with their private keys.
   - In MetaMask, select "Import Account" and paste one of the private keys to access the corresponding account.

### Running the Application

1. **Start the Hardhat local node**:

   In the project root directory:

   ```bash
   npx hardhat node
   ```

2. **Deploy the smart contracts**:

   Open a new terminal window in the project root directory:

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Start the React frontend**:

   In a new terminal window:

   ```bash
   cd client
   npm run dev
   ```

   The application will be available at `http://localhost:8080`.

## 🛠️ Technologies Used

- **Frontend**: React.js
- **Blockchain Development**: Hardhat, Solidity
- **Wallet Integration**: MetaMask

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.
