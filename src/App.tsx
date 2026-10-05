import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell/AppShell'
import ServiceCenter from './pages/ServiceCenter'
import Qualification from './pages/Qualification'
import CustomsDocs from './pages/CustomsDocs'
import TaxDeclaration from './pages/TaxDeclaration'
import Inventory from './pages/Inventory'
import InvoiceForex from './pages/InvoiceForex'
import TaxRefundMatch from './pages/TaxRefundMatch'
import Expense from './pages/Expense'
import InventoryDisposal from './pages/InventoryDisposal'
import DemoReset from './components/DemoReset/DemoReset'

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<ServiceCenter />} />
          <Route path="/qualification" element={<Qualification />} />
          <Route path="/customs" element={<CustomsDocs />} />
          <Route path="/tax" element={<TaxDeclaration />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/invoice-forex" element={<InvoiceForex />} />
          <Route path="/refund" element={<TaxRefundMatch />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/disposal" element={<InventoryDisposal />} />
        </Route>
      </Routes>
      <DemoReset />
    </>
  )
}

export default App