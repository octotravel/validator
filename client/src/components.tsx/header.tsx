import { Container } from 'react-bootstrap'

import { FC, useEffect } from 'react'

type IHeader = {
  title: string
}

const Header: FC<IHeader> = ({ title }) => {
  useEffect(() => {
    document.title = 'OCTO Validation Tool';
  }, []);
  return (
    <div className="page-header">
      <Container>
        <h2 className=" mt-3 mb-3 page-title">{title}</h2>
      </Container>
    </div>
  )
}

export default Header
