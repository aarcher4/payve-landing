"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import clsx from "clsx";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Browser validation is handled by 'required' and 'type' attributes automatically
    // before this handler is called.
    
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Close modal after showing success message for a moment
    setTimeout(() => {
      onClose();
      // Reset state after transition finishes
      setTimeout(() => {
        setIsSuccess(false);
      }, 500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-colors"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                      <Check size={32} />
                    </div>
                    <h3 className="text-2xl font-display text-gray-900">Request Sent</h3>
                    <p className="text-gray-500 max-w-xs">
                      Thank you for your interest. Our team will be in touch shortly to schedule your demo.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-display text-gray-900 mb-2">
                        Talk to us
                      </h2>
                      <p className="text-gray-500 font-light">
                        Enter your details below to schedule a demo.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label htmlFor="name" className="text-xs uppercase tracking-wider text-gray-500 font-medium ml-1">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#505050]/20 focus:border-[#505050] transition-all"
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="company" className="text-xs uppercase tracking-wider text-gray-500 font-medium ml-1">
                          Company Name
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#505050]/20 focus:border-[#505050] transition-all"
                          placeholder="Where do you work?"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500 font-medium ml-1">
                            Work Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#505050]/20 focus:border-[#505050] transition-all"
                            placeholder="name@company.com"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="phone" className="text-xs uppercase tracking-wider text-gray-500 font-medium ml-1">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#505050]/20 focus:border-[#505050] transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="message" className="text-xs uppercase tracking-wider text-gray-500 font-medium ml-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#505050]/20 focus:border-[#505050] transition-all resize-none"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={clsx(
                          "w-full mt-6 py-4 rounded-full font-medium text-white shadow-lg transition-all duration-300 transform",
                          isSubmitting 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-[#505050] hover:bg-gray-800 hover:scale-[1.02]"
                        )}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Book a demo"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

