import dynamic from "next/dynamic";

const ProjectForm = dynamic(() => import("@/app/components/projectForm"), {
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />,
  ssr: true,
});

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/coradirhomesok/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/coradirhomes/",
  },
  {
    label: "Whatsapp",
    href: "https://api.whatsapp.com/send/?phone=2665108855&text=Hola%2C+quiero+solicitar+una+visita+...&type=phone_number&app_absent=0",
  },
];

export default function ContactSection() {
  return (
    <section className="bg-white py-16" id="contacto">
      <div className="container mx-auto px-6 flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-playfair text-blue">Contactanos</h2>
          <p className="text-lg md:text-xl font-raleway text-black/70">
            Completa el formulario y un asesor se comunicara con vos para contarte todo sobre La Torre II.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full border border-blue text-blue font-raleway font-semibold uppercase hover:bg-blue hover:text-white transition"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
        <ProjectForm
          interest="la-torre-ii"
          backgroundImage="/img/la-torre-ii/slider/slide-00.webp"
          heading="Consultanos por La Torre II"
          subtitle="Completa tus datos y te contactamos."
          submitLabel="Enviar consulta"
          id="formulario"
        />
      </div>
    </section>
  );
}
