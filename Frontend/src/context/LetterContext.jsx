import { createContext, useContext, useState, useCallback } from 'react';

const LetterContext = createContext(null);

export function LetterProvider({ children }) {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState({
    tier: 'basica',
    option: 0,
    idPlantilla: 1,
    tipoPlantilla: 'basica',
    variantePlantilla: 'azul',
  });
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    nombreRemitente: '',
    nombreDestinatario: '',
    fechaApertura: '',
  });
  const [codigoQR, setCodigoQR] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetWizard = useCallback(() => {
    setStep(1);
    setTemplate({ tier: 'basica', option: 0, idPlantilla: 1, tipoPlantilla: 'basica', variantePlantilla: 'azul' });
    setFormData({
      titulo: '',
      contenido: '',
      nombreRemitente: '',
      nombreDestinatario: '',
      fechaApertura: '',
    });
    setCodigoQR(null);
    setError(null);
  }, []);

  const value = {
    step,
    setStep,
    template,
    setTemplate,
    formData,
    setFormData,
    codigoQR,
    setCodigoQR,
    loading,
    setLoading,
    error,
    setError,
    resetWizard,
  };

  return (
    <LetterContext.Provider value={value}>
      {children}
    </LetterContext.Provider>
  );
}

export function useLetter() {
  const ctx = useContext(LetterContext);
  if (!ctx) throw new Error('useLetter must be used within LetterProvider');
  return ctx;
}
