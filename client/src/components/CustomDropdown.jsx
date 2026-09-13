import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function CustomDropdown({ options, value, onChange, placeholder = 'Select an option', className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs focus:border-[#20D68A] outline-none transition-all flex justify-between items-center'
            >
                <span className='truncate mr-2'>{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#20D68A]' : 'text-[#86A399]'}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className='absolute left-0 top-full z-[9999] w-full mt-1 bg-[#071916] border border-[#16362E] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden max-h-60 overflow-y-auto'
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type='button'
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors hover:bg-[#20D68A]/10 hover:text-[#20D68A] ${
                                    value === option.value ? 'bg-[#20D68A]/10 text-[#20D68A] font-medium' : 'text-[#86A399]'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}