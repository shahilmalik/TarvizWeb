import React, { useState } from 'react';
import { 
  Briefcase, Building, Plus, Search, Trash2, Edit2, Save, X, Landmark, CreditCard, FileText
} from 'lucide-react';
import { AdminServiceItem, AdminCompanyDetails } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'settings'>('services');

  // MOCK STATE - SERVICES
  const [services, setServices] = useState<AdminServiceItem[]>([
    { code: 'SRV-001', name: 'Social Media - Spark', description: 'Basic SMM package', price: 15000, category: 'SMM' },
    { code: 'SRV-002', name: 'Logo Design - Standard', description: '3 Concepts + Revisions', price: 5000, category: 'Graphic Design' },
  ]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<AdminServiceItem>>({
    name: '', description: '', price: 0, category: 'SMM'
  });

  // MOCK STATE - COMPANY
  const [companyDetails, setCompanyDetails] = useState<AdminCompanyDetails>({
    name: 'Tarviz Digimart',
    address: '123 Digital Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
    phone: '+91 74 7006 7003',
    email: 'info@tarvizdigimart.com',
    bankDetails: {
      accountName: 'Tarviz Digimart Pvt Ltd',
      bankName: 'HDFC Bank',
      accountNumber: '50200012345678',
      ifsc: 'HDFC0001234'
    },
    paymentModes: ['NEFT/IMPS', 'UPI', 'Cheque'],
    paymentTerms: ['50% Advance', 'Balance on Delivery', 'Net 15 Days']
  });

  // HANDLERS
  const handleAddService = () => {
    const code = `SRV-${Math.floor(1000 + Math.random() * 9000)}`;
    setServices([...services, { ...newService, code } as AdminServiceItem]);
    setIsServiceModalOpen(false);
    setNewService({ name: '', description: '', price: 0, category: 'SMM' });
  };

  const deleteService = (code: string) => {
    setServices(services.filter(s => s.code !== code));
  };

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (field: string, value: string) => {
    setCompanyDetails(prev => ({ 
      ...prev, 
      bankDetails: { ...prev.bankDetails, [field]: value } 
    }));
  };

  const addListItem = (list: 'paymentModes' | 'paymentTerms', value: string) => {
     if(!value) return;
     setCompanyDetails(prev => ({
        ...prev,
        [list]: [...prev[list], value]
     }));
  };

  const removeListItem = (list: 'paymentModes' | 'paymentTerms', index: number) => {
    setCompanyDetails(prev => ({
      ...prev,
      [list]: prev[list].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col">
         <div className="p-6">
            <h1 className="text-xl font-bold text-white">Tarviz<span className="text-[#FF6B6B]">Admin</span></h1>
            <p className="text-xs text-slate-400 mt-1">Internal Dashboard</p>
         </div>
         <nav className="flex-1 px-4 space-y-2">
            <button 
               onClick={() => setActiveTab('services')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'services' ? 'bg-[#FF6B6B] text-white' : 'text-slate-400 hover:bg-white/5'}`}
            >
               <Briefcase size={20} /> Services
            </button>
            <button 
               onClick={() => setActiveTab('settings')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-[#FF6B6B] text-white' : 'text-slate-400 hover:bg-white/5'}`}
            >
               <Building size={20} /> Company Profile
            </button>
         </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
         
         {/* SERVICES TAB */}
         {activeTab === 'services' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-800">Service Management</h2>
                  <button 
                     onClick={() => setIsServiceModalOpen(true)}
                     className="bg-[#0F172A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800"
                  >
                     <Plus size={18} /> Add Service
                  </button>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                           <th className="px-6 py-4 font-bold text-slate-600">Code</th>
                           <th className="px-6 py-4 font-bold text-slate-600">Category</th>
                           <th className="px-6 py-4 font-bold text-slate-600">Service Name</th>
                           <th className="px-6 py-4 font-bold text-slate-600">Reference Price</th>
                           <th className="px-6 py-4 font-bold text-slate-600">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {services.map(srv => (
                           <tr key={srv.code} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 font-mono text-xs text-slate-500">{srv.code}</td>
                              <td className="px-6 py-4">
                                 <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded-md text-xs font-bold uppercase">{srv.category}</span>
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-800">
                                 {srv.name}
                                 <div className="text-xs text-slate-400 font-normal">{srv.description}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-600">₹{srv.price}</td>
                              <td className="px-6 py-4">
                                 <button onClick={() => deleteService(srv.code)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* COMPANY SETTINGS TAB */}
         {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-8">
               <h2 className="text-2xl font-bold text-slate-800">Company Configuration</h2>
               
               {/* General Info */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Building size={20} className="text-[#FF6B6B]" /> Agency Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company Name</label>
                        <input value={companyDetails.name} onChange={(e) => handleCompanyChange('name', e.target.value)} className="w-full p-2 border rounded-lg" />
                     </div>
                     <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Address</label>
                        <textarea value={companyDetails.address} onChange={(e) => handleCompanyChange('address', e.target.value)} rows={2} className="w-full p-2 border rounded-lg" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                        <input value={companyDetails.phone} onChange={(e) => handleCompanyChange('phone', e.target.value)} className="w-full p-2 border rounded-lg" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Billing Email</label>
                        <input value={companyDetails.email} onChange={(e) => handleCompanyChange('email', e.target.value)} className="w-full p-2 border rounded-lg" />
                     </div>
                  </div>
               </div>

               {/* Bank Info */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Landmark size={20} className="text-[#6C5CE7]" /> Banking Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Name</label>
                        <input value={companyDetails.bankDetails.accountName} onChange={(e) => handleBankChange('accountName', e.target.value)} className="w-full p-2 border rounded-lg" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bank Name</label>
                        <input value={companyDetails.bankDetails.bankName} onChange={(e) => handleBankChange('bankName', e.target.value)} className="w-full p-2 border rounded-lg" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Account Number</label>
                        <input value={companyDetails.bankDetails.accountNumber} onChange={(e) => handleBankChange('accountNumber', e.target.value)} className="w-full p-2 border rounded-lg" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">IFSC Code</label>
                        <input value={companyDetails.bankDetails.ifsc} onChange={(e) => handleBankChange('ifsc', e.target.value)} className="w-full p-2 border rounded-lg" />
                     </div>
                  </div>
               </div>

               {/* Payment Config */}
               <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CreditCard size={20} className="text-emerald-500" /> Payment Modes
                     </h3>
                     <ul className="space-y-2 mb-4">
                        {companyDetails.paymentModes.map((mode, i) => (
                           <li key={i} className="flex justify-between bg-slate-50 p-2 rounded text-sm">
                              {mode} <button onClick={() => removeListItem('paymentModes', i)} className="text-red-400"><X size={14} /></button>
                           </li>
                        ))}
                     </ul>
                     <div className="flex gap-2">
                        <input id="newMode" placeholder="Add Mode" className="flex-1 p-2 border rounded-lg text-sm" />
                        <button onClick={() => {
                           const el = document.getElementById('newMode') as HTMLInputElement;
                           addListItem('paymentModes', el.value);
                           el.value = '';
                        }} className="bg-slate-800 text-white p-2 rounded-lg"><Plus size={16} /></button>
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-orange-500" /> Payment Terms
                     </h3>
                     <ul className="space-y-2 mb-4">
                        {companyDetails.paymentTerms.map((term, i) => (
                           <li key={i} className="flex justify-between bg-slate-50 p-2 rounded text-sm">
                              {term} <button onClick={() => removeListItem('paymentTerms', i)} className="text-red-400"><X size={14} /></button>
                           </li>
                        ))}
                     </ul>
                     <div className="flex gap-2">
                        <input id="newTerm" placeholder="Add Term" className="flex-1 p-2 border rounded-lg text-sm" />
                        <button onClick={() => {
                           const el = document.getElementById('newTerm') as HTMLInputElement;
                           addListItem('paymentTerms', el.value);
                           el.value = '';
                        }} className="bg-slate-800 text-white p-2 rounded-lg"><Plus size={16} /></button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </main>

      {/* Add Service Modal */}
      {isServiceModalOpen && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md">
               <h3 className="text-xl font-bold mb-4">Add New Service</h3>
               <div className="space-y-4">
                  <input 
                     placeholder="Service Name" 
                     className="w-full p-3 border rounded-lg"
                     value={newService.name}
                     onChange={e => setNewService({...newService, name: e.target.value})}
                  />
                  <input 
                     placeholder="Description" 
                     className="w-full p-3 border rounded-lg"
                     value={newService.description}
                     onChange={e => setNewService({...newService, description: e.target.value})}
                  />
                  <select 
                     className="w-full p-3 border rounded-lg"
                     value={newService.category}
                     onChange={e => setNewService({...newService, category: e.target.value})}
                  >
                     <option>SMM</option>
                     <option>Graphic Design</option>
                     <option>Web Dev</option>
                     <option>SEO</option>
                     <option>E-commerce</option>
                  </select>
                  <input 
                     type="number"
                     placeholder="Reference Price" 
                     className="w-full p-3 border rounded-lg"
                     value={newService.price || ''}
                     onChange={e => setNewService({...newService, price: Number(e.target.value)})}
                  />
                  <div className="flex gap-2 mt-4">
                     <button onClick={handleAddService} className="flex-1 bg-violet-600 text-white py-3 rounded-lg font-bold">Add Service</button>
                     <button onClick={() => setIsServiceModalOpen(false)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-bold">Cancel</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminDashboard;