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
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
type ChargeDialogProps = {
    server : ServerProperties,
    user : UserProperties | null,
    open : boolean,
    setOpen : Function,
    refreshData : Function,
    refreshServerPanel : Function
}


const AmountTabPanel = (props : any)=>{
  const {
    chargeType,
    amount,
    setAmount,
    value,
    min,
    max,
    ...p} = props;
  return <TabPanel value={value} {...p}>
      <div style={{
          display:'flex',
          justifyContent:'space-evenly',
          alignItems:'center',
          margin:'0 0 1em 0'
        }}>
          <IconButton size="small" style={{backgroundColor:palette.primary.main,color:'white'}} onClick={()=>{if(amount > min) setAmount(amount-1)}}><RemoveIcon/></IconButton>
          <h4>{amount>0?'+':null}{amount}</h4>
          <IconButton size="small" style={{backgroundColor:palette.primary.main,color:'white'}} onClick={()=>{if(amount < max) setAmount(amount+1)}}><AddIcon/></IconButton>
        </div>

        {amount !==0?<span>
            Go {amount<0?amount*-1:amount} {chargeType} {amount > 0 ? "forward" : "back"}
        </span>: 'No change'}      
  </TabPanel>
}

export default function ChargeDialog({server, user, open , setOpen , refreshData , refreshServerPanel} : ChargeDialogProps) {
  
  const [chargeType,setChargeType] = React.useState("months");
  const [amount,setAmount] = React.useState(1);
  React.useEffect(()=>{setAmount(1);},[open])

  const save = ()=>{
    if(user){
      serverApi(server.ip).post('/setExpire',{
        userId : user.id,
        date : calcDate(new Date(user.expire_date),amount,chargeType)
      }).then(res=>{
        refreshServerPanel();
        setOpen(false)
      }).catch(err=>{
        console.log(err);
        setOpen(false);
      });
    }
  }
  const calcDate = (date : Date,amount:number,type:string)=>{
    const operator = amount > 0 ? '+' : amount < 0 ? '-' : null;
    const amountCount = operator === '-' ? amount * -1 : amount;
    switch(operator){
        case '-':
            switch(type){
              case "days":
                date.setDate(date.getDate() - amountCount);
                break;
              case "months":
                date.setMonth(date.getMonth() - amountCount);
                break;
            }
            break;
        case '+':
            switch(type){
              case "days":
                date.setDate(date.getDate() + amountCount);
                break;
              case "months":
                date.setMonth(date.getMonth() + amountCount);
                break;
            }
            break;
    }
    return date;
  }

  return (
    <div>
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Charge {`"${user?user.name:null}"`} Account</DialogTitle>
        <DialogContent style={{padding:'1.5em'}}>
            <TabContext value={chargeType}>
              <Box sx={{ width: '100%' , display : 'flex' , justifyContent:"center" }}>
                <TabList
                  variant="scrollable"
                  onChange={(event: React.SyntheticEvent, newValue: string) => {setChargeType(newValue);}}>
                  <Tab key="days" label="By Days" value="days" />
                  <Tab key="months" label="By Months" value="months" />
                </TabList>
              </Box>
              <AmountTabPanel 
                key="months"
                value="months"
                min={-12}
                max={12}
                chargeType={chargeType}
                amount={amount}
                setAmount={setAmount}/>
              <AmountTabPanel 
                key="days"
                value="days"
                min={-31}
                max={31}
                chargeType={chargeType}
                amount={amount}
                setAmount={setAmount}/>
            </TabContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}