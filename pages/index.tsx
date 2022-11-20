import { Container, Typography } from '@material-ui/core'
import {ServerProperties} from '../types';
import ServerTabs from '../components/ServerTabs';
import { useRouter } from 'next/router';
import panelApi from '../lib/panelApi';

type HomeProps = {
  servers : ServerProperties[]
}

export default function Home({servers} : HomeProps) {
  const router = useRouter();
  
  const refreshData = () => {
    router.replace(router.asPath);
  }

  return (
    <div>
      <Container fixed style={{ padding : "2.5em 0" }}>
        {(servers && servers instanceof Array) ?
          <ServerTabs servers={servers} refreshData={refreshData} /> : <div></div>}
      </Container>
    </div>
  )
}

export async function getServerSideProps(context : any) {
  const token = context.req.cookies["Authorization"];
  const refresh = context.req.cookies["RefreshToken"];
  if(!token){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  let res = await fetch("http://142.132.184.24:3000/api/servers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "authorization" : token
    },
  });
  try{
    let servers = await res.json();  
    return {
      props: { servers : servers },
    };
  }catch(e){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }  
}
