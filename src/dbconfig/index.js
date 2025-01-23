import { connect } from "mongoose";

export default (()=>{
    const ConnectionUrl = process.env.DB
    try {
        connect(ConnectionUrl);
        console.log("DB connect");
    } catch (error) {
        console.log("Error to connect", error);
    }
})