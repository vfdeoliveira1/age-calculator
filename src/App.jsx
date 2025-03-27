import { useState, useEffect } from 'react';
import './App.css';

// Componente de Input reutilizável
const DateInput = ({ label, placeholder, value, error, onChange, maxLength }) => {
  return (
    <div className={`input-group ${error ? 'error' : ''}`}>
      <label htmlFor={label.toLowerCase()}>{label}</label>
      <input
        type="number"
        id={label.toLowerCase()}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={error ? 'error-input' : ''}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

// Componente de Resultado reutilizável
const AgeResult = ({ value, unit, animate }) => {
  return (
    <div className="result-row">
      <span className="result-number animate-number" data-animate={animate}>
        {value !== undefined && value !== null ? value : '--'}
      </span>
      <span className="result-text">{unit}</span>
    </div>
  );
};

function AgeCalculator() {
  const [date, setDate] = useState({
    day: '',
    month: '',
    year: ''
  });
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(undefined); 
  const [animate, setAnimate] = useState(false);

  // Validação separada em funções específicas
  const validateDay = (day) => {
    if (!day) return 'This field is required';
    if (day < 1 || day > 31) return 'Must be a valid day';
    return '';
  };

  const validateMonth = (month) => {
    if (!month) return 'This field is required';
    if (month < 1 || month > 12) return 'Must be a valid month';
    return '';
  };

  const validateYear = (year) => {
    const currentYear = new Date().getFullYear();
    if (!year) return 'This field is required';
    if (year > currentYear) return 'Must be in the past';
    return '';
  };

  const validateDate = (day, month, year) => {
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    
    if (
      inputDate.getDate() != day ||
      inputDate.getMonth() != month - 1 ||
      inputDate.getFullYear() != year
    ) {
      return 'Must be a valid date';
    }
    
    if (inputDate > today) {
      return 'Must be in the past';
    }
    
    return '';
  };

  const validateForm = () => {
    const { day, month, year } = date;
    const newErrors = {};
    
    newErrors.day = validateDay(day);
    newErrors.month = validateMonth(month);
    newErrors.year = validateYear(year);
    
    // Só valida a data completa se os campos individuais estiverem OK
    if (!newErrors.day && !newErrors.month && !newErrors.year) {
      const dateError = validateDate(day, month, year);
      if (dateError) newErrors.day = dateError;
    }
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Ajuste para dias negativos
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    // Ajuste para meses negativos
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const handleInputChange = (field) => (e) => {
    setDate(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnimate(false);
    
    if (validateForm()) {
      const birthDate = new Date(date.year, date.month - 1, date.day);
      const calculatedAge = calculateAge(birthDate);
      setAge(calculatedAge);
      setAnimate(true);
    }
  };

  // Efeito para resetar a animação
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className="age-calculator">
      <form onSubmit={handleSubmit} className="age-form">
        <div className="input-fields">
          <DateInput
            label="DAY"
            placeholder="DD"
            value={date.day}
            error={errors.day}
            onChange={handleInputChange('day')}
            maxLength="2"
          />
          
          <DateInput
            label="MONTH"
            placeholder="MM"
            value={date.month}
            error={errors.month}
            onChange={handleInputChange('month')}
            maxLength="2"
          />
          
          <DateInput
            label="YEAR"
            placeholder="YYYY"
            value={date.year}
            error={errors.year}
            onChange={handleInputChange('year')}
            maxLength="4"
          />
        </div>
        
        <div className="submit-section">
          <hr className="divider" />
          <button type="submit" className="submit-button" aria-label="Calculate age">
            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="44" viewBox="0 0 46 44">
              <g fill="none" stroke="#FFF" strokeWidth="2">
                <path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44"/>
              </g>
            </svg>
          </button>
        </div>
      </form>
      
      <div className="results">
        <AgeResult value={age?.years} unit="years" animate={animate} />
        <AgeResult value={age?.months} unit="months" animate={animate} />
        <AgeResult value={age?.days} unit="days" animate={animate} />
      </div>
    </div>
  );
}

export default AgeCalculator;