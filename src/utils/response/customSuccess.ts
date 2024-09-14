import {response, Response } from "express"

response.customSuccess = (httpStatusCode : number, message : string, data : any = null) : Response {
    return this.status(httpStatusCode).json([message, data]);
}

