import dynamic from "next/dynamic";

const ProjectForm = dynamic(() => import("@/app/components/projectForm"), {
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />,
  ssr: true,
});

export default function ViviendaJovenForm() {
  return (
    <ProjectForm
      interest="juana-64"
      backgroundImage="/img/vivienda-joven/bg-form.webp"
      heading="Descubri una nueva forma de vivir."
      subtitle="Comunicate con nosotros:"
      submitLabel="Quiero invertir"
      id="formulario"
    />
  );
}
