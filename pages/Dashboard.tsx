import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  CreditCard, Layers, ArrowUpRight,
  Kanban, Calendar, CheckCircle2, Image as ImageIcon,
  Instagram, Linkedin, Facebook, Twitter, RotateCcw, Check, UserCircle, Save, Building, User, MoreHorizontal
} from 'lucide-react';
import { UserSubscription, Invoice, PipelinePost, PipelineStatus, UserProfile } from '../types';

// Mock Data
const mockInvoices: Invoice[] = [
  { id: 'INV-2023-001', date: '2023-10-01', amount: 15000, status: 'Paid', service: 'Spark Package' },
  { id: 'INV-2023-002', date: '2023-11-01', amount: 15000, status: 'Paid', service: 'Spark Package' },
  { id: 'INV-2023-003', date: '2023-12-01', amount: 30000, status: 'Pending', service: 'Radiance Package' },
];

const mockSubscriptions: UserSubscription[] = [
  { id: 'SUB-123', packageName: 'Radiance Package', startDate: '2023-10-01', renewalDate: '2024-01-01', status: 'Active' },
  { id: 'SUB-456', packageName: 'SEO Maintenance', startDate: '2023-10-01', renewalDate: '2024-10-01', status: 'Active' }
];

const initialPipelinePosts: PipelinePost[] = [
  { id: 'post-1', title: 'Diwali Festival Promo', platform: 'instagram', status: 'backlog', dueDate: '2023-11-10' },
  { id: 'post-2', title: 'CEO Quote Card', platform: 'linkedin', status: 'writing', dueDate: '2023-10-25' },
  { id: 'post-3', title: 'Product Teaser Video', platform: 'instagram', status: 'design', dueDate: '2023-10-28', thumbnail: 'https://picsum.photos/id/20/200/200' },
  { id: 'post-4', title: '5 Tips for SEO', platform: 'twitter', status: 'review', dueDate: '2023-10-26' },
  { id: 'post-5', title: 'Weekend Special Reel', platform: 'instagram', status: 'approval', dueDate: '2023-10-27', thumbnail: 'https://picsum.photos/id/30/200/200', caption: "Get ready for the weekend with our special offer! #weekendvibes" },
  { id: 'post-6', title: 'Monday Motivation', platform: 'linkedin', status: 'scheduled', dueDate: '2023-10-30' },
  { id: 'post-7', title: 'Welcome to Tarviz', platform: 'facebook', status: 'posted', dueDate: '2023-10-01' },
];

const analyticsData = [
  { name: 'Week 1', reach: 4000, engagement: 2400 },
  { name: 'Week 2', reach: 3000, engagement: 1398 },
  { name: 'Week 3', reach: 9800, engagement: 6800 },
  { name: 'Week 4', reach: 6500, engagement: 3908 },
];

