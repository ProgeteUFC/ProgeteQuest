import { BrowserRouter, Routes, Route } from 'react-router-dom'

export function Router() {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
            <Route path="/" element={<CadastrarDisciplina />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  )
}