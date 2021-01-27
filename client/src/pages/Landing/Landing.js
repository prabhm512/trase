import React, { Component } from "react";
import "./style.css";
import LandingJumbo from "../../components/LandingJumbo/LandingJumbo";
import BrandDescription from "../../components/BrandDescription/BrandDescription"

class Landing extends Component {
    render() {
        return (
            <div className="container-fluid p-0 m-0">
                <div className="d-flex justify-content-center backgroundImg">
                    <LandingJumbo />
                </div>     
                <BrandDescription />
            </div>
        );
    } 
}

export default Landing;