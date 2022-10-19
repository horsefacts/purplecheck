import Head from 'next/head';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import Connect from '../components/Connect';
import Mint from '../components/Mint';
import Success from '../components/Success';
import Upload from '../components/Upload';
import { useHasMounted } from '../hooks/hasMounted';
import Badge from '../public/badge.svg';

import type { NextPage } from "next";
const Home: NextPage = () => {
  const hasMounted = useHasMounted();
  const { isConnected } = useAccount();
  const [cid, setCID] = useState<string>();
  const [objectURI, setObjectURI] = useState<string>();
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<boolean>();

  const onError = (message: string) => {
    setError(message);
  };

  const onUploadComplete = (cid: string, objectURI?: string) => {
    setCID(cid);
    setObjectURI(objectURI);
  };

  const onMintSuccess = (txHash?: string) => {
    setTxHash(txHash);
    setSuccess(true);
  };

  return (
    <div>
      {hasMounted && (
        <div>
          <Head>
            <title>purplecheck</title>
          </Head>
          <main className="p-16 space-y-4 max-w-screen-xl mx-auto">
            <div>
              <h1 className="text-4xl font-bold text-violet-600">
                purplecheck
                <Badge className="inline w-10 fill-violet-600 align-bottom" />
              </h1>
              <p className="italic tracking-tight">
                Your JPEGs deserve to feel special
              </p>
            </div>
            <Connect />
            {success ? (
              <Success txHash={txHash} objectURI={objectURI} />
            ) : (
              <Upload
                enabled={isConnected}
                onUploadComplete={onUploadComplete}
                onError={onError}
              />
            )}
            <Mint cid={cid} onMintSuccess={onMintSuccess} />
          </main>
          <footer></footer>
        </div>
      )}
    </div>
  );
};

export default Home;
