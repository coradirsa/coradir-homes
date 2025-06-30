import CardProyect from "./cardProyect"

export default function SectionProjectsDone(){
    const proyects = [
        {
            title: "Torre Privada Coradir",
            image: "/img/proyectos_realizados_1.png",
            link: "/",
            id: "boton-homes-home-proyectos-realizados-1",
        },
        {
            title: "La Torre II Coradir",
            image: "/img/proyectos_realizados_2.png",
            link: "/",
            id: "boton-homes-home-proyectos-realizados-2",
        },

    ]
    return(
        <section className="bg-blue p-5 flex flex-col items-center justify-center container w-full gap-10 !mb-10">
            <h2 className="text-4xl xl:text-5xl  text-center font-playfair text-white font-bold">Proyectos realizados</h2>
            <section className="grid xl:grid-cols-2 grid-cols-1 gap-20 xl:gap-2 w-full py-5 xl:px-56"> 
                {
                    proyects.map((proyect,index) => ( <CardProyect key={`proyect-${index}`} {...proyect}/>))
                }
            </section>
        </section>
    )
}