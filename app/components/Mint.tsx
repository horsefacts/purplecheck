import React, { useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import purplecheckABI from '../config/abis/purplecheck.json';
import { usePrice } from '../hooks/contracts';

interface MintProps {
  cid?: string;
  onMintSuccess: (txHash?: string) => void;
}

interface WagmiError {
  reason?: string;
}

function Mint({ cid, onMintSuccess }: MintProps) {
  const [success, setSuccess] = useState<boolean>();
  const { price, roundedPrice, isError, isLoading } = usePrice();
  const { config } = usePrepareContractWrite({
    address: "0xbF7520551af5d9CD58EBA3D152e00A506E1f81C3",
    abi: purplecheckABI,
    functionName: "mint",
    overrides: {
      value: price,
    },
    args: [cid],
  });
  const {
    write: mint,
    data: txData,
    error: writeError,
  } = useContractWrite(config);
  const {
    data: mintData,
    error: mintError,
    isLoading: isMinting,
  } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess() {
      setSuccess(true);
      onMintSuccess(txData?.hash);
    },
  });

  const enabled = cid && price && mint;
  const error = (mintError || writeError) as WagmiError;

  const onClick = () => {
    if (enabled && !isMinting && !success) {
      mint();
    }
  };

  const getMessage = () => {
    if (error) {
      const reason = error?.reason;
      return reason ? `Error: ${reason}` : "Error";
    }
    if (success) return "Success!";
    if (enabled) return `Mint for ${roundedPrice} ETH`;
    if (!enabled) return "Upload to mint";
  };

  const message = getMessage();

  return (
    <div>
      <button
        className="bg-violet-600 disabled:bg-neutral-400 font-2xl text-white shadow-lg rounded-xl font-bold px-4 py-2 cursor-pointer transform transition duration-250 hover:scale-[102.5%]"
        onClick={onClick}
        disabled={!enabled}
      >
        {isMinting ? "Minting..." : message}
      </button>
    </div>
  );
}

export default Mint;
