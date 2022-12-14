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

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ethers, getDefaultAccount } from "ethers";
import "./Resources/WalletCard.css";
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";
import QRCode from "qrcode";
import { background } from "./Resources/function.js";
import ABI from "./Resources/DomainsABI.json";
import {
  useAccount,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useContractWrite,
  useSendTransaction,
  useWaitForTransaction,
  ChainDoesNotSupportMulticallError,
} from "wagmi";
import { wallabyTestnet } from "./Chains.jsx";
var connected = false;

const WalletCard = ({ value }) => {
  const client = new NFTStorage({
    token: process.env.REACT_APP_NFTSTORAGE_TOKEN,
  });

  const [metadataX, setMetaDatax] = useState("");
  const [imagex, setImagex] = useState("");
  const [visibleItem, setVisibleItem] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [userDomin, setUserDomin] = useState("");
  const [enableProcess, setEnableProcess] = useState(0);
  const { address, isConnected } = useAccount();
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
  const theFlag = useMemo(() => {
    return userDomin !== "" && metadataX !== "";
  }, [userDomin, metadataX]);

  const {
    config,
    data: datax,
    isSuccess: isSuccessPrepare,
    error: prepareError,
    isPrepareError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.REACT_APP_SMART_CONTRACT_FIL,
    abi: ABI,
    functionName: "register",
    enabled: theFlag,
    args: [userDomin.replace(".poh", ""), metadataX],
    chainId:wallabyTestnet.id,
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

  const { data, error, isError, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
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
            {isLoading ? (
              "Generando..."
            ) : (
              <Button
                variant="contained"
                color="success"
                disabled={isLoading}
                className="buttonWallet"
                onClick={domainpoh}
              >
                Generate your .poh domain
              </Button>
            )}
          </div>
          <br></br>
          {

            data?.hash &&(
            <React.Fragment> <br></br><a target="_blank" href={`${wallabyTestnet.blockExplorers.default.url}/tx/${data?.hash}`}>Hash</a></React.Fragment>)
          }
          <Container sx={{ m: -6 ,py: 8 }} maxWidth="md">
            {isSuccess && (
              <div>
                You have successfully obtained your domain!
                <div>
                  <a href={`${data?.hash}`}>Hash</a>
                </div>
              </div>
            )}
            {(isPrepareError || isError) && (
              <div>Error: {(prepareError || error)?.message}</div>
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
  );
};

export default WalletCard;
