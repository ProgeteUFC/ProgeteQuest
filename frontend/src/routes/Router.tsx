import { Routes, Route } from 'react-router-dom'
import  SeuRanking  from '../pages/SeuRanking' 


export function Router() {
  return (

      <>
        <Routes>
            <Route path="/" element={<SeuRanking />} />
        </Routes>
      </>
  )
}