const CONNECTED_WALLET_KEY = "procura_connected_wallet";

type EthereumProvider = {
  request: (args: { method: string; params?: any[] | object }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
};

function getEthereum(): EthereumProvider | null {
  const w = window as unknown as { ethereum?: EthereumProvider };
  return w.ethereum ?? null;
}

export function getSavedWalletAddress(): string | null {
  try {
    const v = localStorage.getItem(CONNECTED_WALLET_KEY);
    return v && /^0x[a-fA-F0-9]{40}$/.test(v) ? v : null;
  } catch {
    return null;
  }
}

export function saveWalletAddress(address: string | null): void {
  try {
    if (!address) localStorage.removeItem(CONNECTED_WALLET_KEY);
    else localStorage.setItem(CONNECTED_WALLET_KEY, address);
  } catch {
    // ignore
  }
}

// SKALE Base Sepolia (from SKALE docs)
export const SKALE_BASE_SEPOLIA = {
  chainIdHex: "0x135A9D92",
  chainIdDec: 324705682,
  chainName: "SKALE Base Sepolia",
  rpcUrls: ["https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha"],
  blockExplorerUrls: ["https://base-sepolia-testnet-explorer.skalenodes.com/"],
  nativeCurrency: { name: "CREDIT", symbol: "CREDIT", decimals: 18 },
} as const;

export async function connectWallet(): Promise<{ address: string; chainIdHex: string }> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet found. Install MetaMask or Rabby.");

  const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
  const address = String(accounts?.[0] ?? "").trim();
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) throw new Error("Wallet connection failed (no address).");

  const chainIdHex: string = await eth.request({ method: "eth_chainId" });
  saveWalletAddress(address);
  return { address, chainIdHex };
}

export async function ensureSkaleBaseSepoliaNetwork(): Promise<void> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet found.");

  const current: string = await eth.request({ method: "eth_chainId" });
  if (String(current).toLowerCase() === SKALE_BASE_SEPOLIA.chainIdHex.toLowerCase()) return;

  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SKALE_BASE_SEPOLIA.chainIdHex }],
    });
  } catch (e: any) {
    // 4902 = unknown chain
    const code = Number(e?.code ?? 0);
    if (code !== 4902) throw e;
    await eth.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: SKALE_BASE_SEPOLIA.chainIdHex,
          chainName: SKALE_BASE_SEPOLIA.chainName,
          rpcUrls: [...SKALE_BASE_SEPOLIA.rpcUrls],
          blockExplorerUrls: [...SKALE_BASE_SEPOLIA.blockExplorerUrls],
          nativeCurrency: { ...SKALE_BASE_SEPOLIA.nativeCurrency },
        },
      ],
    });
  }
}

function base64EncodeUtf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function randomBytes32Hex(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return (`0x${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`) as `0x${string}`;
}

export type X402AcceptV1 = {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  payTo: string;
  asset: string;
};

type Eip712TypedData = {
  types: Record<string, Array<{ name: string; type: string }>>;
  primaryType: string;
  domain: Record<string, unknown>;
  message: Record<string, unknown>;
};

function buildEip3009TypedData(opts: { accept: X402AcceptV1; from: string; to: string; value: string; validAfter: string; validBefore: string; nonce: `0x${string}` }): Eip712TypedData {
  return {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    primaryType: "TransferWithAuthorization",
    domain: {
      name: "USD Coin",
      version: "2",
      chainId: SKALE_BASE_SEPOLIA.chainIdDec,
      verifyingContract: opts.accept.asset,
    },
    message: {
      from: opts.from,
      to: opts.to,
      value: opts.value,
      validAfter: opts.validAfter,
      validBefore: opts.validBefore,
      nonce: opts.nonce,
    },
  };
}

function buildX402PaymentPayload(opts: { accept: X402AcceptV1; from: string; to: string; value: string; validAfter: string; validBefore: string; nonce: `0x${string}`; signature: string }) {
  return {
    x402Version: 1,
    scheme: opts.accept.scheme ?? "exact",
    network: opts.accept.network,
    payload: {
      authorization: {
        from: opts.from,
        to: opts.to,
        value: opts.value,
        validAfter: opts.validAfter,
        validBefore: opts.validBefore,
        nonce: opts.nonce,
      },
      signature: opts.signature,
    },
  };
}

export async function buildPaymentSignatureHeaderFrom402(opts: {
  accept: X402AcceptV1;
  fromAddress: string;
}): Promise<{ paymentSignatureBase64: string }> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet found.");

  const from = opts.fromAddress;
  const to = opts.accept.payTo;
  const value = String(opts.accept.maxAmountRequired);
  const now = Math.floor(Date.now() / 1000);
  const validAfter = String(now - 1);
  const validBefore = String(now + 900);
  const nonce = randomBytes32Hex();

  const typedData = buildEip3009TypedData({ accept: opts.accept, from, to, value, validAfter, validBefore, nonce });

  const signature: string = await eth.request({
    method: "eth_signTypedData_v4",
    params: [from, JSON.stringify(typedData)],
  });

  const paymentPayload = buildX402PaymentPayload({ accept: opts.accept, from, to, value, validAfter, validBefore, nonce, signature });

  return { paymentSignatureBase64: base64EncodeUtf8(JSON.stringify(paymentPayload)) };
}

export async function buildPaymentSignatureHeaderFrom402WithThirdwebAccount(opts: {
  accept: X402AcceptV1;
  account: { address: string; signTypedData: (typedData: any) => Promise<string> };
}): Promise<{ paymentSignatureBase64: string }> {
  const from = opts.account.address;
  const to = opts.accept.payTo;
  const value = String(opts.accept.maxAmountRequired);
  const now = Math.floor(Date.now() / 1000);
  const validAfter = String(now - 1);
  const validBefore = String(now + 900);
  const nonce = randomBytes32Hex();

  const typedData = buildEip3009TypedData({ accept: opts.accept, from, to, value, validAfter, validBefore, nonce });
  const signature = await opts.account.signTypedData(typedData as any);
  const paymentPayload = buildX402PaymentPayload({ accept: opts.accept, from, to, value, validAfter, validBefore, nonce, signature });

  return { paymentSignatureBase64: base64EncodeUtf8(JSON.stringify(paymentPayload)) };
}

