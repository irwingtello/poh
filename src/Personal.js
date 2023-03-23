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
import Typography from '@mui/material/Typography';
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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
function App(props) {
  const [textBoxes, setTextBoxes] = useState(
    [
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

// Get the owned tokens of an address
async function getOwnedTokens() {
  const provider = new ethers.providers.JsonRpcProvider('https://api.hyperspace.node.glif.io/rpc/v1');
  const contract = new ethers.Contract(process.env.REACT_APP_SMART_CONTRACT_POH_FIL, ABI, provider);
  const tokensOwned = await contract.getOwnedTokens(address);
  let array = [];
  const promises = tokensOwned.map(async (tokenId) => {
    const uri = await contract.tokenURI(tokenId.toNumber());
    if (uri !== "") {
      const response = await fetch(uri.replace('ipfs://', 'https://nftstorage.link/ipfs/'));
      const data = await response.json();
      // Create an object with the data and push it to the array
      let obj = {
        name: data.name,
        hash: data.hash,
        description: data.description,
        verification: data.verification,
        image: data.image
      };
      array.push(obj);
    }
  });
  await Promise.all(promises);
  console.log(array);
  setTextBoxes(array);
}



window.onload = function() {
  alert("Badges are in progress");
  getOwnedTokens();
};

  return (
    <MyContextProvider>
      
          <Navbar isConnected={isConnected} chains={props.chains} ></Navbar>
   
      {
      chain ? props.chains.find(networkValue => chain.id === networkValue.id) ? isConnected ?
              <React.Fragment>
                     <Box
      sx={{
        my: -2,
        mx: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      <div className="mint">

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

                      <h1>My Badges</h1>

      <Container sx={{ py: 4 }} maxWidth="md">
          <Grid container spacing={2}>
          {textBoxes.map((textBox, index) => (   
            <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <center>
                  <CardMedia
                    component="img"
                    sx={{
                      width:200,
                      height:200
                    }}
                    image={textBox.image.replace("ipfs://","https://nftstorage.link/ipfs/")}
                    alt="random"
                  />
                  </center>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography>
                    Description: {textBox.description}
                    </Typography>
                    <Typography>
                    Hash: {textBox.hash}
                    </Typography>
                    <Typography>
                    Verification: {textBox.verification!="No verification"?<><Link 
                      onClick={() => {
                        window.open(textBox.verification.replace("ipfs://","https://nftstorage.link/ipfs/"));
                      }} >Verification</Link></>:"No verification"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          }
          </Grid>
        </Container>
         




          </Box>
        </React.Fragment>
      </div>
    </Box>
              </React.Fragment>:
              <React.Fragment>
              </React.Fragment>
      : "" : <center><h1>Please connect your wallet</h1></center>}

</MyContextProvider>
  );
}

export default App;