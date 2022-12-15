import { Container } from 'react-bootstrap'

import { FC } from 'react'

type IHeader = {
  title: string
}

const Header: FC<IHeader> = ({ title }) => {
  return (
    <div className="page-header">
      <Container>
        <h2 className=" mt-3 mb-3 page-title">Octo-{title}</h2>
      </Container>
    </div>
  )
}

export default Header
