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
import contract_multi_sender_Interface from '../contract-multi-sender-abi.json';
import FlipCard, { BackCard, FrontCard } from '../components/FlipCard';  
import { ethers } from 'ethers';
import { setDefaultResultOrder } from 'dns';

const contract_multi_Config = {
  addressOrName: '0x34ca32b3e85b0d4acb10d6bc378a23eec841a8fd',
  contractInterface: contract_multi_sender_Interface, 

  
}; 
const Home: NextPage = () => {
  const [totalMinted, setTotalMinted] = React.useState(0);
  const { isConnected } = useConnect();
 
  
    

  const [Adress_tosend, setInput_NFT] = useState(''); // '' is the initial state value 
  const [Value, setInput_TX] = useState(''); // '' is the initial state value   

  const {  
     
    data: mintData,
    write: MS_Ether,  
    isLoading: isMintLoading,
    isSuccess: isMintStarted,    
    error: mintError,  
  } = useContractWrite(contract_multi_Config, 'MS_Ether'
  );
 

  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: mintData?.hash 
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
          <div style={{ padding: '104px 24px 24px 0' }}>
        
  
            <h1>Demo OptyTools</h1>
            <p style={{ margin: '12px 0 24px' }}>
               
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
          


          <div className='adressDiv' >
          <textarea  className='textarea-adress' placeholder="Adress" id='Count' value={Adress_tosend} onChange={e => setInput_NFT(e.target.value)}  ></textarea>
             </div>
            <div className='someDiv' >
             
            
            <input  className='input' placeholder="Value" id='Value' value={Value} onChange={e => setInput_TX(e.target.value)}  ></input> 
                  
            {isConnected   && (
              <button                 
                className="button" 
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}  
                onClick={() => MS_Ether({
                    overrides: {value:   ethers.utils.parseEther(String(Number(Value)*(Adress_tosend.length/40) )) }, 
                    args: [  Adress_tosend.replace(/\r\n/g,"\n").split("\n")  ,ethers.utils.parseEther(Value )],
                    
                  })}
              > 
                {isMintLoading && 'Send...'} 
                { !isMintLoading && 'Multi send'}               	
              </button>
            )            
            }
            </div>           
             
          </div>
        </div>

        <div style={{  flex: '0 0 auto' }}>
          <FlipCard>
            <FrontCard isCardFlipped={isMinted}>
               
            </FrontCard>
            <BackCard isCardFlipped={isMinted}>
              <div style={{ padding: 24 }}>
                 
                <h2 style={{ marginTop: 24, marginBottom: 6 }}>Transaction send!</h2>
                
                <p style={{ marginBottom: 6 }}>
                  View on{' '}
                  <a href={`https://kovan.etherscan.io/tx/${mintData?.hash}`}>
                    Etherscan
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
