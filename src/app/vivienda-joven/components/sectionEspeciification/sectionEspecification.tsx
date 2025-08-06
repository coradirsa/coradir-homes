import ItemSpecification from "./components/itemSpecification";

export default function SectionEspecification() {
    const specifications = [
        { 
            title: "Construcción rápida",
        },
        { 
            title: "Seguridad con IA 24 hs",
        },
        { 
            title: "Zona comercial",
        },
        { 
            title: "Estacionamientos",
        },
        { 
            title: "Conectividad optimizada",
        },
    ];
    const subArr: {title: string; }[][] = [];
    for (let i=0; i<specifications.length; i+=3){
        subArr.push(specifications.slice(i,i+3));
    }
    return (
        <section className="w-full bg-white"> 
                <section className="container pt-10 px-5 gap-5 flex flex-col items-center justify-center bg-white">
                    {
                        subArr.map((a,index)=>(
                            <div key={`${index}`} className="flex flex-col md:flex-row items-center justify-center w-full gap-5">
                                {
                                    a.map((item,index)=>(
                                        <ItemSpecification
                                            key={`specification-${index}`}
                                            icon={`/icons/vivienda-joven/0${index+1}.png`}
                                            title={item.title}
                                        />
                                    ))
                                }
                            </div>
                        ))
                    }
                </section>
            </section>
    );
}