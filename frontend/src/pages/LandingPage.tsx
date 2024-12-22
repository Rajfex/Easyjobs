

// import Image from 'next/image'
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import laptopImage from '../img/laptop.jpg'
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <Minus className="h-5 w-5 text-gray-500" />
        ) : (
          <Plus className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <p className="mt-2 text-gray-600">{answer}</p>}
    </div>
  )
}

export const LandingPage:React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Reliable House Cleaning Services</h2>
            <p className="text-xl text-gray-600 mb-6">Connect with professional cleaners for a spotless home, hassle-free.</p>
            <Link 
              to="/signup" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="md:w-1/2">
            <img src={laptopImage} alt="Laptop" width={500} height={500} className="rounded-lg shadow-lg" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose CleanConnect?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Verified Professionals', description: 'All our cleaners are thoroughly vetted and background-checked for your peace of mind.' },
              { title: 'Flexible Scheduling', description: 'Book a cleaning service at a time that suits you, with options for recurring or one-time appointments.' },
              { title: 'Satisfaction Guaranteed', description: 'If you\'re not happy with the service, we\'ll make it right or refund your money.' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">How CleanConnect Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Sign Up', description: 'Create your account in minutes.' },
              { title: 'Book a Cleaner', description: 'Choose your preferred date and time.' },
              { title: 'Get Cleaned', description: 'A professional cleaner arrives and works their magic.' },
              { title: 'Rate and Review', description: 'Share your experience and help our community grow.' },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
          <div className="bg-white rounded-lg shadow-md p-6">
            <FAQItem 
              question="How do I book a cleaning service?" 
              answer="Simply sign up for an account, choose your preferred date and time, and select the type of cleaning service you need. You can book a one-time clean or set up recurring appointments."
            />
            <FAQItem 
              question="Are your cleaners insured?" 
              answer="Yes, all cleaners on our platform are fully insured. We also conduct background checks to ensure your safety and peace of mind."
            />
            <FAQItem 
              question="What if I'm not satisfied with the cleaning?" 
              answer="We have a satisfaction guarantee. If you're not happy with the service, contact us within 24 hours and we'll arrange for a re-clean or refund your money."
            />
            <FAQItem 
              question="Can I choose my own cleaner?" 
              answer="Yes, you can select a preferred cleaner based on their profile and reviews. You can also request the same cleaner for recurring appointments."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready for a Cleaner Home?</h3>
          <p className="text-xl text-gray-600 mb-6">Join thousands of satisfied customers who trust CleanConnect for their home cleaning needs.</p>
          <Link 
            to="/signup" 
            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign Up Now
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h5 className="text-xl font-semibold text-gray-900 mb-4">CleanConnect</h5>
              <p className="text-gray-600">Connecting you with professional cleaners for a spotless home.</p>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-gray-800">About Us</Link></li>
                <li><Link to="/services" className="text-gray-600 hover:text-gray-800">Our Services</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-gray-800">Contact Us</Link></li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Legal</h5>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-600 hover:text-gray-800">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-gray-800">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="w-full md:w-1/4">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h5>
              <div className="flex space-x-4">
                {/* Add your social media icons/links here */}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2023 CleanConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

