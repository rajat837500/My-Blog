import logo from '../../assets/logo.png'

function Logo({width = '100px', alt = 'Logo'}) {
  return (
    <img src={logo} alt={alt} width={width}/>
  )
}

export default Logo