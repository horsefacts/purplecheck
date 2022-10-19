import Image from 'next/image';
import { useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';
import { useNetwork } from 'wagmi';

interface SuccessProps {
  txHash?: string;
  objectURI?: string;
}

function Success({ txHash, objectURI }: SuccessProps) {
  const { chain } = useNetwork();
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    setActive(true);
  }, []);

  const etherscanURL =
    chain && `${chain.blockExplorers?.default.url}/tx/${txHash}`;

  return (
    <div>
      <div
        className={`border-2 border-dashed border-violet-600 rounded-xl bg-neutral-100 flex flex-row place-items-center`}
      >
        <div className="p-16 text-center mx-auto">
          {objectURI && (
            <p>
              <div className="w-24 h-24 relative mx-auto">
                <Image
                  src={objectURI}
                  alt="Image preview"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </p>
          )}
          <p className="font-bold text-violet-600">
            Your JPEG feels special now
          </p>
          {etherscanURL && (
            <p>
              <a
                className="underline cursor-pointer text-neutral-600 hover:text-violet-400"
                href={etherscanURL}
                target="_blank"
                rel="noreferrer"
              >
                View on Etherscan
              </a>
            </p>
          )}
          <div className="mx-auto">
            <Confetti
              active={active}
              config={{
                angle: 90,
                spread: 420,
                elementCount: 100,
                duration: 3500,
                width: "10px",
                height: "10px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
