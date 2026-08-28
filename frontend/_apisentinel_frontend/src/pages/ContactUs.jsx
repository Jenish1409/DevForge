import { useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { Send, CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import api from '../services/api';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await api.post('/api/public/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <PublicNavbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        {/* Subtle dot matrix background */}
        <div className="absolute inset-0 z-0 opacity-[0.25] dark:opacity-10 pointer-events-none"
             style={{ 
               backgroundImage: 'radial-gradient(circle, rgb(148 163 184 / 0.8) 1px, transparent 1px)', 
               backgroundSize: '24px 24px',
               animation: 'pan-matrix 4s linear infinite'
             }} />
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-plus-lighter" />
        
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Get in <span className="text-blue-600">Touch</span></h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions about ApiSentinel? Want to report a bug or suggest a feature? Drop a message below and I'll get back to you.
          </p>
        </div>

        <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/5 border border-white/50 dark:border-gray-800 overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
          
          {/* Contact Info Sidebar */}
          <div className="bg-gray-900 dark:bg-gray-950 p-10 md:w-1/3 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Fill out the form and I will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:jenishraichura58@gmail.com" className="text-gray-400 hover:text-white transition-colors">jenishraichura58@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-400">Available Anywhere</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <p className="font-medium">Socials</p>
                    <div className="flex gap-4 mt-2">
                      <a href="https://github.com/Jenish1409" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">GitHub</a>
                      <a href="https://www.linkedin.com/in/jenish-raichura-9b535727b/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400">LinkedIn</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 opacity-50">
               <svg className="w-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" />
               </svg>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 md:w-2/3">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
                  <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400">Thank you for reaching out. I'll get back to you at {formData.email} soon.</p>
                <p className="text-sm text-amber-600 dark:text-amber-500 font-medium mt-3 bg-amber-50 dark:bg-amber-900/10 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-800/30">
                  <Mail className="w-4 h-4" /> Please remember to check your spam folder!
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="btn-shine-effect mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl mb-6">
                    {errorMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="btn-shine-effect flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    {!status === 'submitting' && <Send className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
