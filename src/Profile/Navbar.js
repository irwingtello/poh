import React, { useEffect, useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import blue from "@mui/material/colors/blue";
import { purple } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ethers, getDefaultAccount } from "ethers";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";

import {
  useAccount,
  useConnect,
  useDisconnect,
  usePrepareContractWrite,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../MyContextProvider";
const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});
function Navbar(props) {
  const navigate = useNavigate();
  const { ethereum } = window;
  const { state, dispatch } = useContext(MyContext);
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const [check, setCheck] = useState(false);
  // Create a stateful variable to store the network next to all the others
  const [network, setNetwork] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [defaultAccount, setDefaultAccount] = useState(null);
  useEffect(() => {}, [defaultAccount]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const mintBadge = () => {
    navigate("/badges");
  };
  useEffect(() => {
    dispatch({ type: "SET_VALUE", payload: false });
  }, [address]);
  const home = async () => {
    navigate("/");
  };
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Toolbar
            sx={{ flexWrap: "wrap", background: "#205295", textColor: "#" }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1 }}
              color="secondary"
            >
              <Link onClick={home}>Proof of Help</Link>
            </Typography>

            {props.isConnected == true ? (
              <React.Fragment>
                <Link
                  variant="button"
                  color="secondary"
                  onClick={() => {
                    if (chain) {
                      if (
                        props.chains.find(
                          (networkValue) => chain.id === networkValue.id
                        )
                      ) {
                        let explorer = props.chains
                          .find((networkValue) => chain.id === networkValue.id)
                          .blockExplorers.default.url.replace("type", "address")
                          .replace("valuex", address);
                        window.open(explorer, "_blank");
                      }
                    }
                  }}
                  sx={{ my: 1, mx: 1.5 }}
                >
                  {address}
                </Link>
                <Link
                  variant="button"
                  color="secondary"
                  sx={{ my: 1, mx: 1.5 }}
                >
                  {props.chains.some((networkValue) => {
                    props.chains.find((chainx) => chain.id === networkValue.id);
                  })}
                  {chain
                    ? props.chains.find(
                        (networkValue) => chain.id === networkValue.id
                      )
                      ? "Connected to:" + chain.network
                      : "Network not supported"
                    : "Chain is undefined"}
                </Link>
                  <React.Fragment>
                    <Button
                      id="basic-button"
                      variant="outlined"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      Dashboard
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={mintBadge}>My Badges</MenuItem>
                    </Menu>
                  </React.Fragment>

                <Button
                  onClick={disconnect}
                  variant="outlined"
                  sx={{ my: 1, mx: 1.5 }}
                >
                  Disconnect
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {connectors.map((connector) => (
                  <Button
                    disabled={!connector.ready}
                    key={connector.id}
                    variant="outlined"
                    onClick={() => connect({ connector })}
                  >
                    Connect: {connector.name}
                    {!connector.ready && " (unsupported)"}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      " (connecting)"}
                  </Button>
                ))}
              </React.Fragment>
            )}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </React.Fragment>
  );
}
export default Navbar;
