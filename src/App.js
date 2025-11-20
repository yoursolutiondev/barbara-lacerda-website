import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";

// Lista de serviços (memoizada para não re-renderizar)
const SERVICES = [
  { id: 1, name: "Limpeza Facial", duration: 60, value: "35€" },
  { id: 2, name: "Terapia de Relaxamento", duration: 90, value: "50€" },
  { id: 3, name: "Massagem Completa", duration: 75, value: "45€" },
];

export default function BookingPage() {
  // ---------------------------
  // ESTADOS DO FORMULÁRIO
  // ---------------------------
  const [step, setStep] = useState(1);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const [selectedService, setSelectedService] = useState(null);

  const isStep1Valid = selectedService !== null;
  const isStep2Valid = formName.length >= 3 && formPhone.length >= 9;

  const memoServices = useMemo(() => SERVICES, []);

  // ---------------------------
  // PASSAR DE STEP
  // ---------------------------
  const nextStep = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // ---------------------------
  // SUBMETER
  // ---------------------------
  const submitForm = () => {
    const data = {
      service: selectedService,
      name: formName,
      phone: formPhone,
      email: formEmail,
      notes: formNotes,
    };

    console.log("Formulário enviado:", data);
    alert("Pedido enviado com sucesso!");
  };

  // ---------------------------
  // COMPONENTE DE STEPS
  // ---------------------------
  const StepHeader = ({ title }) => (
    <h2 className="text-xl font-semibold text-pink-600 mb-4">{title}</h2>
  );

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      {/* Step 1 - Seleção de serviço */}
      {step === 1 && (
        <div>
          <StepHeader title="Escolha o serviço" />

          <div className="space-y-3">
            {memoServices.map(service => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`w-full p-4 rounded-lg border-2 text-left transition
                  ${
                    selectedService?.id === service.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200"
                  }
                `}
              >
                <div className="font-semibold">{service.name}</div>
                <div className="text-sm text-gray-600">
                  {service.duration} min — {service.value}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={!isStep1Valid}
            className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg disabled:bg-gray-300"
          >
            Continuar <ChevronRight className="inline ml-1" size={18} />
          </button>
        </div>
      )}

      {/* Step 2 - Dados pessoais */}
      {step === 2 && (
        <div className="space-y-4">
          <StepHeader title="Os seus dados" />

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nome completo *
            </label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="O seu nome"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500"
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              value={formPhone}
              onChange={e => setFormPhone(e.target.value)}
              placeholder="+351 XXX XXX XXX"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Email (opcional)
            </label>
            <input
              type="email"
              value={formEmail}
              onChange={e => setFormEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="w-1/2 py-3 rounded-lg border border-gray-300"
            >
              Voltar
            </button>
            <button
              onClick={nextStep}
              disabled={!isStep2Valid}
              className="w-1/2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg disabled:bg-gray-300"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 3 - Notas */}
      {step === 3 && (
        <div className="space-y-4">
          <StepHeader title="Notas adicionais" />

          <textarea
            value={formNotes}
            onChange={e => setFormNotes(e.target.value)}
            placeholder="Algo que gostava de informar? (opcional)"
            className="w-full p-3 h-32 border-2 border-gray-200 rounded-lg focus:border-pink-500"
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="w-1/2 py-3 rounded-lg border border-gray-300"
            >
              Voltar
            </button>
            <button
              onClick={nextStep}
              className="w-1/2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 4 - Confirmação */}
      {step === 4 && (
        <div className="space-y-4">
          <StepHeader title="Confirmar pedido" />

          <div className="p-4 border-2 rounded-lg border-gray-200 bg-gray-50">
            <p><strong>Serviço:</strong> {selectedService?.name}</p>
            <p><strong>Nome:</strong> {formName}</p>
            <p><strong>Telefone:</strong> {formPhone}</p>
            {formEmail && <p><strong>Email:</strong> {formEmail}</p>}
            {formNotes && <p><strong>Notas:</strong> {formNotes}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="w-1/2 py-3 rounded-lg border border-gray-300"
            >
              Voltar
            </button>
            <button
              onClick={submitForm}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              Enviar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
