function ListHeader({listName}) {

  const signOut = (e) => {
    console.log(e.target.textContent);
  }
  
  return (
      <div className='list-header'>
        <h1>{listName}</h1>
        <div className='button-container'>
          <button className='create'>ADD NEW</button>
          <button className='signout' onClick={(e)=>signOut(e)}>SIGN OUT</button>

        </div>
      </div>
    );
  }

  export default ListHeader;
  