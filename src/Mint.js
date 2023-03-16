import Navbar from './Profile/Navbar';
import React,{useEffect,useState,useMemo} from 'react';
import { ethers } from 'ethers';
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork
} from "wagmi";
import ABI from "./Contracts/MyToken.json";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useDebounce } from 'usehooks-ts'
import {addressSmartContract} from "./functions"
function Mint(props) {
  const [textBoxes, setTextBoxes] = useState(
    [
      { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(7).jpg"  },
    { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(6).jpg"  },
    { image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(5).jpg"  },
      {image:"https://nftstorage.link/ipfs/bafybeicx7pkobpcko425usyxdaxqk77pjszjywh44jtr6bq3d5the4cr3m/poh%20(3).jpg"}
  ]);
  const { address, connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [uriField, setUriField] = useState("");
  const [addressField, setAddressField] = useState("");
  const changeUriField  = async (event) => {
    setUriField(event.target.value);
  }
  const selectUri  = async (uri) => {
    setUriField(uri);
  }

  const changeAddressField  = async (event) => {
    setAddressField(event.target.value);
  }
  const theFlag = useMemo(() => {
    return addressField !== "" && uriField !== "";
  }, [addressField, uriField]);
  const debouncedAddressField = useDebounce(addressField);
  const debouncedUriField = useDebounce(uriField)

  const {
    config:isConfig,
    data: datax,
    isSuccess: isSuccessPrepare,
    error: prepareError,
    isPrepareError: isPrepareError,
  } = usePrepareContractWrite({
    address:addressSmartContract(props.chains.find(networkValue => chain.id === networkValue.id).id),
    abi: ABI,
    functionName: "safeMint",
    enabled: theFlag,
    args: [debouncedAddressField,debouncedUriField],
    chainId:props.chains.find(networkValue => chain.id === networkValue.id).id,
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });
  const { data:dataCW, error:errorCW, isError:isErrorCW, write:writeCW } = useContractWrite(isConfig);
  const { isLoading:isLoadingWT, isSuccess:isSuccessWT } = useWaitForTransaction({
    hash: dataCW?.hash,
  });
  const mint = (e) => {
    e.preventDefault()
    writeCW?.();
  }
  return (
    <React.Fragment>
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
          <Avatar src={textBox.image} key={index} onClick={()=> selectUri(textBox.image)}  sx={{ width: 100, height: 100 }}/>
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
                value={addressField}
                onChange={changeAddressField}  
              />  
                                        <TextField
                margin="normal"
                fullWidth
                sx={{ mt: 3, mx: 0 }}
                id="URI"
                label="URI"
                value={uriField}
                onChange={changeUriField}  
                InputLabelProps={{ shrink: true }}
                type="text"
                name="URI"
              /> 
                <Button
                variant="contained"
                color="success"
                className="buttonWallet"
                sx={{ mt: 3, mx: 0 }}
                onClick={(e) =>{
                  e.preventDefault();
                  mint(e);
                }
                  
                }
              >
                MINT
              </Button>
              {
              dataCW?.hash &&(
              <React.Fragment> <br></br><a target="_blank" href={`${props.chains.find(networkValue => chain.id === networkValue.id).blockExplorers.default.url.replace("type", "tx").replace("valuex", dataCW.hash)}`}>Hash</a></React.Fragment>
              )
              }
              </center>
          </Container>
        </React.Fragment>
      </div>
    </Box>
              </React.Fragment>:
              <React.Fragment>
              </React.Fragment>
      : "" : ""}
  </React.Fragment>
  );
}

export default Mint;