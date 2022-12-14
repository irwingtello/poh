import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import blue from '@mui/material/colors/blue';
import { purple } from '@mui/material/colors';
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePrepareContractWrite,
  useNetwork, useSwitchNetwork
} from 'wagmi'
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
  const { ethereum } = window;
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =useConnect()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  useEffect(() => {
    // The function passed to useEffect will be called whenever the value of chain changes
    console.log('The value of chain has changed to:', chain);
  }, [chain]); // The second argument specifies the dependencies of the effect

  // Create a stateful variable to store the network next to all the others
  const [network, setNetwork] = useState('');
  return (
    <React.Fragment>
          <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' ,background: "#205295",textColor:"#"}}>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}  color="secondary">
            Proof of Help
          </Typography>
          <nav>
            <Link
              variant="button"
              color="secondary" 
              onClick={() => {
                window.open('https://explorer.glif.io/address/'+ address+  '/?network=wallabynet','_blank');
              }}
              sx={{ my: 1, mx: 1.5 }}
            >
              {address}
            </Link>
          </nav>
          
          {props.isConnected==true?
          
          <React.Fragment>
                        <Link
              variant="button"
              color="secondary"
              href="#"

              sx={{ my: 1, mx: 1.5 }}
            >
            Connected to {chain.network}
            </Link>
              <Button onClick={disconnect} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
              Disconnect
            </Button>
          </React.Fragment>:
          <React.Fragment>
      {connectors.map((connector) => (
             <Button
              disabled={!connector.ready}
              key={connector.id}
              variant="outlined"
              onClick={() => connect({ connector })}
            >
              Connect: {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
            </Button>
          ))}
            </React.Fragment>
          }
        </Toolbar>
      </AppBar>
      </ThemeProvider>
    </React.Fragment>
  );
}
export default Navbar;