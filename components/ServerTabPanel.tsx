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


type ServerTabPanelProps = {
  server : ServerProperties,
  refreshData : Function,
  children:any,
  value:any
}


export default function ServerTabPanel({server , refreshData , children,value} : ServerTabPanelProps) {  

  const [users,setUsers] = useState([]);
  const [chargeDialogOpen,setChargeDialogOpen] = useState(false);
  const [dialogRow,setDialogRow] = useState<UserProperties | null>(null);

  useEffect(()=>{
    refreshServerPanel()
  },[])

  const refreshServerPanel = ()=>{
    serverApi(server.ip).get('/users').then(res=>{
      setUsers(res.data.map((user : UserProperties)=>{
        user["id"] = user["_id"];
        delete user._id;
        return user;
      }))
    }).catch(err=>{console.log(err)});
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


