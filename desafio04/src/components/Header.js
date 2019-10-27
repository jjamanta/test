import React, { Component } from 'react';

import './Header.css';

class Header extends Component {
  render() {
    return (
      <div className='clsHeader'>
        <label className='clsHeader1'>facebook</label>
        <label className='clsHeader2'>Meu perfil</label>
        <img src=""></img>
        <br />
        <br />
      </div>
    )
  }
}

export default Header;