import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { ServerProperties } from '../types';
import { palette } from '../styles/theme';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import { IconButton } from '@mui/material';
import AddServerDialog from './AddServerDialog';
import { Button } from '@material-ui/core';
import ServerTabPanel from './ServerTabPanel';
import panelApi from '../lib/panelApi'

type ServerTabsProps = {
  servers : ServerProperties[],
  refreshData : Function
}
const CustomTabList = styled(TabList)({
  '& .MuiTabs-indicator': {
    backgroundColor: palette.primary.main,
  },
});
const CustomTab = styled((props : any) => <Tab {...props} />)(
  ({ theme }) => {
    return {
      color: alpha(palette.primary.main, 0.65),
      '&:hover': {
        color: alpha(palette.primary.main, 0.85),
        opacity: 1,
      },
      '&.Mui-selected': {
        color: palette.primary.main
      },
      '&.Mui-focusVisible': {
        backgroundColor: palette.primary.main,
      },
    }
  },
);

const StyledIconButton = styled(IconButton)({
  color : palette.primary.main,
  margin : "0 0.5em"
});

export default function ServerTabs({servers , refreshData} : ServerTabsProps) {
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);

  React.useEffect(()=>{
    console.log(servers);
    setValue(servers.length > 0 ? servers[0]._id : '');
  },[servers]);

  React.useEffect(()=>{
    console.log(value);
  },[value]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const DeleteServer = (server : ServerProperties) =>{
    panelApi.post('/api/servers/delete',{_id:server._id.toString()}).then(res=>{
      localStorage.removeItem(server.ip);
      refreshData();
    }).catch(err=>{
      console.log('Request failed', err);
    });
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
        <Box sx={{ width: '100%' , display : 'flex' , justifyContent:"center" }}>
          <StyledIconButton onClick={()=>setOpen(true)}><AddIcon/></StyledIconButton>
          <CustomTabList
            variant="scrollable"
            onChange={handleChange}>
            {servers.map(s=><CustomTab key={s._id} label={s.name} value={s._id} />)}
          </CustomTabList>
        </Box>
        {servers.map(s=><ServerTabPanel key={s._id} value={s._id} server={s} refreshData={refreshData}>
          <Button style={{marginTop:'2em'}} variant='text' onClick={()=>DeleteServer(s)}>Delete Server From List</Button>
        </ServerTabPanel>)}
      </TabContext>

      <AddServerDialog setOpen={setOpen} open={open} refreshData={refreshData} />

    </Box>
  );
}




