import './App.css';
import Navbar from './Profile/Navbar';
import React,{useEffect,useState} from 'react';
import { ethers } from 'ethers';
import {
  Provider,createClient,configureChains, useConnect, useDisconnect,
  useAccount,
  usePrepareContractWrite,
  useNetwork,useContractRead, useSwitchNetwork,WagmiConfig
} from 'wagmi'
import ABI from "./Solidity/Domains.json";
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
function App(props) {
  const [textBoxes, setTextBoxes] = useState(
    [
      { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(7).jpg"  },
    { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(6).jpg"  },
    { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(5).jpg"  },
      {image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(3).jpg"}
  ]);
  const { address, connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [mintPOH, setMintPOH] = useState("");
  const check = async () => {
    if(chain){
    let valueHTTP=props.chains.find(networkValue => chain.id === networkValue.id).rpcUrls.default.http;
    const provider = new ethers.providers.JsonRpcProvider(
      valueHTTP[0].http
    );
    const contract = new 
    ethers.Contract(
      process.env.REACT_APP_SMART_CONTRACT_FIL
    ,ABI,
    provider);
    let value= await contract.getDomainAddress(address);
    if (!value) {
      setMintPOH(false);
  } else {
    setMintPOH(true);
  }
}
  };
  useEffect(() => {
    check();
  }, [address]);
  const showBadge  = async (badgeId) => {
    alert(badgeId);
  }
  return (
    <MyContextProvider>
      {
        props.nav?<>      <Navbar isConnected={isConnected} chains={props.chains} mintPOH={mintPOH}></Navbar></>:<></>
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
          <h1>Mint Badge</h1>
          <Stack direction="row" spacing={4}>
          {textBoxes.map((textBox, index) => (
          <Avatar src={textBox.image} key={index} onClick={()=> showBadge(textBox.image)}  sx={{ width: 100, height: 100 }}/>
            ))
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
              /> 
                <Button
                variant="contained"
                color="success"
                className="buttonWallet"
                sx={{ mt: 3, mx: 0 }}
              >
                Sent
              </Button>
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