const Layout = ({children}) => {
  return (
    <div style={{width: '100%', display:'flex', justifyContent:'center'}}>
      {children}
    </div>
  )
}

export default Layout;