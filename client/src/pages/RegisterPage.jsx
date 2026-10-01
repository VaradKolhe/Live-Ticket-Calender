import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-panel border border-border rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-primary p-2 rounded-xl flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <span className="text-3xl font-semibold text-white tracking-tight">eventflow</span>
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Create an account</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0e0e11] border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Arjun K."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0e0e11] border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0e0e11] border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primaryHover text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {loading ? 'Creating...' : 'Create account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-textSecondary">
          Already have an account? <Link to="/login" className="text-primary hover:text-primaryHover font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
