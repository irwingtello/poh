import './App.css';
import Navbar from './Profile/Navbar';
import React,{useEffect,useState,useMemo} from 'react';
import {
  Provider,createClient,configureChains, useConnect, useDisconnect,
  useAccount,
  usePrepareContractWrite,
  useNetwork,useContractRead,useContractWrite,useWaitForTransaction, useSwitchNetwork,WagmiConfig
} from 'wagmi'
import ABI from "./Solidity/POH.json";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MyContextProvider from './MyContextProvider';
import Domains from './Domains'
import AvatarGroup from '@mui/material/AvatarGroup';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";
import { useDebounce } from 'usehooks-ts'
import { getRandomInt } from "./Resources/function.js";
import {addressSmartContract} from "./Resources/function"
import { ethers } from 'ethers';
function App(props) {
  const [textBoxes, setTextBoxes] = useState(
    [
      { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(7).jpg"  },
    { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(6).jpg"  },
    { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(5).jpg"  },
      {image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(3).jpg"}
  ]);
  const { address, connector, isConnected } = useAccount()
  const [hash,setHash]=useState("");
    const [description,setDescription]=useState("");
  const { chain } = useNetwork();
  let [uri,setUri]=useState("");
  let [addressB,setAddressB]=useState("");
  const [badge, setBadge] = useState("");
  const [enableProcess, setEnableProcess] = useState(0);
  const { ethereum } = window;
  const { waitForTransaction } = useWaitForTransaction();

  useEffect(() => {
    setHash(getRandomInt(0,10));
  }, [address]);
  const showBadge  = async (badgeId) => {
    setBadge(badgeId);
  }
  const [image, setImage] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  function handleImageChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
   
    reader.onloadend = () => {
      setFileObject(file);
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  }
 
  const mint = async (e) => {

    const client = new NFTStorage({
      token: process.env.REACT_APP_NFTSTORAGE_TOKEN,
    });
    let metadata;
   if(image)
   {
    const metadataVerification = await client.store({
      name: "Proof of Help - Verification",
      description:"Proof of Help - Verification",
      image: fileObject
    });

    await fetch(metadataVerification.url.replace('ipfs://', 'https://nftstorage.link/ipfs/'))
    .then(response => response.json())
    .then(async data => {
      if (data === null) {
        console.log('Data is null')
      } else {
        let datax = JSON.stringify({
          "name": "Proof of Help",
          "hash":  hash,
          "description":description,
          "verification": data.image,
          "image": badge.replace('https://nftstorage.link/ipfs/', 'ipfs://')
        });
        const someData = await new Blob([datax])
        const { car } = await NFTStorage.encodeBlob(someData)
    
        metadata = await client.storeCar(car)
      }
    });
   }
   else
   {

    const someData = new Blob(
      [JSON.stringify(
        {"name":"Proof of Help",
        "hash":hash,
        "description":description,
        "verification":"No verification",
        "image": badge.replace('https://nftstorage.link/ipfs/', 'ipfs://') 
      })])
    const { car } = await NFTStorage.encodeBlob(someData)

    metadata = await client.storeCar(car)
   }
   metadata="ipfs://" + metadata ;
  
    // Request user approval
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

  // Create a provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Create a signer using the provider
  const signer = provider.getSigner();

  // Create a contract instance
  const contract = new ethers.Contract(process.env.REACT_APP_SMART_CONTRACT_POH_FIL, ABI, signer);

  // Call the contract method that requires approval
  const tx = await contract.safeMint(addressB,metadata);

// Wait for the transaction to be mined and get the receipt
alert("Badge in progress")

// Wait for the transaction to be confirmed and get the receipt
const receipt = await provider.getTransactionReceipt(tx.hash);
// Check if the transaction failed due to running out of gas or being cancelled by the user
if (receipt.status === 0) {
  console.log('Transaction failed due to running out of gas or being cancelled by the user');
} else {
  console.log("Transaction succeeded.");
  alert("Transaction succeeded.");
  setHash(getRandomInt(0,10));
  setUri("");
  setAddressB("");
  setDescription("");
  setBadge("");
}
  }

  return (
    <MyContextProvider>
      {
        props.nav?<>      <Navbar isConnected={isConnected} chains={props.chains} ></Navbar></>:<></>
      }
      {
      chain ? props.chains.find(networkValue => chain.id === networkValue.id) ? isConnected ?
              <React.Fragment>
                     <Box
      sx={{
        my: 4,
        mx: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      <div className="mint">



        <React.Fragment>
          <Container sx={{ py: 0 }} maxWidth="md">
            <center>
            <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
                      <h1>Mint Badge</h1>
          <Stack direction="row" spacing={4}>
          {textBoxes.map((textBox, index) => (
            <Avatar className="pfp"
            onClick={() => showBadge(textBox.image)} 
            src={textBox.image} key={index}  
            sx={{ width: 100, height: 100 }} 
            />            ))
          }

          </Stack>
          <TextField
                margin="normal"
                fullWidth
                sx={{ mt: 3, mx: 0 }}
                id="beneficiaryAddress"
                label="Beneficiary address"
                InputLabelProps={{ shrink: true }}
                type="text"
                name="beneficiaryAddress"
                value={addressB}
                onChange={(e) => setAddressB(e.target.value)}
              />  
                                        <TextField
                margin="normal"
                fullWidth
                sx={{ mt: 3, mx: 0 }}
                id="description"
                label="Description"
                InputLabelProps={{ shrink: true }}
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              /> 
                 <TextField
                margin="normal"
                fullWidth
                sx={{ mt: 3, mx: 0 }}
                id="hash"
                label="Hash"
                InputLabelProps={{ shrink: true }}
                type="text"
                name="hash"
                value={hash}
                  />            
                                   <TextField
                margin="normal"
                fullWidth
                sx={{ mt: 3, mx: 0 }}
                id="Badge"
                label="Badge"
                InputLabelProps={{ shrink: true }}
                type="text"
                name="Badge"
                value={badge.replace("https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/","")}
                  />      
                       <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
        sx={{ marginRight: "1rem" }}
      >
        Upload Verification
        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
      </Button>
      <br></br>
               {image && <img src={image} alt="Preview"  style={{ maxWidth: '300px', maxHeight: '300px' }}/>}


                <Button
                variant="contained"
                color="success"
                className="buttonWallet"
                onClick={async (e) =>{
                  e.preventDefault();
                  mint();
                } }
                sx={{ mt: 3, mx: 0 }}
              >
                Sent
              </Button>
            </Box>

</center>
          </Container>
        </React.Fragment>
      </div>
    </Box>
              </React.Fragment>:
              <React.Fragment>
              </React.Fragment>
      : "" : ""}

</MyContextProvider>
  );
}

export default App;