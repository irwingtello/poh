import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import React, { useState,useContext , useEffect, useRef, useMemo} from "react";
import { ethers, getDefaultAccount } from "ethers";
import "./Resources/WalletCard.css";
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";
import QRCode from "qrcode";
import { background } from "./Resources/function.js";
import ABI from "./Solidity/Domains.json";
import Navbar from './Profile/Navbar';
import {
  useAccount,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useContractWrite,
  useSendTransaction,
  useWaitForTransaction,
  ChainDoesNotSupportMulticallError,
  useNetwork
} from "wagmi";
import { wallabyTestnet } from "./Chains.jsx";
import { useDebounce } from 'usehooks-ts'
import { MyContext } from './MyContextProvider';
import MyContextProvider from './MyContextProvider';
var connected = false;

const Domains = (props ) => {
  const { chain } = useNetwork()
  const client = new NFTStorage({
    token: process.env.REACT_APP_NFTSTORAGE_TOKEN,
  });
 // const { state, dispatch } = useContext(MyContext);
  const [userDomin, setUserDomin] = useState("");
  const [metadataX, setMetaDatax] = useState("");

  const [imagex, setImagex] = useState("");
  const [visibleItem, setVisibleItem] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [enableProcess, setEnableProcess] = useState(0);
  const { address, isConnected } = useAccount();

  const theFlag = useMemo(() => {
    return userDomin !== "" && metadataX !== "";
  }, [userDomin, metadataX]);

  async function mint() {
    let imageDentro;
    let canvasBackground = background(userDomin);
    await canvasBackground.toBlob(async function (blob) {
      const metadata = await client.store({
        name: "Proof of Help",
        description: userDomin + process.env.REACT_APP_TLD,
        image: new File(
          [blob],
          userDomin +
            process.env.REACT_APP_TLD.toString().replace(".", "") +
            ".jpg",
          {
            type: "image/jpg",
          }
        ),
      });

      setMetaDatax(metadata.url);
      await fetch(
        metadata.url.replace("ipfs://", "https://nftstorage.link/ipfs/")
      )
        .then((res) => res.json())
        .then((out) => {
          imageDentro = out.image.replace(
            "ipfs://",
            "https://nftstorage.link/ipfs/"
          );
        })
        .catch((err) => console.error(err));
      setImagex(imageDentro);
      setVisibleItem(true);
      setEnableProcess(2);
    });
  }

  const debouncedDominField = useDebounce(userDomin.replace(".poh", ""));
  const debouncedMetadataField = useDebounce(metadataX)
  const {
    config,
    data: datax,
    isSuccess: isSuccessPrepare,
    error: prepareError,
    isPrepareError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.REACT_APP_SMART_CONTRACT_DOMAINS_FIL,
    abi: ABI,
    functionName: "register",
    enabled: theFlag,
    args: [debouncedDominField, debouncedMetadataField],
    chainId:props.chains.find(networkValue => chain.id === networkValue.id).id,
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      setEnableProcess(0);
      console.log("Error", error);
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });

  const { data:dataCW, error:errorCW, isError:isErrorCW, write } = useContractWrite(config);
  const { isLoading:isLoadingWT, isSuccess:isSuccessWT } = useWaitForTransaction({
    hash: dataCW?.hash,
  });
 
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (enableProcess == 2) {
      setEnableProcess(2);
      write?.();
    }
  }, [enableProcess]);

  useEffect(() => {
    async function fetchDefaultAccount() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setDefaultAccount(accounts[0]);
        getAccountBalance(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    }

    fetchDefaultAccount();
  }, [defaultAccount]);

  const domainpoh = () => {
    let strongRegex = new RegExp("^[A-Za-z0-9_-]*$");
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
        });

      if (userDomin.length === 0) {
        alert("Caja de texto vacia");
      } else {
        if (!strongRegex.test(userDomin)) {
          alert("Caracter invalido");
        } else {
          if (userDomin.length <= 25) {
            setEnableProcess(0);
            mint();
          } else {
            alert("No puede ser mas de 25 caracteres");
          }
        }
      }
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };
  useEffect(() => {
    if(dataCW?.hash)
    {
      //dispatch({ type: 'SET_VALUE', payload: true });
    }
  }, [dataCW?.hash]);
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

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);
 
  return (
    <MyContextProvider>  
     <Navbar isConnected={isConnected} chains={props.chains} ></Navbar>
    <Box
      sx={{
        my: 4,
        mx: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <br></br>
      <div className="walletCard">
        <div className="accountDisplay">
          <InputLabel>Address: {address}</InputLabel>
        </div>
        <br></br>
        <div className="balanceDisplay">
          <InputLabel>Balance: {userBalance}</InputLabel>
        </div>
        {errorMessage}
        <br></br>
        <React.Fragment>

          <div className="form-container">
            <div className="first-row">
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <OutlinedInput
                  margin="dense"
                  type="text"
                  pattern="[a-zA-Z0-9_-]{1,25}"
                  value={userDomin}
                  placeholder="domain"
                  onChange={(e) => setUserDomin(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      {" "}
                      {process.env.REACT_APP_TLD}{" "}
                    </InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
              </FormControl>
            </div>
            <br></br>
            {isLoadingWT ? (
              "Generando..."
            ) : (
              <Button
                variant="contained"
                color="success"
                disabled={isLoadingWT}
                className="buttonWallet"
                onClick={domainpoh}
              >
                Generate your .poh domain
              </Button>
            )}
          </div>
          <br></br>
          {

            dataCW?.hash &&(
            <React.Fragment> <br></br><a target="_blank" href={`${props.chains.find(networkValue => chain.id === networkValue.id).blockExplorers.default.url.replace("type", "tx").replace("valuex", dataCW.hash)}`}>Hash</a></React.Fragment>
            )
          }
          <Container sx={{ m: -6 ,py: 8 }} maxWidth="md">
            {isSuccessWT && (
              <div>
                You have successfully obtained your domain!
                <div>
                  <a href={`${dataCW?.hash}`}>Hash</a>
                </div>
              </div>
            )}
            {(isPrepareError || isErrorCW) && (
              <div>Error: {(prepareError || errorCW)?.message}</div>
            )}
                  {visibleItem ? (
                    <>
                      <img
                        src={imagex}
                        style={{
                          width: "228px",
                          height: "228px",
                          margin: "5 auto",
                        }}
                      ></img>
                    </>
                  ) : (
                    <></>
                  )}
          </Container>
        </React.Fragment>
      </div>
    </Box>
    </MyContextProvider>
  );
};

export default Domains;
