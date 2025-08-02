import { Routes, Route } from 'react-router-dom'
import  SeuRanking  from '../pages/SeuRanking' 
import { SuasDiscplinas } from '../pages/suasDisciplinas'

export function Router() {
  return (

      <>
        <Routes>
            <Route path="/" element={<SuasDiscplinas />} />
            <Route path="/ranking" element={<SeuRanking />} />
        </Routes>
      </>
  )
}