import React from "react";
import "./Home.css";
import { Box } from "@mui/system";

const Cards = () => {
  return (
    <div className="container">
      <div className="card , izquierda">
        <div class="header"></div>
        <div class="info">
          <p class="title">How to make this material card ?</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia, molestiae quas vel sint commodi.{" "}
          </p>
        </div>
        <div class="footer">
          <button type="button" class="action">
            Get started{" "}
          </button>
        </div>
      </div>

      <div className="card , centro">
        <div class="header"></div>
        <div class="info">
          <p class="title">How to make this material card ?</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia, molestiae quas vel sint commodi.{" "}
          </p>
        </div>
        <div class="footer">
          <button type="button" class="action">
            Get started{" "}
          </button>
        </div>
      </div>

      <div className="card , derecha">
        <div class="header"></div>
        <div class="info">
          <p class="title">How to make this material card ?</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia, molestiae quas vel sint commodi.{" "}
          </p>
        </div>
        <div class="footer">
          <button type="button" class="action">
            Get started{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
