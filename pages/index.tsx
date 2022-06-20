import React from 'react'; 
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import {
  chain,
  useConnect,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
   useNetwork
} from 'wagmi';
import contract_nft_Interface from '../contract-nft-abi.json';
import FlipCard, { BackCard, FrontCard } from '../components/FlipCard';    
import { CONTRACT_ADDR } from '../components/consts'
import { getNetwork } from '@wagmi/core';

 



const Home: NextPage = () => {
  
  

  const { activeChain } = useNetwork();
  const [totalMinted, setTotalMinted] = React.useState(0);
  const { isConnected } = useConnect();
  const chainId =Number(activeChain?.id);
  const {
    data: mintData,
    write: mint,    
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,     
  } = useContractWrite( {
    addressOrName: CONTRACT_ADDR[chainId],
    contractInterface: contract_nft_Interface,
  }  , 'mint', { args: "1" }  );

  const { data: totalSupplyData } = useContractRead(
    {
      addressOrName: CONTRACT_ADDR[chainId],
      contractInterface: contract_nft_Interface,
    },
    'totalSupply',
    { watch: true }
  );

  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: mintData?.hash,
  }); 
  
  

  React.useEffect(() => { 
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);

  const isMinted = txSuccess; 
  return ( 
    <div className="page"> 
    <menu className="burger">
    <a id="home" className="menu-item" href="/">Home</a>
    <a id="multi_mint" className="menu-item" href="/multi_mint">Multi mint</a> 
    <a id="multi_sender" className="menu-item" href="/multi_sender">Multi send</a> 
    </menu>     
      <div className="container">     
        <div style={{ flex: '1 1 auto' }}>                     
           <div style={{ padding: '24px 24px 24px 0' }}>                     
           <h1>Demo OptyTools</h1>
            <p style={{ margin: '12px 0 24px' }}>
              {totalMinted} OptyTools minted
            </p>
            
            <ConnectButton />
           

            {mintError && (
              <p style={{ marginTop: 24, color: '#FF6257' }}>
                Error: {mintError.message}
              </p>
            )}
            {txError && (
              <p style={{ marginTop: 24, color: '#FF6257' }}>
                Error: {txError.message}
              </p>
            )}

            {isConnected && !isMinted && (
              <button
                style={{ marginTop: 24 }} 
                className="button"
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => mint()}
              >
                {isMintLoading && 'Waiting for approval'}
                {isMintStarted && 'Minting...'}
                {!isMintLoading && !isMintStarted && 'Mint'}
              </button>
            )}
          </div>
        </div>

        <div style={{  flex: '0 0 auto' }}>
          <FlipCard>
            <FrontCard isCardFlipped={isMinted}>
              <Image
              
                layout="responsive"
                src="/nft.png"
                width="500"
                height="500"
                alt="OptyTools Demo NFT"
              /> 
            </FrontCard>
            <BackCard isCardFlipped={isMinted}>
              <div style={{ padding: 24 }}>
                <Image
                  src="/nft.png"
                  width="80"
                  height="80"
                  alt="OptyTools Demo NFT"
                  style={{ borderRadius: 8 }}
                  
                />
                <h2 style={{ marginTop: 24, marginBottom: 6 }}>NFT Minted!</h2>
                <p style={{ marginBottom: 24 }}>
                  Your NFT will show up in your wallet in the next few minutes.
                </p>
                <p style={{ marginBottom: 6 }}>
                  View on{' '}
                  <a href={`${activeChain?.blockExplorers?.default.url}/tx/${mintData?.hash}`}>
                    Explorer
                  </a>
                </p> 
              </div>
            </BackCard>
          </FlipCard>
        </div>
      </div>
    </div>
  );



};

export default Home;
