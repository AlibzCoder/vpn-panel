import React , {useEffect,useState} from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { ServerProperties, UserProperties } from '../types';
import { palette } from '../styles/theme';
import { TabPanel } from '@mui/lab';
import { Button } from '@mui/material';
import ChargeDialog from './ChargeDialog';
import serverApi from '../lib/serverApi'
import ReactSwitch from 'react-switch';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * 
 * <Box sx={{ display: 'flex' }}><CircularProgress /></Box>
 */


type ServerTabPanelProps = {
  server : ServerProperties,
  refreshData : Function,
  children:any,
  value:any
}
interface UsersCheckedList { [key: string | number]: boolean; }


export default function ServerTabPanel({server , refreshData , children,value} : ServerTabPanelProps) {  

  const [users,setUsers] = useState([]);
  const [chargeDialogOpen,setChargeDialogOpen] = useState(false);
  const [dialogRow,setDialogRow] = useState<UserProperties | null>(null);
  const [usersCheckedList , setUsersCheckedList] = useState<UsersCheckedList>({});
  const [usersCheckedListLoading , setUsersCheckedListLoading] = useState<UsersCheckedList>({});

  useEffect(()=>{
    refreshServerPanel()
  },[])
  useEffect(()=>{
    fillUsersCheckedList()
  },[users]);

  const refreshServerPanel = ()=>{
    serverApi(server.ip).get('/users').then(res=>{
      setUsers(res.data.map((user : UserProperties)=>{
        user["id"] = user["_id"];
        delete user._id;
        return user;
      }))
    }).catch(err=>{console.log(err)});
  }

  const fillUsersCheckedList = ()=>{
    setUsersCheckedList(users.reduce((obj : UsersCheckedList,v : UserProperties,i)=>{
      obj[v.id ? v.id : i] = v.checkEnabled;
      return obj;
    },{}));
    setUsersCheckedListLoading(users.reduce((obj : UsersCheckedList,v : UserProperties,i)=>{
      obj[v.id ? v.id : i] = false;
      return obj;
    },{}));
  }

  const _setUsersCheckedList = (id:string,val:boolean)=>{
    const t : UsersCheckedList = {};
    t[id] = val;
    setUsersCheckedList({...usersCheckedList,...t});
  }
  const _setUsersCheckedLoadingList = (id:string,val:boolean)=>{
    const t : UsersCheckedList = {};
    t[id] = val;
    setUsersCheckedListLoading({...usersCheckedListLoading,...t});
  }

  const columns: GridColDef[] = [
    { 
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return <Button variant='outlined' onClick={()=>{
          setDialogRow(params.row);
          setChargeDialogOpen(true);
        }}>Charge</Button>;
      }
    },
    { 
      field: "check_expire",
      headerName: "Check Expire",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return <ReactSwitch
          onChange={(checked)=>{
            _setUsersCheckedLoadingList(params.row.id,true);
            serverApi(server.ip).post('/setExpireCheckEnabled',{
              userId : params.row.id,
              checkEnabled : checked
            }).then(res=>{
              _setUsersCheckedLoadingList(params.row.id,false);
              _setUsersCheckedList(params.row.id,checked);
            }).catch(err=>{
              _setUsersCheckedLoadingList(params.row.id,false);
            });
          }}
          checked={usersCheckedList[params.row.id] ?? false}
          checkedIcon={<Box style={{display:'flex',justifyContent:"center",alignItems:"center",flexDirection: "column",height:"100%"}}> {usersCheckedListLoading[params.row.id] ? <CircularProgress size={20}  /> : <CheckIcon />} </Box>}
          uncheckedIcon={<Box style={{display:'flex',justifyContent:"center",alignItems:"center",flexDirection: "column",height:"100%"}}> {usersCheckedListLoading[params.row.id] ? <CircularProgress size={20} className="green-indicator" /> : <CloseIcon />} </Box>}/>;
      }
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'org_name', headerName: 'Org Name',width: 100},
    { field: 'server_name', headerName: 'Server Name',width: 125},
    { 
      field: 'expire_date', headerName: 'Expire Date',width: 175,type:'dateTime',
      valueGetter: (params: GridValueGetterParams) => new Date(params.row.expire_date).toLocaleString(),
    },
    { 
      field: 'creation_date', headerName: 'Creation Date',width: 175,type:'dateTime',
      valueGetter: (params: GridValueGetterParams) => new Date(params.row.creation_date).toLocaleString(),
      hide:true
    },
  ];

  return (
    <TabPanel value={value}>
      <div className="custom-data-grid">
        <DataGrid
          autoHeight
          rows={users}
          columns={columns}
          pageSize={30}
          rowsPerPageOptions={[30]}
          initialState={{
            sorting: {
              sortModel: [{ field: 'org_name', sort: 'asc' }],
            },
          }}
        />
        {children}
      </div>
      <ChargeDialog 
        open={chargeDialogOpen}
        setOpen={setChargeDialogOpen}
        refreshData={refreshData}
        refreshServerPanel={refreshServerPanel}
        server={server}
        user={dialogRow}
      />
    </TabPanel>
  );
}


