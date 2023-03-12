import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import panelApi from '../lib/panelApi';
import { Typography } from '@material-ui/core';
import serverApi from '../lib/serverApi'

type AddServerDialogProps = {
    open : boolean,
    setOpen : Function,
    refreshData : Function
}

export default function AddServerDialog({open , setOpen , refreshData} : AddServerDialogProps) {
  const [serverName, setServerName] = React.useState<string|null>(null);
  const [serverNameError, setServerNameError] = React.useState<string|null>(null);
  const [serverIP, setServerIP] = React.useState<string|null>(null);
  const [serverIPError, setServerIPError] = React.useState<string|null>(null);


  const [userName,setUserName] = React.useState<string | null>(null);
  const [userNameError,setUserNameError] = React.useState<string | null>(null);
  const [password,setPassword] = React.useState<string | null>(null);
  const [passwordError,setPasswordError] = React.useState<string | null>(null);
  const [apiError,setApiError] = React.useState<string | null>(null);


  const userNameOnChange = (e : any)=>{
    setUserName(e.target.value);
    setUserNameError(null);
    setApiError(null);
  }

  const passwordOnChange = (e : any)=>{
    setPassword(e.target.value);
    setPasswordError(null);
    setApiError(null);
  }

  const onServerNameChange = (e : any)=>{
    setServerName(e.target.value);
    setServerNameError(null);
  }
  const onServerIPChange = (e : any)=>{
    setServerIP(e.target.value);
    setServerIPError(null);
  }

  const Validate = ()=>{
    let ok = true;
    if(!serverName || serverName.trim().length < 1){
        setServerNameError("Server name can't be empty");
        ok = false;
    }
    if(!serverIP || serverIP.trim().length < 1){
        setServerIPError("Server IP can't be empty");
        ok = false;
    }

    const regexExp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    if(serverIP && !regexExp.test(serverIP)){
        setServerIPError("Invalid IP");
        ok = false;
    }

    if(!userName || userName.trim().length < 1){
      setUserNameError("User Name can't be empty");
      ok = false;
    }
    if(!password || password.trim().length < 1){
        setPasswordError("Server IP can't be empty");
        ok = false;
    }

    if(!ok) return;

    if(serverIP){
      loginToServer(serverIP).then(()=>{
        panelApi.post('/api/servers/add',{
          name:serverName,
          ip:serverIP
        }).then(res=>{
          setServerName(null);
          setServerIP(null);
          setServerNameError(null);
          setServerIPError(null);
          setOpen(false);
          refreshData();
        }).catch(err=>{
          setServerName(null);
          setServerIP(null);
          setServerNameError(null);
          setServerIPError(null);
          setOpen(false);
          console.log('Request failed', err);
        })
      }).catch(err=>{
        setServerName(null);
          setServerIP(null);
          setServerNameError(null);
          setServerIPError(null);
          setOpen(false);
          console.log('Request failed', err);
      })
    }
  }

  const loginToServer = (ip:string)=>{
    return new Promise((resolve,reject)=>{
        serverApi(ip).post('/login',{
            userName : userName,
            password : password
        }).then(res=>{
            if(typeof res.data === 'object' && !Array.isArray(res.data) && res.data !== null){
                if(res.data.hasOwnProperty('Authorization') && res.data.hasOwnProperty('RefreshToken')){
                    localStorage.setItem(ip,JSON.stringify(res.data));
                    resolve(true);
                }else{
                    reject(false);
                }
            }else{
                reject(false);
            }
        }).catch(err=>reject(err));
    });
  }


  return (
    <div>
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Add Server</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth
            margin="dense" id="name"
            type="text" variant="standard"
            error={serverNameError !== null}
            label={serverNameError !== null ? serverNameError : "Name"}
            onChange={onServerNameChange}
          />
          <TextField
            fullWidth
            margin="dense" id="ip"
            type="text" variant="standard"
            error={serverIPError !== null}
            label={serverIPError !== null ? serverIPError : "IP Address"}
            onChange={onServerIPChange}
          />
          <Typography style={{marginTop:'1.5em'}} variant='subtitle1'>Please Enter Panel Login Credentials Again :</Typography>
          <TextField
              fullWidth
              margin="dense" id="userName"
              type="text" variant="standard"
              error={userNameError !== null}
              label={userNameError !== null ? userNameError : "User Name"}
              onChange={userNameOnChange}
          />
          <TextField
              fullWidth
              margin="dense" id="password"
              type="password" variant="standard"
              error={passwordError !== null}
              label={passwordError !== null ? passwordError : "Password"}
              onChange={passwordOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button onClick={Validate}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
