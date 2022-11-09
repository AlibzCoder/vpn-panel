import { Box, Button, Container, TextField, Typography } from '@material-ui/core'
import {Alert} from '@mui/lab';
import panelApi from '../lib/panelApi';
import serverApi from '../lib/serverApi'
import { useRouter } from 'next/router';
import { useState } from 'react';
import { setCookie } from 'cookies-next';

export default function Home() {
  const router = useRouter();

  const [userName,setUserName] = useState<string | null>(null);
  const [userNameError,setUserNameError] = useState<string | null>(null);
  const [password,setPassword] = useState<string | null>(null);
  const [passwordError,setPasswordError] = useState<string | null>(null);
  const [apiError,setApiError] = useState<string | null>(null);


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

  const login = ()=>{
    setApiError(null);
    let ok = true;
    if(!userName || userName.trim().length < 1){
        setUserNameError("User Name can't be empty");
        ok = false;
    }
    if(!password || password.trim().length < 1){
        setPasswordError("Server IP can't be empty");
        ok = false;
    }

    if(!ok) return;

    panelApi.post('/api/auth/login',{
        userName : userName,
        password : password
    }).then(res=>{
        if(typeof res.data === 'object' && !Array.isArray(res.data) && res.data !== null){
            if(res.data.hasOwnProperty('Authorization') && res.data.hasOwnProperty('RefreshToken')){
                setCookie("Authorization",res.data["Authorization"]);
                setCookie("RefreshToken",res.data["RefreshToken"]);
                getServersTokens()
                    .then(()=>router.push("/"))
                    .catch((err)=>{
                        console.log(err);
                        setApiError("Authentication Failed");
                    });
            }else{
                setApiError("Authentication Failed");
            }
        }else{
            setApiError("Authentication Failed");
        }
    }).catch(err=>{
        console.log(err);
        setApiError("Authentication Failed");
    });
  }

  const getServersTokens = () => {
    return new Promise((resolve,reject)=>{
        panelApi.get('/api/servers').then(async (res)=>{
            for(let i in res.data){
                const {ip} = res.data[i];
                try{
                    await loginToServer(ip);
                    resolve(true);
                }catch(err){
                    throw err;
                }
            }
        }).catch(err=>reject(err));
    })
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
      <Container fixed style={{
            width:'100%',
            height:'100vh',
            display:'flex',
            alignItems:'center',
            justifyContent:'center'}}>
        <Box style={{
            width:'350px',
            background:"#141414",
            borderRadius:'15px',
            padding:'1.5em 2em'
            }}>
            {apiError?<Alert severity="error">{apiError}</Alert>:null}
            <TextField
                style={{marginBottom:"1em"}}
                fullWidth
                margin="dense" id="userName"
                type="text" variant="standard"
                error={userNameError !== null}
                label={userNameError !== null ? userNameError : "User Name"}
                onChange={userNameOnChange}
            />
            <TextField
                style={{marginBottom:"2em"}}
                fullWidth
                margin="dense" id="password"
                type="password" variant="standard"
                error={passwordError !== null}
                label={passwordError !== null ? passwordError : "Password"}
                onChange={passwordOnChange}
            />
            <div style={{textAlign:'right'}}>
                <Button variant="text" onClick={login}>Login</Button>
            </div>
        </Box>
      </Container>
    </div>
  )
}