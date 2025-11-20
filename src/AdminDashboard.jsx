// AdminDashboard.jsx
// Painel Administrativo Completo

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, DollarSign, TrendingUp, CheckCircle, XCircle, AlertCircle, Plus, Edit, Trash2, LogOut } from 'lucide-react';
import { useBookings, useServices, useProfessionals } from './hooks';
import { supabase, signOut, getCurrentUser } from './supabaseClient';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    todayBookings: 0,
    pendingBookings: 0,
    monthRevenue: 0,
    completedThisMonth: 0
  });

  const { bookings, fetchBookings, confirmBooking, cancelBooking, completeBooking } = useBookings();
  const { services, fetchServices, createService, updateService, deleteService } = useServices();
  const { professionals, fetchProfessionals, createProfessional, updateProfessional } = useProfessionals();

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.user_metadata?.role !== 'admin') {
      window.location.href = '/admin/login';
      return;
    }
    setUser(currentUser);
  };

  const loadStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Buscar estatísticas
    const { data: todayData } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', today);

    const { data: pendingData } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'pending');

    const { data: monthData } = await supabase
      .from('bookings_detailed')
      .select('service_price')
      .eq('status', 'completed')
      .gte('booking_date', monthStart);

    const monthRevenue = monthData?.reduce((sum, b) => sum + (parseFloat(b.service_price) || 0), 0) || 0;

    setStats({
      todayBookings: todayData?.length || 0,
      pendingBookings: pendingData?.length || 0,
      monthRevenue: monthRevenue,
      completedThisMonth: monthData?.length || 0
    });
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  // ========== DASHBOARD TAB ==========
  const DashboardTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">{stats.todayBookings}</span>
          </div>
          <p className="text-gray-600">Marcações Hoje</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">{stats.pendingBookings}</span>
          </div>
          <p className="text-gray-600">Pendentes</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">€{stats.monthRevenue.toFixed(2)}</span>
          </div>
          <p className="text-gray-600">Receita do Mês</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">{stats.completedThisMonth}</span>
          </div>
          <p className="text-gray-600">Completas no Mês</p>
        </div>
      </div>

      {/* Próximas Marcações */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Próximas Marcações</h3>
        <div className="space-y-4">
          {bookings.slice(0, 5).map(booking => (
            <div key={booking.id} className="border-l-4 border-pink-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{booking.client_name}</p>
                  <p className="text-sm text-gray-600">{booking.service_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.booking_date).toLocaleDateString('pt-PT')} às {booking.start_time}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => confirmBooking(booking.id)}
                        className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => cancelBooking(booking.id, 'Cancelado pelo admin')}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ========== BOOKINGS TAB ==========
  const BookingsTab = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
      const filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterDate) filters.date = filterDate;
      fetchBookings(filters);
    }, [filterStatus, filterDate]);

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Marcações</h2>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Completo</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Data</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profissional</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{booking.client_name}</p>
                      <p className="text-sm text-gray-500">{booking.client_phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{booking.service_name}</td>
                  <td className="px-6 py-4">{booking.professional_name}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p>{new Date(booking.booking_date).toLocaleDateString('pt-PT')}</p>
                      <p className="text-sm text-gray-500">{booking.start_time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => confirmBooking(booking.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Confirmar"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => completeBooking(booking.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Completar"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => cancelBooking(booking.id, 'Cancelado')}
                        className="text-red-600 hover:text-red-800"
                        title="Cancelar"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ========== SERVICES TAB ==========
  const ServicesTab = () => {
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      duration: 60,
      price: 0,
      category: 'Cabelo'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await createService(formData);
      }
      setEditingService(null);
      setFormData({ name: '', description: '', duration: 60, price: 0, category: 'Cabelo' });
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Serviços</h2>
          <button
            onClick={() => setEditingService({})}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Novo Serviço
          </button>
        </div>

        {/* Form */}
        {editingService !== null && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingService.id ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Cabelo">Cabelo</option>
                  <option value="Nails">Nails</option>
                  <option value="Estética">Estética</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duração (minutos)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preço (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2 flex space-x-2">
                <button type="submit" className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.category}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setFormData(service);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-500">{service.duration} min</span>
                <span className="text-lg font-bold text-pink-600">
                  {service.price ? `€${service.price}` : 'Sob consulta'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ========== PROFESSIONALS TAB ==========
  const ProfessionalsTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-6">Profissionais</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map(pro => (
          <div key={pro.id} className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-lg mb-2">{pro.name}</h3>
            <p className="text-pink-600 text-sm mb-2">{pro.specialty}</p>
            <p className="text-gray-600 text-sm mb-4">{pro.bio}</p>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Serviços:</p>
              <div className="flex flex-wrap gap-2">
                {pro.professional_services?.map(ps => (
                  <span key={ps.service_id} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                    {ps.services?.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold text-pink-600">Admin Panel</h1>
          <p className="text-sm text-gray-600">Bárbara Lacerda</p>
        </div>
        <nav className="px-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${
              activeTab === 'dashboard' ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${
              activeTab === 'bookings' ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
            }`}
          >
            Marcações
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${
              activeTab === 'services' ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
            }`}
          >
            Serviços
          </button>
          <button
            onClick={() => setActiveTab('professionals')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${
              activeTab === 'professionals' ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
            }`}
          >
            Profissionais
          </button>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            <LogOut size={20} className="mr-2" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'bookings' && <BookingsTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'professionals' && <ProfessionalsTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;