import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import {
  useConnect,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import contract_multimint_Interface from '../contract-multimint-abi.json';
import FlipCard, { BackCard, FrontCard } from '../components/FlipCard';  
import { ethers } from 'ethers';

const contract_multi_Config = {
  addressOrName: '0x08d1aa14F7287114685d6aB999A8D7731C3986ef',
  contractInterface: contract_multimint_Interface, 

  
}; 

const Home: NextPage = () => {
  const [totalMinted, setTotalMinted] = React.useState(0);
  const { isConnected } = useConnect();
 
  
    

  const [NFT, setInput_NFT] = useState(''); // '' is the initial state value 
  const [TX, setInput_TX] = useState(''); // '' is the initial state value  
  const [Eth_value, setInput_Eth_value] = useState(''); // '' is the initial state value 

  const {  
     
    data: mintData,
    write: multimint,  
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,  
  } = useContractWrite(contract_multi_Config, 'multiMint', 
  { args: [NFT,TX]} 
  );

  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: mintData?.hash 
  }); 


  const {  
     
    data:payData,
    write: send_to_contract,  
    isLoading: ispayLoading,
    isSuccess: ispayStarted,
    error: paytError,  
  } = useContractWrite(contract_multi_Config, 'send_to_contract' );

  const {  
     
    data:withdrawETHData,
    write: withdrawETH,  
    isLoading: iswithdrawETHLoading,
    isSuccess: iswithdrawETHStarted,
    error: withdrawETHError,  
  } = useContractWrite(contract_multi_Config, 'withdrawETH' );

  const [ID_NFT, setInput_ID_NFT] = useState(''); // '' is the initial state value 

  const {  
     
    data:withdrawNFTData,
    write: withdrawNft,  
    isLoading: iswithdrawNFTLoading,
    isSuccess: iswithdrawNFTStarted,
    error: withdrawNFTError,  
  } = useContractWrite(contract_multi_Config, 'withdrawNft'  );

  


  const { isSuccess: withNFTSuccess, error: withNFTError } = useWaitForTransaction({
    hash: withdrawNFTData?.hash 
  }); 

   

  const isMinted = txSuccess; 
 
  return ( 
    
    <div  className="page">

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
               
            </p>
            
            <ConnectButton />

            {mintError && (
              <p style={{ marginTop: 24, color: '#FF6257' }}>
                Error: {mintError.message}
              </p>
            )}
            {withNFTError && (
              <p style={{ marginTop: 24, color: '#FF6257' }}>
                Error: {withNFTError.message}
              </p>
            )}  




            <div className='someDiv' >
            <div  >
              <input className='input' placeholder="ETH" id='Eth_value' value={Eth_value} onChange={e => setInput_Eth_value(e.target.value)} /> 

              {isConnected    && (
              <button
                style={{ marginTop: 24 }}
                className="button"
                data-mint-loading={ispayLoading}
                data-mint-started={ispayStarted}
                onClick={() => send_to_contract( {
                  overrides: {value:   ethers.utils.parseEther(Eth_value) }, 
                })}
              >                 
                {  'Pay'}                	
              </button>
            )
            
            }
            {isConnected  &&  (
              <button
                style={{ marginTop: 24 }} 
                className="button" 
                data-mint-loading={iswithdrawETHLoading}
                data-mint-started={iswithdrawETHStarted}
                onClick={() => withdrawETH()}             
                
                >  
                {  'Withdraw'}                	
              </button>
            )            
            }              
            </div>
            
            <input  className='input' placeholder="NFT" id='Count' value={NFT} onChange={e => setInput_NFT(e.target.value)}  ></input>
            <input  className='input' placeholder="TX" id='Value' value={TX} onChange={e => setInput_TX(e.target.value)}  ></input> 
                  
            {isConnected  && (
              <button                
                disabled={isMintLoading  }
                className="button" 
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => multimint()}
              > 
                {isMintLoading && 'Minting...'}
                {isMintStarted && 'MultiMint'}
                {!isMintLoading && !isMintStarted && 'MultiMint'}               	
              </button>
            )            
            }
            </div>           
            <input  className='input' placeholder="ID" id='ID_NFT' value={ID_NFT} onChange={e => setInput_ID_NFT(e.target.value)}  ></input> 
          
            {isConnected  && (
              <button
                style={{ marginTop: 24 }} 
                className="button" 
                data-mint-loading={iswithdrawNFTLoading}
                data-mint-started={iswithdrawNFTStarted}
                onClick={() => withdrawNft({  
                  args: [ ID_NFT.split(',')], //[4,5]
                  
                })}
              > 
                { 'NFT Withdraw'}                	
              </button>
            )            
            } 
          </div>
        </div>

            

        <div style={{  flex: '0 0 auto' }}>

         

          <FlipCard>
             
            <FrontCard isCardFlipped={isMinted||withNFTSuccess}>
               
            </FrontCard>
            <BackCard isCardFlipped={isMinted||withNFTSuccess}>
             
            {
             isConnected    && isMinted&&
             ( 
                 <div  style={{ padding: 24 }}>
                 
                <h2 style={{ marginTop: 2, marginBottom: 6 }}>NFT Minted!</h2> 
                <p  style={{ marginBottom: 2 }}>
                  View on{' '}
                  <a href={`https://kovan.etherscan.io/tx/${mintData?.hash}`}>
                    Etherscan
                  </a>
                </p> 
              </div>
              )}

            {
             isConnected    && withNFTSuccess&&
             ( 
                 <div  style={{ padding: 24 }}>
                 
                <h2 style={{ marginTop: 2, marginBottom: 6 }}>Transaction completed!</h2>
                <p style={{ marginBottom: 2 }}> 
                </p>
                <p  style={{ marginBottom: 2 }}>
                  View on{' '}
                  <a href={`https://kovan.etherscan.io/tx/${withdrawNFTData?.hash}`}>
                    Etherscan
                  </a>
                </p> 
              </div>
              )}
            </BackCard>
          </FlipCard>
        </div>
      </div>
    </div>
  );



};

export default Home;
