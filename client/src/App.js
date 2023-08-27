import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import Auth from './components/Auth';
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'



function App() {
  const [tasks, setTasks] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email;
  const AuthToken = cookies.AuthToken;

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL_BASE}/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=> {
    if (AuthToken) {
      getData();
    }} ,[])

  //Sort by date

  const sortedTasks = tasks?.sort((a,b) => new Date (a.data) - new Date (b.data))




  return (
    <div className = "app">

      {
        AuthToken ? 
        <>
          <ListHeader listName = {'Holiday List'} getData={getData}/>
          <p className='user-email'>Welcome back {userEmail}</p>
          {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData}/>)}
        </> 
        : 
        <Auth/>
      }
          <p className='copyright'>Creative coding LLC</p>


    </div>
  );
}

export default App;
