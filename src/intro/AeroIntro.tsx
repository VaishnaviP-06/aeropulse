import {useEffect, useRef} from "react";

import clouds from "./assets/clouds.png";
import aircraft from "./assets/aircraft.png";

import "./AeroIntro.css";

import {
 createIntroTimeline
} from "./IntroTimeline";



interface Props{

 onFinish:()=>void;

}



export default function AeroIntro({
 onFinish
}:Props){


const aircraftRef =
useRef<HTMLImageElement>(null);


const flashRef =
useRef<HTMLDivElement>(null);


const logoRef =
useRef<HTMLDivElement>(null);



useEffect(()=>{


const timeline =
createIntroTimeline(
{
 aircraft:aircraftRef,
 flash:flashRef,
 logo:logoRef
},

onFinish

);


return ()=>{

 timeline.kill();

}


},[]);



return(

<div className="aero-intro">


<img

src={clouds}

className="aero-clouds"

/>



<img

ref={aircraftRef}

src={aircraft}

className="aero-aircraft"

/>



<div

ref={flashRef}

className="aero-flash"

/>



<div

ref={logoRef}

className="aero-logo"

>

AeroPulse

</div>



</div>


)

}