import React from "react";

import ToolbarConnected from "./ToolbarConnected";
import ToolbarDisconnected from "./ToolbarDisconnected";


export default function Appbar(props: any) {

    return(
        <>
        {props.currentUser ? <ToolbarConnected currentUser={props.currentUser}/> : <ToolbarDisconnected />}  
        </>
    )
}