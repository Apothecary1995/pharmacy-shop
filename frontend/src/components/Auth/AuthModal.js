import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthModal = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      if (isLoginView) {
        await login(email, password);
        onClose();
      } else {
        const response = await register(username, email, password);
        setMessage(response.data.message + " Please login");
        setIsLoginView(true);
      }
    } catch (error) {
      const resMessage = (error.response?.data?.message) || error.message;
      setMessage(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: 'center' }}>{isLoginView ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="auth-form" style={{ margin: 0, boxShadow: 'none' }}>
          {!isLoginView && (
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {message && <p style={{ color: isLoginView ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}
          
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing' : (isLoginView ? 'Login 🌸進撃の巨人' : 'Register 🌸箭頭')}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          {isLoginView ? "Don't have an account it takes 2 minutes ✌顏文字 " : "Already have an account WHAT ARE U WAITING FOR 🏯 "}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginView(!isLoginView); setMessage(''); }}>
            {isLoginView ? 'Register Here MY FRIEND ִֶָ𓂃 ࣪˖ ִֶָ🐇་༘࿐' : 'Login ⎛⎝ ≽ > ⩊ < ≼ ⎠⎞'}
          </a>
        </p>
        
        <center><a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} style={{marginTop: '10px', display: 'inline-block'}}>Close</a></center>
      </div>
    </div>
  );
};

export default AuthModal;