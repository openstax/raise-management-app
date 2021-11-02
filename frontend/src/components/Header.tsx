import styled from 'styled-components'
import Signout from './Signout'

const HeaderInner = styled.div.attrs({
  className: 'd-flex align-items-center justify-content-between w-80 mx-auto'
})`
  height: 80px;
`

const Header = (): JSX.Element => {
  return (
    <div className="shadow-sm mb-3">
      <HeaderInner>
        <span className="fs-4">RAISE Management Application</span>
        <Signout />
      </HeaderInner>
    </div>
  )
}

export default Header
