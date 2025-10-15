import ProjectForm from "@/app/components/projectForm";

export default function ViviendaJovenForm() {
  return (
    <ProjectForm
      interest="vivienda-joven"
      backgroundImage="/img/vivienda-joven/bg-form.webp"
      heading="Descubri una nueva forma de vivir."
      subtitle="Comunicate con nosotros:"
      submitLabel="Quiero invertir"
      successMessage="Gracias por tu interes. Hemos recibido tu solicitud y te contactaremos pronto."
      id="formulario"
    />
  );
}
