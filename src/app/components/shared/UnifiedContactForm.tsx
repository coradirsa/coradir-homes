"use client";

import { useState } from 'react';
import Image from 'next/image';

export interface UnifiedContactFormData {
  title: string;
  subtitle: string;
  bgImage: string;
  fields: Array<{
    label: string;
    name: string;
    type: string;
  }>;
  profileTypes: Array<{
    label: string;
    value: string;
  }>;
  options: string[];
}

interface UnifiedContactFormProps {
  data: UnifiedContactFormData;
  className?: string;
}

export default function UnifiedContactForm({ data, className = "" }: UnifiedContactFormProps) {
  const [formType, setFormType] = useState(data.options[0]);
  const [profileType, setProfileType] = useState(data.profileTypes[0].value);

  return (
    <section id="contact" className={`relative bg-slate-100 grid grid-cols-1 lg:grid-cols-2 min-h-[700px] ${className}`}>
      <div className="relative h-64 lg:h-auto">
        <Image
          src={data.bgImage}
          alt="Formulario de contacto"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center p-12 text-center">
          <div>
            <h2 className="font-playfair text-4xl md:text-6xl text-white font-bold leading-tight mb-4">
              {data.title}
            </h2>
            <span className="text-xl font-raleway font-light text-gray-200">
              {data.subtitle}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-20 bg-white flex flex-col justify-center" id="venta">
        <form className="space-y-6 max-w-lg mx-auto w-full">

          {/* Render de campos de texto */}
          {data.fields.map((field, idx) => (
            <div key={idx}>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  placeholder={field.label}
                  rows={3}
                  className="w-full bg-slate-50 border-b-2 border-slate-200 p-4 focus:outline-none focus:border-blue-900 transition-colors resize-none text-slate-800 placeholder-slate-400 font-medium"
                  aria-label={field.label}
                ></textarea>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  className="w-full bg-slate-50 border-b-2 border-slate-200 p-4 focus:outline-none focus:border-blue-900 transition-colors text-slate-800 placeholder-slate-400 font-medium"
                  aria-label={field.label}
                  required={field.type !== 'textarea'}
                />
              )}
            </div>
          ))}

          {/* Selector de Tipo de Usuario (Radio Buttons) */}
          <div className="py-2">
            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">
              Perfil de Interesado:
            </label>
            <div className="flex gap-6">
              {data.profileTypes.map((type, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded-full group-hover:border-blue-900 transition-colors">
                    <input
                      type="radio"
                      name="profileType"
                      value={type.value}
                      checked={profileType === type.value}
                      onChange={() => setProfileType(type.value)}
                      className="appearance-none absolute inset-0 cursor-pointer"
                    />
                    {profileType === type.value && (
                      <div className="w-2.5 h-2.5 bg-blue-900 rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${profileType === type.value ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Botones de Acción (Alquilar/Comprar) */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6" id="alquiler">
            {data.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                id={`btn-form-${opt.toLowerCase()}`}
                onClick={() => setFormType(opt)}
                className={`py-4 text-xs md:text-sm font-bold uppercase tracking-wider border-2 rounded-lg transition-all
                  ${formType === opt
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-transparent text-slate-400 border-slate-200 hover:border-slate-400'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}