import { useState } from "react";
import Modal from "./Modal";

function ListHeader({listName}) {
  const [showModal, setShowModal] = useState(false);

  const signOut = (e) => {
    console.log(e.target.textContent);
  }
  
  return (
      <div className='list-header'>
        <h1>{listName}</h1>
        <div className='button-container'>
          <button className='create' onClick={() => setShowModal(true)}>ADD NEW</button>
          <button className='signout' onClick={(e)=>signOut(e)}>SIGN OUT</button>
        </div>
          {showModal && <Modal mode={'create'} setShowModal={setShowModal}/>}
      </div>
    );
  }

  export default ListHeader;
  