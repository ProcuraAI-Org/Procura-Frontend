import { createThirdwebClient, defineChain } from "thirdweb";

const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};

export const thirdwebClient = createThirdwebClient({
  clientId: env.VITE_THIRDWEB_CLIENT_ID ?? "",
});

// SKALE Base Sepolia (from existing app config)
export const skaleBaseSepolia = defineChain({
  id: 324705682,
  name: "SKALE Base Sepolia",
  rpc: "https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha",
  nativeCurrency: { name: "CREDIT", symbol: "CREDIT", decimals: 18 },
  blockExplorers: [{ name: "SKALE Explorer", url: "https://base-sepolia-testnet-explorer.skalenodes.com/" }],
});

