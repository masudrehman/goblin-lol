import './App.css';
import {useState, useEffect} from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
import abi from './abi.json';
import { ethers } from "ethers";
// import { useWeb3Contract, useMoralis } from "react-moralis";

import { useAlert } from 'react-alert'

import { useContractRead, useContractWrite, useNetwork } from 'wagmi'








function App(){

  const alert = useAlert()
  const [count, setCount] = useState(1);
  const { data: account } = useAccount()
  const [totalSupply, setTotalSupply] = useState(0)
    //TODO: get contract address
    const contractAddress = "0x22D6D489C959026d660dC819dAACd2A5AdddDD35"
 


  // const { data, error, runContractFunction, isFetching, isLoading } =
  //   useWeb3Contract();
      // const totalSupply= useContractRead(
      //   {
      //     addressOrName: contractAddress,
      //     contractInterface: abi.abi,
      //   },
      //   'totalSupply',
      //   {
      //       watch: true,
      //   }
      // )

      // const hasClaimed = useContractRead(
      //   {
      //     addressOrName: contractAddress,
      //     contractInterface: abi.abi,
      //   },
      //   'hasClaimed',
      //   {
      //     args: account.address,
      //   },
      // )
    
  
   
  
 
  

    const { data, isError, isLoading, write } = useContractWrite(
      {
        addressOrName: contractAddress,
        contractInterface: abi.abi,
      },
      'mint',
      {   
        onSuccess: (txHash) => {
          alert.success('Transaction Successful!')
        },
        onError: (error) => {
          console.log(error)
          alert.error(error.message)
        },
          args: [count],
          // overrides: {
          //     value: ethers.utils.parseEther('0.03'),
          //   },
        },
    )


  useEffect(() => {
    // enableWeb3()
  }, [])


  const increment = async () => {
    setCount(count + 1);
    // const s = await goblinContract.totalSupply();
    // const c = ethers.BigNumber.from(s);
    // console.log(c.toNumber())
    // setTotalSupply(c.toNumber())

   
  }

  const decrement = async () => {
    setCount(prevCount => {
      if(prevCount > 1) {
        return prevCount - 1;
      } else {
        return 1;
      }
    });
  
  }

  const mint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const goblinContract = new ethers.Contract(contractAddress, abi.abi, provider);
     const s = await goblinContract.totalSupply();
     const c = ethers.BigNumber.from(s);
     console.log(c.toNumber())
    setTotalSupply(c.toNumber())
    if (await goblinContract.hasClaimed(account.address) == false) {
      if(count == 1) {
        write({
          args: [count],
            overrides: {
                value: ethers.utils.parseEther('0'),
            }
        })
    } else {
      const price = (count - 1) * 0.03
      write({
        args: [count],
          overrides: {
              value: ethers.utils.parseEther(price.toString()),
          }
      })
    }
  } else {
    const price = count * 0.03
    write({
      args: [count],
        overrides: {
            value: ethers.utils.parseEther(price.toString()),
        }
    })
  }
    
  }

  



  return (
    
      
      
    <div className="App">
      <div className='connect-b'>
          <ConnectButton />
        </div>
      <div className="App-header">
        <div className='te'>
        <p className='texty'>gnome_shit_lol MINT:</p>
      <p className="texty2">1 FREE mint per wallet then 0.03 ETH</p>
        </div>
      
      <img className='troll' src={require("./troll.png")}></img>
      <div className='mint-rect'>
      <pre className='mintedtext'>NFT Minted                    {totalSupply}/10000</pre>
      </div>
      <div className='incremental'>
        <button className='round-b1' onClick={decrement}>-</button>
        <div className='inc-num-div'>
          <p className='inc-num'>{count}</p>
          </div>
        <button className='round-b2'  onClick={increment}>+</button>
      </div>
      <div className='mint_buttons'>
        <button className='b' onClick={mint} disabled={isLoading}>Mint Now</button>
      </div>

      <div className='logos'>
        <a href="https://www.w3schools.com"><img className='logo1' src={require("./etherscan.jpg")}></img></a>
        <a href="https://www.w3schools.com"><img  className='logo1' src={require("./twitter.png")}></img></a>
        <a href="https://testnets.opensea.io/assets?search[query]=0x22D6D489C959026d660dC819dAACd2A5AdddDD35"><img className='logo1' src={require("./opensea.png")}></img></a>


      </div>
      </div>
    </div>
  
  );
}

export default App;
