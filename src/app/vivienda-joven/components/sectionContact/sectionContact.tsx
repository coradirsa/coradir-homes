"use client";

export default function SectionContact() {
    const email = "juana64@coradir.com.ar";
    const whatsapp: string = "+54 9 266 4649967";
    const whatsappMessage = "Hola, vi el proyecto de Juana64 en la web y quiero saber más...";
    const mapUrl = "https://www.google.com/maps/place/33%C2%B015'54.8%22S+66%C2%B014'07.5%22W/@-33.2652177,-66.2379777,915m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d-33.2652177!4d-66.2354028?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D";
    const embedUrl = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3486.7834566144747!2d-66.2379777!3d-33.2652177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDE1JzU0LjgiUyA2NsKwMTQnMDcuNSJX!5e0!3m2!1ses!2sar!4v1699999999999!5m2!1ses!2sar";

    return (
        <section className="w-full bg-white py-10 md:py-16 xl:py-20">
            <div className="container px-5 flex flex-col items-center gap-8 md:gap-12">
                <h2 className="text-3xl md:text-5xl xl:text-7xl text-blue font-playfair text-center font-bold">
                    Contáctanos
                </h2>

                <div className="w-full flex flex-col lg:flex-row items-center gap-6 md:gap-8">
                    {/* Columna izquierda - Botones de contacto */}
                    <div className="flex flex-col gap-6 lg:w-1/3 justify-center">
                        {/* Email */}
                        <a
                            href={`mailto:${email}`}
                            className="bg-blue text-white rounded-xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 hover:bg-blue/90 transition-all hover:scale-105"
                        >
                            <svg className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <div className="text-center">
                                <p className="font-raleway font-bold text-sm md:text-base mb-1">Email</p>
                                <p className="font-raleway text-sm md:text-lg break-all">{email}</p>
                            </div>
                        </a>

                        {/* WhatsApp */}
                        {whatsapp ? (
                            <a
                                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 text-white rounded-xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 hover:bg-green-600 transition-all hover:scale-105"
                            >
                                <svg className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <div className="text-center">
                                    <p className="font-raleway font-bold text-sm md:text-base mb-1">WhatsApp</p>
                                    <p className="font-raleway text-sm md:text-lg">{whatsapp}</p>
                                </div>
                            </a>
                        ) : (
                            <div className="bg-gray-300 text-gray-600 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 opacity-60 cursor-not-allowed">
                                <svg className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <div className="text-center">
                                    <p className="font-raleway font-bold text-sm md:text-base mb-1">WhatsApp</p>
                                    <p className="font-raleway text-xs md:text-sm">Próximamente</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha - Mapa */}
                    <div className="lg:w-2/3 flex flex-col">
                        <h3 className="text-xl md:text-2xl xl:text-3xl text-blue font-raleway font-bold text-center mb-4">
                            ¿Dónde estamos?
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
                                title="Ubicación Juana 64"
                            />
                        </div>
                        <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 text-blue font-raleway font-semibold hover:underline text-sm md:text-base text-center"
                        >
                            Ver en Google Maps →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
