import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [animate, setAnimate] = useState(false);

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    const inputDate = new Date(year, month - 1, day);

    if (!day) newErrors.day = 'This field is required';
    else if (day < 1 || day > 31) newErrors.day = 'Must be a valid day';
    
    if (!month) newErrors.month = 'This field is required';
    else if (month < 1 || month > 12) newErrors.month = 'Must be a valid month';
    
    if (!year) newErrors.year = 'This field is required';
    else if (year > today.getFullYear()) newErrors.year = 'Must be in the past';
    
    if (!newErrors.day && !newErrors.month && !newErrors.year) {
      if (inputDate.getDate() != day || 
          inputDate.getMonth() != month - 1 || 
          inputDate.getFullYear() != year) {
        newErrors.day = 'Must be a valid date';
      } else if (inputDate > today) {
        newErrors.day = 'Must be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnimate(false);
    
    if (validate()) {
      const birthDate = new Date(year, month - 1, day);
      const calculatedAge = calculateAge(birthDate);
      setAge(calculatedAge);
      setAnimate(true);
    }
  };

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
          <div className={`input-group ${errors.day ? 'error' : ''}`}>
            <label htmlFor="day">DAY</label>
            <input
              type="number"
              id="day"
              placeholder="DD"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={errors.day ? 'error-input' : ''}
            />
            {errors.day && <p className="error-message">{errors.day}</p>}
          </div>
          
          <div className={`input-group ${errors.month ? 'error' : ''}`}>
            <label htmlFor="month">MONTH</label>
            <input
              type="number"
              id="month"
              placeholder="MM"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={errors.month ? 'error-input' : ''}
            />
            {errors.month && <p className="error-message">{errors.month}</p>}
          </div>
          
          <div className={`input-group ${errors.year ? 'error' : ''}`}>
            <label htmlFor="year">YEAR</label>
            <input
              type="number"
              id="year"
              placeholder="YYYY"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={errors.year ? 'error-input' : ''}
            />
            {errors.year && <p className="error-message">{errors.year}</p>}
          </div>
        </div>
        
        <div className="submit-section">
          <hr className="divider" />
          <button type="submit" className="submit-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="44" viewBox="0 0 46 44">
              <g fill="none" stroke="#FFF" strokeWidth="2">
                <path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44"/>
              </g>
            </svg>
          </button>
        </div>
      </form>
      
      <div className="results">
        <div className="result-row">
          <span className="result-number animate-number" data-animate={animate}>
            {age ? age.years : '--'}
          </span>
          <span className="result-text">years</span>
        </div>
        <div className="result-row">
          <span className="result-number animate-number" data-animate={animate}>
            {age ? age.months : '--'}
          </span>
          <span className="result-text">months</span>
        </div>
        <div className="result-row">
          <span className="result-number animate-number" data-animate={animate}>
            {age ? age.days : '--'}
          </span>
          <span className="result-text">days</span>
        </div>
      </div>
    </div>
  );
}

export default App;