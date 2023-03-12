const { ObjectId } = require('mongodb');

export type ServerProperties = {
    _id : typeof ObjectId,
    name : string,
    ip : string
}

export type UserProperties = {
    _id? : string,
    id? : string,
    name : string,
    disabled : boolean,
    org_id : string,
    org_name : string,
    expire_date : string,
    creation_date : string,
    server_id : string,
    server_name : string,
    checkEnabled : boolean
}

export type Error = {
    error: string
}