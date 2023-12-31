import { useState } from "react";
import { useCookies} from "react-cookie"

function Auth() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogIn, setIsLogIn] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  
  const ViewLogin = (status) =>{
    setError(null);
    setIsLogIn(status);
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogIn && password !== confirmPassword) {
      setError('Make sure passwords match!');
      return;
    }

    const response = await fetch (`${process.env.REACT_APP_SERVERURL_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });

    const data = await response.json();
    
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie('Email', data.email);
      setCookie('AuthToken', data.token);

      window.location.reload();
    }


  }

    return (
      <div className="auth-container" >
        <div className="auth-container-box">
          <form>
            <h2>{isLogIn ? 'Please log in' : 'Please sign up'}</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            {!isLogIn && <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)}/>}
            <input type="submit" className="create" onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}/>
            {error && <p>{error}</p>}
          </form>
          <div className="auth-options">
            <button onClick={() => ViewLogin(false)} style={{backgroundColor : !isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}>Sign Up</button>
            <button onClick={() => ViewLogin(true)} style={{backgroundColor : isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}>Login</button>
          </div>
        </div> 
      </div>
    );
  }
  
  export default Auth;
  