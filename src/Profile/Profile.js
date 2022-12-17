import { useAccount, useConnect, useDisconnect,usePrepareContractWrite, useContractWrite ,useSendTransaction,useWaitForTransaction  } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import * as React from 'react'
import  {useState } from 'react';
import Box from '@mui/material/Box'
import { useDebounce } from 'use-debounce'
import { ethers } from "ethers";
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from "@mui/material/FormControl";
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";
import { useSignMessage } from 'wagmi'
import domainsAbi from "../Resources/DomainsABI.json";
var connected = false;
function Profile() {
  const Web3 = require('web3');
  const { Wallet, Contract } = require('ethers');
  const { createCanvas } = require('canvas');
  const client= new NFTStorage({token:process.env.REACT_APP_NFT_API_KEY});
  const { disconnect } = useDisconnect()

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  
  const [addressField, setAddressField] = React.useState('')
  const [addressFieldError, setAddressFieldError] = useState();

  const [textField, setTextField] = React.useState('')
  const [textFieldError, setTextFieldError] = useState();

  const [pohField, setPOHField] = React.useState('')
  const [pohIPFSField, setPOHIPFSField] = React.useState('')



  const changeTextField = (event) => {
    setTextField(event.target.value);
  };
  const changeAddressField = (event) => {
    setAddressField(event.target.value);
  };
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const connectWallet = async (event) => {
            // Check if the browser supports Ethereum
          if (window.ethereum) {
            // Set the provider to be used (in this case, the injected provider from MetaMask)
            const web3 = new Web3(window.ethereum);

            try {
              window.ethereum
              .request({ method: "eth_requestAccounts" })
              .then((result) => {
                accountChangedHandler(result[0]);
                setConnButtonText("Wallet Connected");
                getAccountBalance(result[0]);
      
                connected = true;
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
            } catch (error) {
              // User denied account access...
            }
          }
          // Legacy dapp browsers...
          else if (window.web3) {
            // Set the provider to be used (in this case, the injected provider from MetaMask)
            const web3 = new Web3(window.web3.currentProvider);

            // Set the default account to be used by web3.js
            web3.eth.defaultAccount = window.web3.eth.defaultAccount;
          }
          // Non-dapp browsers...
          else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
          }
  };
  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };
  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };
  const check=()=>{
    window.ethereum.enable()
    .then(() => {
      console.log('MetaMask permission granted');
    })
    .catch((error) => {
      console.error('MetaMask permission denied');
    });
  }
  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const handleSubmit = async () => {
    console.log(window.ethereum.selectedAddress);
    const canvasBackground = createCanvas(900, 800);
    const cxBackground = canvasBackground.getContext('2d');
    cxBackground.fillStyle = "#14213d";
    cxBackground.fillRect(0, 0, 1800,1800);
    cxBackground.font = '100px Arial';
    cxBackground.fillStyle = '#e5e5e5';
    cxBackground.fillText(textField,100,600);

   canvasBackground.toBlob(async function(blob) {
      const metadata =await client.store({
        name: 'Proof of Help',
        description:textField,
        image: new File([blob], 'proofofhelp.jpg', { type: 'image/jpg' }),
      })    
    await fetch(metadata.url.replace("ipfs://", "https://nftstorage.link/ipfs/"))
    .then(res => res.json())
    .then((out) => {
      setPOHIPFSField(out.image);
      setPOHField(out.image.replace("ipfs://", "https://nftstorage.link/ipfs/"));
      }).catch(err => console.error(err));
    });

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    /*
    Only account with role
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const walletAddress = accounts[0]    // first account in MetaMask
    const gasPayer = provider.getSigner(walletAddress);
    const contract = new ethers.Contract("0x80aeF98D67B84B265e43a3F86382f70948a18eAE", domainsAbi, gasPayer)
    const name = await contract.helpRegister("x","x");
    */
     // defining the wallet private key
     // Set the contract address and ABI
      const web3 = new Web3(window.ethereum);
     let privatekey = process.env.REACT_APP_SIGNER;
     const contractAddress = '0x80aeF98D67B84B265e43a3F86382f70948a18eAE';
     
     // Set the provider (MetaMask) and signer (private key)
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const wallet = new ethers.Wallet(privatekey, provider);
     console.log(wallet);
     //Get the contract instance
     const contract = new ethers.Contract(contractAddress, domainsAbi, wallet);
     
     //Metamask
     const signer = provider.getSigner();
     const contractMetamask = new ethers.Contract(contractAddress, domainsAbi, signer);

     // Set the parameters for the function call
     const name = 'John';
     const tokenURI = 'https://example.com/token/123';
     const nonce=await provider.getTransactionCount(wallet.address);
     console.log("nonce: " + nonce);
   


      const nonceMetamask=await provider.getTransactionCount(accounts[0]);
    
      // Populate the transaction object
 
      const tx = await contract.populateTransaction.helpRegister(name, tokenURI, {
         nonce: nonce,
         gasLimit: 3000000
      });
      
       const amountxx=await getTotalGasCostInWei(tx);
    
      /*
       const txx = await contract.helpRegister(name, tokenURI, { gasLimit: 3000000});
                // Wait for the transaction to be mined
        await txx.wait();
      */


  }
  async function getTotalGasCostInWei(tx) {
    try {
      const web3 = new Web3(window.ethereum);
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await web3.eth.estimateGas(tx);
      const gasEstimatePlus= gasEstimate * 1.7;
      console.log(gasEstimatePlus * gasPrice);
    } catch (error) {
      console.error(error);
    }
  }
  if (connected)
    return (
      <div>
         <Box
        component="form"
         noValidate
            sx={{
              my: 4,
              mx: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            
          >  
          <FormControl >
              <center>
                  <FormLabel id="address" >{defaultAccount}</FormLabel>
                  <TextField
                              InputLabelProps={{ shrink: true }}
                              error= {addressFieldError? true:false}
                              margin="normal"
                              fullWidth
                              id="name"
                              label="Address Name"
                              name="name"
                              value={addressField}
                              onChange={changeAddressField}
                                              
                      />  
                      <TextField
                              InputLabelProps={{ shrink: true }}
                              error= {textFieldError? true:false}
                              margin="normal"
                              fullWidth
                              id="text"
                              label="Text"
                              name="text"
                              value={textField}
                              onChange={changeTextField}
                                              
                      />  
                <FormLabel sx={{m:3}} id="mintedPOH" ><Link href={pohField}>{pohField}</Link></FormLabel>
                <br/>
                <br/>
                <Button onClick={() => handleSubmit()} variant="contained" >
                  Mint
                </Button>
                <Button onClick={() =>check()} variant="contained" >
                  Wallet permission check
                </Button>
                </center>
            </FormControl>
           </Box>

      </div>
    )
  return  <Button onClick={() => connectWallet()}  sx={{m: 2}} variant="contained" color="success">Connect Wallet</Button>
}

export default Profile;