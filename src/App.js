import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Facebook, Instagram, Menu, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookings, useServices, useProfessionals } from './hooks';

// COMPONENTE DO FORMULÁRIO ISOLADO - NÃO RE-RENDERIZA
const ClientInfoForm = memo(({ onSubmit, onBack, booking, isSubmitting }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Validação de email
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Validação de telefone português
  const validatePhone = useCallback((phone) => {
    const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');
    const phoneRegex = /^(\+351|351)?[9][0-9]{8}$/;
    return phoneRegex.test(cleanPhone);
  }, []);

  const handleEmailChange = useCallback((value) => {
    setEmail(value);
    if (value.trim() && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Email inválido' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  }, [validateEmail]);

  const handlePhoneChange = useCallback((value) => {
    setPhone(value);
    if (value.trim() && !validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: 'Telefone inválido. Use formato: +351 XXX XXX XXX' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  }, [validatePhone]);

  const handleSubmit = useCallback(() => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ name, phone, email, notes });
  }, [name, phone, email, notes, validateEmail, validatePhone, onSubmit]);

  const isValid = name.trim() && phone.trim() && email.trim() && 
                  validateEmail(email) && validatePhone(phone) && 
                  Object.keys(errors).length === 0;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">4. Seus Dados</h2>
      
      <div className="bg-pink-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">Resumo da Marcação:</h3>
        <p className="text-sm text-gray-700"><strong>Serviço:</strong> {booking.service?.name}</p>
        <p className="text-sm text-gray-700"><strong>Profissional:</strong> {booking.professional?.name}</p>
        <p className="text-sm text-gray-700"><strong>Data:</strong> {booking.date?.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p className="text-sm text-gray-700"><strong>Hora:</strong> {booking.time}</p>
        <p className="text-sm text-gray-700"><strong>Duração:</strong> {booking.service?.duration} minutos</p>
        <p className="text-sm text-gray-700"><strong>Preço:</strong> {booking.service?.price}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Nome Completo *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
              errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'
            }`}
            placeholder="Seu nome"
            autoComplete="name"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Telefone *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
              errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'
            }`}
            placeholder="+351 935 279 765"
            autoComplete="tel"
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          {!errors.phone && phone && <p className="text-green-600 text-sm mt-1">✓ Telefone válido</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
              errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'
            }`}
            placeholder="seu@email.com"
            autoComplete="email"
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          {!errors.email && email && <p className="text-green-600 text-sm mt-1">✓ Email válido</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Observações (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
            rows="3"
            placeholder="Alguma informação adicional..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={onBack}
          type="button"
          disabled={isSubmitting}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          type="button"
          className="flex-1 bg-gradient-to-r from-pink-400 to-pink-600 text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'A processar...' : 'Confirmar Marcação'}
        </button>
      </div>
    </div>
  );
});

ClientInfoForm.displayName = 'ClientInfoForm';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks do Supabase
  const { services, loading: servicesLoading } = useServices();
  const { professionals, loading: professionalsLoading } = useProfessionals();
  const { createBooking } = useBookings();

  const generateTimeSlots = useCallback(() => {
    const slots = [];
    const startHour = 10;
    const endHour = 19;
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour - 1 || hour === startHour) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  }, []);

  const generateCalendar = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isAvailable = date >= today && date.getDay() !== 0 && date.getDay() !== 1;
      days.push({ day, date, isAvailable });
    }
    return days;
  }, [currentMonth]);

  const calculateEndTime = useCallback((startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  }, []);

  const handleClientInfoSubmit = useCallback(async (clientInfo) => {
    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Calcular hora de fim baseada na duração do serviço
      const endTime = calculateEndTime(selectedTime, selectedService.duration);

      // Formatar data no formato YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];

      // Preparar dados da marcação
      const bookingData = {
        name: clientInfo.name,
        email: clientInfo.email,
        phone: clientInfo.phone,
        clientNotes: clientInfo.notes,
        notes: clientInfo.notes,
        professionalId: selectedProfessional.id,
        serviceId: selectedService.id,
        date: formattedDate,
        startTime: selectedTime,
        endTime: endTime
      };

      console.log('Enviando marcação:', bookingData);

      // Criar marcação no Supabase
      const result = await createBooking(bookingData);

      if (result.success) {
        console.log('Marcação criada com sucesso:', result.data);
        setBookingSuccess(true);
        
        // Reset após 3 segundos
        setTimeout(() => {
          setBookingSuccess(false);
          setBookingStep(1);
          setSelectedService(null);
          setSelectedProfessional(null);
          setSelectedDate(null);
          setSelectedTime(null);
          setCurrentPage('home');
        }, 3000);
      } else {
        console.error('Erro ao criar marcação:', result.error);
        setBookingError(result.error || 'Erro ao criar marcação. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setBookingError('Erro inesperado. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedService, selectedProfessional, selectedDate, selectedTime, createBooking, calculateEndTime]);

  const NavBar = () => (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              BL
            </div>
            <span className="font-serif text-xl text-gray-800 hidden sm:block">Bárbara Lacerda</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-pink-500 transition">Início</button>
            <button onClick={() => setCurrentPage('about')} className="text-gray-700 hover:text-pink-500 transition">Sobre</button>
            <button onClick={() => setCurrentPage('services')} className="text-gray-700 hover:text-pink-500 transition">Serviços</button>
            <button onClick={() => setCurrentPage('team')} className="text-gray-700 hover:text-pink-500 transition">Equipa</button>
            <button onClick={() => setCurrentPage('gallery')} className="text-gray-700 hover:text-pink-500 transition">Galeria</button>
            <button onClick={() => setCurrentPage('contact')} className="text-gray-700 hover:text-pink-500 transition">Contacto</button>
          </div>

          <button 
            onClick={() => setCurrentPage('booking')}
            className="hidden md:block bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition transform hover:scale-105"
          >
            Marque Já
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-pink-50">Início</button>
            <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-pink-50">Sobre</button>
            <button onClick={() => { setCurrentPage('services'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-pink-50">Serviços</button>
            <button onClick={() => { setCurrentPage('team'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-pink-50">Equipa</button>
            <button onClick={() => { setCurrentPage('gallery'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-pink-50">Galeria</button>
            <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-pink-50">Contacto</button>
            <button onClick={() => { setCurrentPage('booking'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 bg-pink-500 text-white rounded-lg mt-2">Marque Já</button>
          </div>
        </div>
      )}
    </nav>
  );

  const HomePage = () => (
    <div className="min-h-screen">
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZjYmRkMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative text-center px-4 z-10">
          <h1 className="text-5xl md:text-7xl font-serif mb-4 text-gray-800 animate-fade-in">
            Seja uma Mulher Bárbara
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Onde a autoexpressão encontra seu lar. Celebrando a individualidade, confiança e elegância de cada cliente.
          </p>
          <button 
            onClick={() => setCurrentPage('booking')}
            className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-10 py-4 rounded-full text-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            Marque a Sua Sessão
          </button>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-16 text-gray-800">Porquê Escolher-nos</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Produtos Premium</h3>
              <p className="text-gray-600">Utilizamos apenas os melhores produtos do mercado para garantir resultados excepcionais</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Técnicas Modernas</h3>
              <p className="text-gray-600">Especialistas em madeixas, balaiagem e colorimetria com as técnicas mais atuais</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Atendimento Personalizado</h3>
              <p className="text-gray-600">Cada cliente é única. Cuidamos de você com carinho e atenção aos detalhes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="min-h-screen py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-serif mb-8 text-center text-gray-800">Sobre Nós</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Seja bem-vinda ao universo de beleza Na Cadeira de Bárbara Lacerda, onde cada mulher é convidada a se tornar verdadeiramente bárbara.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Localizado em Caldas da Rainha, nosso salão é mais do que um espaço de beleza - é um refúgio onde a autoexpressão encontra seu lar. Aqui, abraçamos o lema <strong>"Seja uma Mulher Bárbara"</strong>, celebrando a individualidade, a confiança e a elegância de cada cliente.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Além dos procedimentos capilares que elevam sua aparência, oferecemos uma gama completa de tratamentos estéticos que nutrem a sua pele. E para aquele toque final de glamour, nossos procedimentos de nails garantem que suas unhas brilhem com perfeição.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Na Cadeira de Bárbara Lacerda é mais do que um salão - é o lugar onde sua beleza é tratada com responsabilidade e dedicação. Estamos aqui para ajudá-la a abraçar a sua verdadeira essência e a irradiar confiança em todos os momentos.
          </p>
        </div>
      </div>
    </div>
  );

  const ServicesPage = () => (
    <div className="min-h-screen py-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-serif mb-4 text-center text-gray-800">Nossos Serviços</h1>
        <p className="text-center text-gray-600 mb-16 text-lg">Tratamentos personalizados com produtos premium</p>
        
        {servicesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-gray-600">A carregar serviços...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105">
                <div className="h-3 bg-gradient-to-r from-pink-400 to-pink-600"></div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center text-gray-500">
                      <Clock size={18} className="mr-2" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="text-2xl font-bold text-pink-600">{service.price ? `${service.price}€` : 'Sob consulta'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <button 
            onClick={() => setCurrentPage('booking')}
            className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-8 py-3 rounded-full text-lg hover:shadow-lg transition transform hover:scale-105"
          >
            Agendar Serviço
          </button>
        </div>
      </div>
    </div>
  );

  const TeamPage = () => (
    <div className="min-h-screen py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-5xl font-serif mb-4 text-center text-gray-800">Nossa Equipa</h1>
        <p className="text-center text-gray-600 mb-16 text-lg">Profissionais altamente capacitadas e experientes</p>
        
        {professionalsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-gray-600">A carregar equipa...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {professionals.map(pro => (
              <div key={pro.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition">
                <div className="h-48 bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center">
                  <span className="text-8xl">{pro.photo_url || '👩'}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800">{pro.name}</h3>
                  <p className="text-pink-600 font-medium mb-3">{pro.specialty}</p>
                  <p className="text-gray-600">{pro.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const GalleryPage = () => (
    <div className="min-h-screen py-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-serif mb-4 text-center text-gray-800">Galeria</h1>
        <p className="text-center text-gray-600 mb-16 text-lg">Veja alguns dos nossos trabalhos</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="relative h-80 bg-gradient-to-br from-pink-200 to-pink-400 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                {['💇‍♀️', '✨', '💅', '🌸', '💖', '👑'][i - 1]}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-gray-600">
          Acompanhe mais trabalhos no nosso <a href="https://www.instagram.com/nacadeiradebarbaralacerda/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Instagram @nacadeiradebarbaralacerda</a>
        </p>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="min-h-screen py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-5xl font-serif mb-16 text-center text-gray-800">Contacto</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Informações de Contacto</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="mr-4 text-pink-500 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Telefone / WhatsApp</p>
                  <a href="tel:+351935279765" className="text-gray-600 hover:text-pink-600">+351 935 279 765</a>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="mr-4 text-pink-500 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <a href="mailto:yoursolution.dev@gmail.com" className="text-gray-600 hover:text-pink-600">yoursolution.dev@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="mr-4 text-pink-500 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Morada</p>
                  <p className="text-gray-600">R. Silva Porto 3/A<br />2500-880 Caldas da Rainha</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-4 text-gray-800">Horário de Funcionamento</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Segunda:</strong> Encerrado</p>
                <p><strong>Terça - Sábado:</strong> 10:00 - 20:00</p>
                <p><strong>Domingo:</strong> Encerrado</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-4 text-gray-800">Siga-nos</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/nacadeiradebarbaralacerda" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition">
                  <Facebook size={24} className="text-pink-600" />
                </a>
                <a href="https://www.instagram.com/nacadeiradebarbaralacerda/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition">
                  <Instagram size={24} className="text-pink-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Localização</h2>
            <div className="aspect-video bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl flex items-center justify-center mb-4">
              <MapPin size={48} className="text-white" />
            </div>
            <a 
              href="https://www.google.com/maps/place/Na+Cadeira+de+Bárbara+Lacerda+-+Especialista+em+madeixas+%7C+Extensão+Capilar,+Rua+Silva+Porto,+Caldas+da+Rainha/@39.4067968,-9.1324416,14z/data=!4m5!3m4!1s0xd18b3e47afee237:0xdea856b1d04010be!8m2!3d39.4012186!4d-9.1375012?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white text-center py-3 rounded-lg hover:shadow-lg transition"
            >
              Ver no Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const BookingPage = () => {
    if (bookingSuccess) {
      return (
        <div className="min-h-screen py-20 flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl shadow-2xl p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-serif mb-4 text-gray-800">Marcação Confirmada!</h2>
              <p className="text-gray-600 mb-2">Obrigada por escolher o nosso salão.</p>
              <p className="text-gray-600">A sua marcação foi registada com sucesso!</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-serif mb-4 text-center text-gray-800">Marcar Sessão</h1>
          <p className="text-center text-gray-600 mb-12">Selecione o serviço, profissional e horário desejado</p>

          {bookingError && (
            <div className="max-w-2xl mx-auto mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-center">{bookingError}</p>
            </div>
          )}

          <div className="flex justify-between mb-12 max-w-2xl mx-auto">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bookingStep >= step ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step}
                </div>
                {step < 4 && <div className={`w-16 md:w-24 h-1 ${bookingStep > step ? 'bg-pink-500' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {bookingStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">1. Selecione o Serviço</h2>
                {servicesLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    <p className="mt-4 text-gray-600">A carregar serviços...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map(service => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedService(service);
                          setBookingStep(2);
                        }}
                        className={`p-4 rounded-lg border-2 text-left transition ${
                          selectedService?.id === service.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-800 mb-2">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">{service.duration} min</span>
                          <span className="font-bold text-pink-600">{service.price ? `${service.price}€` : 'Sob consulta'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {bookingStep === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">2. Selecione a Profissional</h2>
                {professionalsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    <p className="mt-4 text-gray-600">A carregar equipa...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {professionals.map(pro => (
                      <button
                        key={pro.id}
                        onClick={() => {
                          setSelectedProfessional(pro);
                          setBookingStep(3);
                        }}
                        className={`p-4 rounded-lg border-2 text-center transition ${
                          selectedProfessional?.id === pro.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <div className="text-6xl mb-3">{pro.photo_url || '👩'}</div>
                        <h3 className="font-semibold text-gray-800 mb-1">{pro.name}</h3>
                        <p className="text-sm text-pink-600">{pro.specialty}</p>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setBookingStep(1)}
                  className="mt-6 text-pink-600 hover:text-pink-700"
                >
                  ← Voltar
                </button>
              </div>
            )}

            {bookingStep === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">3. Selecione Data e Hora</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <h3 className="text-xl font-semibold">
                      {currentMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {generateCalendar().map((day, index) => (
                      <button
                        key={index}
                        disabled={!day || !day.isAvailable}
                        onClick={() => day && setSelectedDate(day.date)}
                        className={`p-3 rounded-lg text-center transition ${
                          !day
                            ? 'invisible'
                            : !day.isAvailable
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : selectedDate?.getDate() === day.day && selectedDate?.getMonth() === currentMonth.getMonth()
                            ? 'bg-pink-500 text-white'
                            : 'bg-white border-2 border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        {day?.day}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <h3 className="font-semibold mb-4 text-gray-800">Horários Disponíveis</h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {generateTimeSlots().map(time => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setBookingStep(4);
                          }}
                          className={`p-3 rounded-lg border-2 transition ${
                            selectedTime === time
                              ? 'border-pink-500 bg-pink-50 text-pink-700'
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setBookingStep(2)}
                  className="mt-6 text-pink-600 hover:text-pink-700"
                >
                  ← Voltar
                </button>
              </div>
            )}

            {bookingStep === 4 && (
              <ClientInfoForm
                onSubmit={handleClientInfoSubmit}
                onBack={() => setBookingStep(3)}
                isSubmitting={isSubmitting}
                booking={{
                  service: selectedService,
                  professional: selectedProfessional,
                  date: selectedDate,
                  time: selectedTime
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      <NavBar />
      <div className="pt-16">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'team' && <TeamPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'booking' && <BookingPage />}
      </div>

      <a
        href="https://wa.me/351935279765"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition transform hover:scale-110 z-50"
      >
        <Phone size={28} />
      </a>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-serif mb-4">Bárbara Lacerda</h3>
              <p className="text-gray-400">Seja uma Mulher BELA</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">+351 935 279 765</p>
              <p className="text-gray-400">yoursolution.dev@gmail.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Horário</h4>
              <p className="text-gray-400">Terça - Sábado: 10:00 - 20:00</p>
              <p className="text-gray-400">Seg e Dom: Encerrado</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Na Cadeira de Bárbara Lacerda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
