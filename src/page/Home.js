import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MintPOH from "../MintPOH";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function Home(props) {
  const navigate = useNavigate();
  const mintBadge = () => {
    navigate("/domains");
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 4,
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Proof of Help
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
            >
              Welcome to our platform for tracking your impact as a volunteer,
              mentor or assistant!
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
            >
              Unlike social networks, where you may lose track of the support
              you have given if you delete your account or are censored, our
              platform ensures that your contributions are securely recorded and
              available for future reference.{" "}
            </Typography>
            <Container sx={{ py: 3 }} maxWidth="md">
              <Typography
                component="h3"
                variant="h8"
                align="center"
                color="text.primary"
                sx={{
                  bgcolor: "background.paper",
                  m: 2,
                }}
                gutterBottom
              >
                You can give any badge to your friend in most easy way!
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                <Grid item key={1} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Step 1
                      </Typography>
                      <Typography>
                        First you need to connect your wallet to MetaMask
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item key={2} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Step 2
                      </Typography>
                      <Typography>
                        Enjoy the great experience with your friends.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </Container>
          <MintPOH chains={props.chains} />
          <Container sx={{ py: 4 }} maxWidth="md">
            {/* End hero unit */}
            <Typography
              component="h3"
              variant="h8"
              align="center"
              color="text.primary"
              sx={{
                bgcolor: "background.paper",
                m: 2,
              }}
              gutterBottom
            >
              You can mint nfts for your organization!
            </Typography>
            <Grid container spacing={4}>
              <Grid item key={1} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Step 1
                    </Typography>
                    <Typography>First you need your .POH domain</Typography>
                  </CardContent>
                  <Button variant="contained" onClick={mintBadge}>
                    Get your domain
                  </Button>
                </Card>
              </Grid>
              <Grid item key={2} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Step 2
                    </Typography>
                    <Typography>
                      You need to make a request in the below button to obtain
                      your personalized contract
                    </Typography>
                  </CardContent>
                  <Button variant="contained" onClick={mintBadge}>
                    Make a request
                  </Button>
                </Card>
              </Grid>
              <Grid item key={3} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Step 3
                    </Typography>
                    <Typography>
                      Enjoy minting badges to your colleagues :)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </main>
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer"></Box>
    </ThemeProvider>
  );
}
