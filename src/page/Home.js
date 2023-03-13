import React from "react";
import "./Home.css";

import Cards from "./Cards";

const Home = () => {
  return (
    <div>
      <div>
        <h1 className="h1">What is POH? </h1>

        <div className="container2">
          <div align="justify">
            <p align="justify" className="text">
              Platform to keep track of the volunteering/assistance/mentoring
              impact a person has had on FEVM.
            </p>
            <p align="justify" className="text">
              The impact this platform will have is that it will be able to
              validate the real impact a person is having,
            </p>
            <p align="justify" className="text">
              to have a real metric outside of centralized services (Twitter
              Reactions,Youtube Reactions, etc).
            </p>
            <p align="justify" className="text">
              Currently, if you delete your social network, you lose track of
              the support you have given or if you are censored.
            </p>
          </div>
        </div>
      </div>

      <Cards />
    </div>
  );
};

export default Home;
