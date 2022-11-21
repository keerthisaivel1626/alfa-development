const BASE_URL = "https://alfa-api.collegify.com/api/v1/";
import axios from "axios";

export const POSTAPI = async (endPoint,postData={},token=null,type=null)=>{
   
    let url = BASE_URL + endPoint;
    let headersObj = {}
    if(token){
        
        headersObj = {
            'Authorization': `Bearer ${token}`
        }
    }
    if(type=='media'){
       
        headersObj = {
            ...headersObj,
            "Content-Type": "multipart/form-data",
        }
    }
    let response = await axios.post(url,postData,{ headers:headersObj });
   
    const { data, status, statusText } = response;
    return { data, status, statusText };
}

export const GETAPI = async (endPoint,token=null)=>{
    let url = BASE_URL + endPoint;
    let headersObj = {}
    if(token){
        headersObj = {
            'Authorization': `Bearer ${token}`
        }
    }
    let response = await axios.get(url,{ headers:headersObj });
    const { data, status, statusText } = response;
    return { data, status, statusText };
}


export const PATCHAPI = async (endPoint,postData={},token=null)=>{
    let url = BASE_URL + endPoint;
    let headersObj = {}
    if(token){
        headersObj = {
            'Authorization': `Bearer ${token}`
        }
    }
    let response = await axios.patch(url,postData,{ headers:headersObj });
    const { data, status, statusText } = response;
    return { data, status, statusText };
}

export const DELETEAPI = async (endPoint,token=null)=>{
    let url = BASE_URL + endPoint;
    let headersObj = {}
    if(token){
        headersObj = {
            'Authorization': `Bearer ${token}`
        }
    }
    let response = await axios.delete(url,{ headers:headersObj });
    const { data, status, statusText } = response;
    return { data, status, statusText };
}