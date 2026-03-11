import dynamic from "next/dynamic";

const ProjectForm = dynamic(() => import("@/app/components/projectForm"), {
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />,
  ssr: true,
});

export default function ViviendaJovenForm() {
  return (
    <div className="juana-form">
      <ProjectForm
        interest="juana-64"
        backgroundImage="/img/vivienda-joven/bg-form.webp"
        heading="Tu futura casa te espera"
        subtitle="El lugar soñado existe"
        id="formulario"
        transactionTypes={["comprar"]}
      />
      <style jsx>{`
        .juana-form :global(div:has(> label[for="transactionType"])) {
          display: none;
        }
      `}</style>
    </div>
  );
}
