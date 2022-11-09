import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ServerProperties, UserProperties } from '../types';
import serverApi from '../lib/serverApi'
import { IconButton } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {palette} from '../styles/theme';
type ChargeDialogProps = {
    server : ServerProperties,
    user : UserProperties | null,
    open : boolean,
    setOpen : Function,
    refreshData : Function,
    refreshServerPanel : Function
}
  

export default function ChargeDialog({server, user, open , setOpen , refreshData , refreshServerPanel} : ChargeDialogProps) {
  
  const [months,setMonths] = React.useState(1);
  React.useEffect(()=>{
    setMonths(1);
  },[open])

  const save = ()=>{
    if(user){
      serverApi(server.ip).post('/setExpire',{
        userId : user.id,
        date : calcDate(new Date(user.expire_date),months)
      }).then(res=>{
        refreshServerPanel();
        setOpen(false)
      }).catch(err=>{
        console.log(err);
        setOpen(false);
      });
    }
  }
  const calcDate = (date : Date,months:number)=>{
    const operator = months > 0 ? '+' : months < 0 ? '-' : null;
    const monthsCount = operator === '-' ? months * -1 : months;
    switch(operator){
        case '-':
            date.setMonth(date.getMonth() - monthsCount);
            break;
        case '+':
            date.setMonth(date.getMonth() + monthsCount);
            break;
    }
    return date;
  }

  return (
    <div>
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Charge {`"${user?user.name:null}"`} Account</DialogTitle>
        <DialogContent style={{padding:'1.5em'}}>
            
            <div style={{
              display:'flex',
              justifyContent:'space-evenly',
              alignItems:'center',
              margin:'0 0 1em 0'
            }}>
              <IconButton size="small" style={{backgroundColor:palette.primary.main,color:'white'}} onClick={()=>{if(months > -12) setMonths(months-1)}}><RemoveIcon/></IconButton>
              <h4>{months>0?'+':null}{months}</h4>
              <IconButton size="small" style={{backgroundColor:palette.primary.main,color:'white'}} onClick={()=>{if(months < 12) setMonths(months+1)}}><AddIcon/></IconButton>
            </div>

            {months !==0?<span>
                Go {months<0?months*-1:months} months {months > 0 ? "forward" : "back"}
            </span>: 'No change'}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}