import axios from "axios"


export const getAllUserFunction = async () => {
    const res = await axios.get("/api/user/getAllUsers");
    return res.data;
}