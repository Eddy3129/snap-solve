# Petition Program - Getting Started Guide

Welcome to the Petition Program project! Follow the steps below to set up and run the project on your local machine. Ensure you have all the prerequisites installed for a smooth start.

## Prerequisites
- [Node.js](https://nodejs.org/) 
- [pnpm](https://pnpm.io/installation)
- [Anchor CLI](https://project-serum.github.io/anchor/getting-started/installation.html)
- [Rust](https://www.rust-lang.org/tools/install)

## Setup Instructions

### 1. Clone the Repository

First, clone the repository and navigate to its directory:

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Navigate to the Program Directory

Move into the `petition_program` directory where the smart contract code is located:

```bash
cd petition_program
```

### 3. Install Dependencies

You need to install the required dependencies at both the root level and within the `petition_program` directory:

#### 3.1 Install Root-Level Dependencies

Navigate to the root directory (if you're not already there) and run:

```bash
pnpm install
```

#### 3.2 Install Petition Program Dependencies

Next, navigate to the `petition_program` directory and install the dependencies specific to it:

```bash
cd petition_program
pnpm install
```

### 4. Deploy the Program

Deploy the program to obtain a program ID:

- **Localnet Deployment**:

  ```bash
  anchor deploy
  ```

- **Devnet Deployment** (useful for public testing):

  ```bash
  anchor deploy --provider.cluster devnet
  ```

Make sure your `solana` CLI is configured to the correct cluster (`localnet`, `devnet`, or `mainnet`). You can check the current configuration with:

```bash
solana config get
```

### 5. Modify the Program ID

After deploying, update the program ID to match your deployment:

1. Open the `Anchor.toml` file.
2. Modify the `program_id` field with the program ID obtained from the deployment.
3. Make sure that the updated program ID is also set in your Rust smart contract.

The `program_id` must be consistent between the `Anchor.toml` and your smart contract source code.

### 6. Build the Project

To compile the smart contract, run the following command:

```bash
anchor build
```

### 7. Set Up Environment Variables

Create a `.env` file based on the provided `.env.example` file:

```bash
cp .env.example .env
```

Update the values in `.env` as needed to match your configuration.

### 8. Run the Development Server

To start the frontend or server-side portion of the program:

```bash
pnpm dev
```

The development server should now be running, allowing you to interact with the application locally.

## Standard Operating Procedure (SOP) for Deployment

1. **Deploy the Program**: Use `anchor deploy` to deploy the program and obtain the program ID.
2. **Update Program ID**: Ensure that the `program_id` is updated in both `Anchor.toml` and your Rust code after deploying.
3. **Build and Deploy**:
   - Run `anchor build` to compile the smart contract.
   - Use `anchor deploy` to deploy the program to the desired cluster.
4. **Verify Deployment**:
   - Verify the deployment by running `solana program show <program_id>`. This command will confirm if the program is correctly deployed.

## Troubleshooting Tips

- **Anchor CLI Errors**: Ensure that your Anchor version is up to date. Run `anchor --version` and update if necessary.
- **Program ID Mismatch**: If you encounter a program ID mismatch, double-check that both `Anchor.toml` and the Rust source file contain the same program ID.
- **Network Issues**: Ensure that your Solana CLI is configured to the correct network using `solana config set --url <network>`.

## Additional Resources
- [Anchor Documentation](https://book.anchor-lang.com/)
- [Solana CLI Documentation](https://docs.solana.com/cli)
- [Rust Language Documentation](https://doc.rust-lang.org/)