const PIPELINE_COLUMNS: { id: PipelineStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'border-slate-300' },
  { id: 'writing', label: 'Content Writing', color: 'border-blue-400' },
  { id: 'design', label: 'Design / Creative', color: 'border-purple-400' },
  { id: 'review', label: 'Internal Review', color: 'border-yellow-400' },
  { id: 'approval', label: 'Client Approval', color: 'border-orange-500' },
  { id: 'scheduled', label: 'Scheduled', color: 'border-emerald-500' },
  { id: 'posted', label: 'Posted', color: 'border-slate-800' },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'pipeline' | 'profile'>('overview');
  const [pipelinePosts, setPipelinePosts] = useState<PipelinePost[]>(initialPipelinePosts);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  // Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    business: {
      name: 'TechSolutions Pvt Ltd',
      address: '42, Innovation Park, OMR, Chennai - 600096',
      gstin: '33AABCU9603R1Z2',
      hsn: '9983', // Added default HSN code
      email: 'info@tarvizdigimart.com',
      phone: '+91 74 7006 7003',
      whatsappConsent: true
    },
    contactPerson: {
      salutation: 'Mr',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'rajesh@techsolutions.com',
      phone: '+91 98400 54321',
      whatsappConsent: true
    }
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Kanban Handlers
  const handleDragStart = (e: React.DragEvent, postId: string) => {
    setDraggedPostId(postId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: PipelineStatus) => {
    e.preventDefault();
    if (!draggedPostId) return;

    setPipelinePosts(prev => prev.map(post => 
      post.id === draggedPostId ? { ...post, status } : post
    ));
    setDraggedPostId(null);
  };

  const handleApprovePost = (postId: string) => {
    setPipelinePosts(prev => prev.map(post => 
      post.id === postId ? { ...post, status: 'scheduled' } : post
    ));
  };

  const handleRequestChanges = (postId: string) => {
    const reason = prompt("Please enter feedback for the team:");
    if (reason) {
        setPipelinePosts(prev => prev.map(post => 
            post.id === postId ? { ...post, status: 'writing' } : post
        ));
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram size={14} className="text-pink-600" />;
      case 'linkedin': return <Linkedin size={14} className="text-blue-700" />;
      case 'twitter': return <Twitter size={14} className="text-sky-500" />;
      case 'facebook': return <Facebook size={14} className="text-blue-600" />;
      default: return <UserCircle size={14} />;
    }
  };

  const handleProfileChange = (section: 'business' | 'contactPerson', field: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveProfile = () => {
    setIsEditingProfile(false);
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-lg z-10 border-r border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Client Hub</h2>
          <p className="text-xs font-semibold text-[#FF6B6B] tracking-wider uppercase mt-1">Tarviz Digimart</p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {[
            { id: 'overview', icon: Layers, label: 'Overview' },
            { id: 'pipeline', icon: Kanban, label: 'Content Pipeline' },
            { id: 'billing', icon: CreditCard, label: 'Billing & Invoices' },
          ].map((item) => (
             <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white shadow-lg shadow-orange-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
          ))}
        </nav>

        {/* Bottom Profile Link */}
        <div className="p-4 border-t border-slate-100">
           <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
           >
              <UserCircle size={20} />
              <span className="font-medium">My Profile</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto overflow-x-hidden h-screen bg-slate-50">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-extrabold text-slate-800">Welcome back, {userProfile.contactPerson.firstName}</h1>
            
            {/* Active Subscriptions */}
            <div className="grid gap-6 md:grid-cols-2">
               {mockSubscriptions.map(sub => (
                 <div key={sub.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Layers size={64} className="text-[#6C5CE7]" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <p className="text-sm text-slate-500 font-medium">Current Plan</p>
                         <h3 className="text-xl font-bold text-slate-900">{sub.packageName}</h3>
                       </div>
                       <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                         {sub.status}
                       </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                       <span className="text-slate-500">Renews on {sub.renewalDate}</span>
                       <button className="text-[#6C5CE7] font-bold hover:text-[#FF6B6B] transition-colors flex items-center gap-1">
                          Manage <ArrowUpRight size={14} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>

            {/* Charts */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Performance Metrics</h3>
                  <p className="text-sm text-slate-500">Social media reach vs engagement</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 focus:ring-[#6C5CE7] focus:border-[#6C5CE7]">
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                </select>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                      cursor={{fill: '#f1f5f9'}}
                    />
                    <Bar dataKey="reach" fill="#6C5CE7" radius={[6, 6, 0, 0]} name="Reach" />
                    <Bar dataKey="engagement" fill="#FF6B6B" radius={[6, 6, 0, 0]} name="Engagement" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
           <div className="h-full flex flex-col animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h1 className="text-2xl font-bold text-slate-800">Content Pipeline</h1>
                   <p className="text-sm text-slate-500">Track your social media content from idea to live post.</p>
                </div>
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-500 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div> Client Action Required
                   </span>
                </div>
             </div>
             
             {/* Kanban Board Container */}
             <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex h-full gap-4 min-w-[1600px]">
                   {PIPELINE_COLUMNS.map(column => {
                      const posts = pipelinePosts.filter(p => p.status === column.id);
                      const isClientApproval = column.id === 'approval';
                      
                      return (
                         <div 
                            key={column.id}
                            className={`flex flex-col w-72 h-full rounded-2xl ${isClientApproval ? 'bg-orange-50/50' : 'bg-slate-100/50'} border-t-4 ${column.color}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                         >
                            <div className="p-3 border-b border-slate-200/50 flex justify-between items-center">
                               <h3 className={`font-bold text-sm ${isClientApproval ? 'text-orange-700' : 'text-slate-700'}`}>
                                  {column.label}
                               </h3>
                               <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-400 border border-slate-200">
                                  {posts.length}
                               </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                               {posts.length === 0 && (
                                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs italic">
                                     No posts
                                  </div>
                               )}
                               {posts.map(post => (
                                  <div
                                     key={post.id}
                                     draggable
                                     onDragStart={(e) => handleDragStart(e, post.id)}
                                     className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative"
                                  >
                                     <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                           <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600">
                                              {getPlatformIcon(post.platform)}
                                           </div>
                                           <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{post.id}</span>
                                        </div>
                                        {post.status === 'scheduled' && <CheckCircle2 size={16} className="text-emerald-500" />}
                                     </div>
                                     
                                     <h4 className="font-bold text-slate-800 text-sm mb-3 leading-snug">{post.title}</h4>
                                     
                                     {post.thumbnail && (
                                        <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-slate-100 relative">
                                            <img src={post.thumbnail} alt="preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                               <ImageIcon size={16} className="text-white" />
                                            </div>
                                        </div>
                                     )}

                                     <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                        <Calendar size={12} />
                                        <span>{post.dueDate}</span>
                                     </div>
                                     
                                     {/* Client Actions */}
                                     {isClientApproval && (
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                                           <button 
                                              onClick={() => handleRequestChanges(post.id)}
                                              className="flex-1 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1"
                                              title="Request Changes"
                                           >
                                              <RotateCcw size={12} /> Revise
                                           </button>
                                           <button 
                                              onClick={() => handleApprovePost(post.id)}
                                              className="flex-1 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center gap-1"
                                              title="Approve Post"
                                           >
                                              <Check size={12} /> Approve
                                           </button>
                                        </div>
                                     )}

                                     <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex -space-x-2">
                                           <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">JD</div>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={14} /></button>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
           </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-slate-800">Invoices & Billing</h1>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {mockInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{inv.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{inv.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{inv.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full ${
                          inv.status === 'Paid' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6C5CE7] hover:text-[#FF6B6B] font-medium cursor-pointer transition-colors">
                        Download PDF
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
           <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
              <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-slate-800">Account Profile</h1>
                 <button 
                  onClick={() => isEditingProfile ? saveProfile() : setIsEditingProfile(true)}
                  className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    isEditingProfile 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                 >
                    {isEditingProfile ? <><Save size={18} /> Save Changes</> : "Edit Profile"}
                 </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 {/* Business Details */}
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 bg-violet-50 text-[#6C5CE7] rounded-lg"><Building size={24} /></div>
                       <h3 className="text-lg font-bold text-slate-800">Business Details</h3>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={userProfile.business.name}
                            onChange={(e) => handleProfileChange('business', 'name', e.target.value)}
                            className="w-full mt-1 p-2 bg-slate-50 rounded-lg font-medium text-slate-800 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Address</label>
                          <textarea 
                            disabled={!isEditingProfile}
                            value={userProfile.business.address}
                            onChange={(e) => handleProfileChange('business', 'address', e.target.value)}
                            rows={3}
                            className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none resize-none"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">GSTIN</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={userProfile.business.gstin}
                            onChange={(e) => handleProfileChange('business', 'gstin', e.target.value)}
                            className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none font-mono"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">HSN / SAC Code</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={userProfile.business.hsn}
                            onChange={(e) => handleProfileChange('business', 'hsn', e.target.value)}
                            className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none font-mono"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Email</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={userProfile.business.email}
                            onChange={(e) => handleProfileChange('business', 'email', e.target.value)}
                            className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none"
                          />
                       </div>
                       <div className="flex items-center justify-between">
                         <div className="flex-1">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                             <input 
                                disabled={!isEditingProfile}
                                value={userProfile.business.phone}
                                onChange={(e) => handleProfileChange('business', 'phone', e.target.value)}
                                className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none"
                             />
                         </div>
                         <div className="ml-4 flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 font-bold mb-1">WHATSAPP</span>
                            <input 
                              type="checkbox"
                              disabled={!isEditingProfile}
                              checked={userProfile.business.whatsappConsent}
                              onChange={(e) => handleProfileChange('business', 'whatsappConsent', e.target.checked)}
                              className="w-5 h-5 accent-green-500"
                            />
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* Contact Person Details */}
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 bg-orange-50 text-[#FF6B6B] rounded-lg"><User size={24} /></div>
                       <h3 className="text-lg font-bold text-slate-800">Contact Person</h3>
                    </div>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          <div className="w-20">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salutation</label>
                             <select 
                               disabled={!isEditingProfile}
                               value={userProfile.contactPerson.salutation}
                               onChange={(e) => handleProfileChange('contactPerson', 'salutation', e.target.value)}
                               className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none disabled:appearance-none"
                             >
                               <option>Mr</option>
                               <option>Ms</option>
                               <option>Mrs</option>
                             </select>
                          </div>
                          <div className="flex-1">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                             <input 
                                disabled={!isEditingProfile}
                                value={userProfile.contactPerson.firstName}
                                onChange={(e) => handleProfileChange('contactPerson', 'firstName', e.target.value)}
                                className="w-full mt-1 p-2 bg-slate-50 rounded-lg font-bold text-slate-800 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none"
                             />
                          </div>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={userProfile.contactPerson.lastName}
                            onChange={(e) => handleProfileChange('contactPerson', 'lastName', e.target.value)}
                            className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Email</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={userProfile.contactPerson.email}
                            onChange={(e) => handleProfileChange('contactPerson', 'email', e.target.value)}
                            className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none"
                          />
                       </div>
                       <div className="flex items-center justify-between">
                         <div className="flex-1">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile</label>
                             <input 
                                disabled={!isEditingProfile}
                                value={userProfile.contactPerson.phone}
                                onChange={(e) => handleProfileChange('contactPerson', 'phone', e.target.value)}
                                className="w-full mt-1 p-2 bg-slate-50 rounded-lg text-slate-700 border border-transparent disabled:bg-transparent focus:border-[#6C5CE7] outline-none"
                             />
                         </div>
                         <div className="ml-4 flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 font-bold mb-1">WHATSAPP</span>
                            <input 
                              type="checkbox"
                              disabled={!isEditingProfile}
                              checked={userProfile.contactPerson.whatsappConsent}
                              onChange={(e) => handleProfileChange('contactPerson', 'whatsappConsent', e.target.checked)}
                              className="w-5 h-5 accent-green-500"
                            />
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;