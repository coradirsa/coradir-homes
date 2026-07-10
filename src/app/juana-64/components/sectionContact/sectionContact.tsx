"use client";

import MaterialIcon from "@/app/components/MaterialIcon";
import WhatsAppLink from "../../../components/WhatsAppLink";

export default function SectionContact() {
    const email = "juana64@coradir.com.ar";
    const whatsapp = "5492664649967";
    const whatsappMessage = "Hola, vi el proyecto de Juana64 en la web y quiero saber mas...";
    const mapUrl = "https://www.google.com/maps/place/33%C2%B015'54.8%22S+66%C2%B014'07.5%22W/@-33.2652177,-66.2379777,915m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d-33.2652177!4d-66.2354028?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D";
    const embedUrl = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3486.7834566144747!2d-66.2379777!3d-33.2652177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDE1JzU0LjgiUyA2NsKwMTQnMDcuNSJX!5e0!3m2!1ses!2sar!4v1699999999999!5m2!1ses!2sar";

    return (
        <section id="ubicacion" className="w-full scroll-mt-24 bg-white py-10 md:py-16 xl:py-20">
            <div className="container px-5 flex flex-col items-center gap-8 md:gap-12">
                <h2 className="text-3xl md:text-5xl xl:text-7xl text-blue font-playfair text-center font-bold">
                    Contactanos
                </h2>

                <div className="w-full flex flex-col lg:flex-row items-center gap-6 md:gap-8">
                    <div className="flex flex-col gap-6 lg:w-1/3 justify-center">
                        <a
                            href={`mailto:${email}`}
                            className="bg-blue text-white rounded-xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 hover:bg-blue/90 transition-all hover:scale-105"
                        >
                            <MaterialIcon name="mail" className="text-[48px] md:text-[64px]" />
                            <div className="text-center">
                                <p className="font-raleway font-bold text-sm md:text-base mb-1">Email</p>
                                <p className="font-raleway text-sm md:text-lg break-all">{email}</p>
                            </div>
                        </a>

                        {whatsapp ? (
                            <WhatsAppLink
                                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 text-white rounded-xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 hover:bg-green-600 transition-all hover:scale-105"
                            >
                                <MaterialIcon name="chat" className="text-[48px] md:text-[64px]" />
                                <div className="text-center">
                                    <p className="font-raleway font-bold text-sm md:text-base mb-1">WhatsApp</p>
                                    <p className="font-raleway text-sm md:text-lg">{whatsapp}</p>
                                </div>
                            </WhatsAppLink>
                        ) : (
                            <div className="bg-gray-300 text-gray-600 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 opacity-60 cursor-not-allowed">
                                <MaterialIcon name="chat" className="text-[48px] md:text-[64px]" />
                                <div className="text-center">
                                    <p className="font-raleway font-bold text-sm md:text-base mb-1">WhatsApp</p>
                                    <p className="font-raleway text-xs md:text-sm">Proximamente</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:w-2/3 flex flex-col">
                        <h3 className="text-xl md:text-2xl xl:text-3xl text-blue font-raleway font-bold text-center mb-4">
                            Donde estamos
                        </h3>
                        <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                src={embedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicacion Juana 64"
                            />
                        </div>
                        <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex mt-4 items-center justify-center text-blue font-raleway font-semibold hover:underline text-sm md:text-base text-center"
                        >
                            Ver en Google Maps
                            <MaterialIcon name="arrow_forward" className="ml-1 text-[18px]" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
