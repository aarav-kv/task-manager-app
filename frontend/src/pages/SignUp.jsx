import { useState, useEffect } from "react"
import Lottie from "lottie-react";
import animationData from "../animations/animation.json";
const SignUp = () => {
    return (
        <>
            <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: "100px", height: "200px" }} />
            <a href="/">Home</a>
        </>
    )
}

export default SignUp