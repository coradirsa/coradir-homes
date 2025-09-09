import Image from "next/image";

export default function SectionRooms() { 
    const rooms = [
        {
            title: "Comedor",
            image: "/img/vivienda-joven/ambiente-0.png",
        },
        {
            title: "Cocina",
            image: "/img/vivienda-joven/ambiente-1.png",
        },
        {
            title: "Baño",
            image: "/img/vivienda-joven/ambiente-2.png",
        },
        {
            title: "2 dormitorios",
            image: "/img/vivienda-joven/ambiente-3.png",
        },
    ]
    

    return ( 
        <>
            <section className="container gap-5 flex flex-col items-center justify-center bg-white py-10">
                <h3 className="text-3xl md:text-5xl font-raleway font-bold text-center text-black w-full">
                    Proyecto en pozo <span className="hidden md:inline">·</span> <br className="md:hidden"/>
                    Viviendas inteligentes <span className="hidden md:inline">·</span>  <br className="md:hidden"/>
                    +60 familias proyectadas
                </h3>
                <p className="text-xl md:text-3xl font-raleway text-center text-black w-full">
                    Juana Koslay, San Luis <span className="hidden md:inline">–</span> <br className="md:hidden"/>
                    a sólo 15 minutos del centro
                    </p>
            </section>
            <section className="w-full flex flex-col items-center justify-center">
                <p className="mb-2 text-2xl md:text-4xl font-raleway text-center text-black w-full">Obtené tu propio departamento</p>
                <article className="flex flex-col items-center justify-center">
                    <h2 className="text-6xl md:text-8xl font-playfair text-center text-blue amb relative">Ambientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 w-full gap-5 md:gap-5 2xl:gap-2 py-10">
                        {
                            rooms.map((room,index)=>(
                                <div key={`room-${index}`} className="relative flex flex-col items-center h-[100vh] md:h-[70vh] justify-center md:opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-500 opacity-100 hover:z-10">
                                    <Image  
                                        src={room.image}
                                        alt={room.title}
                                        width={1000}
                                        height={1000}
                                        className="w-full h-full object-cover"
                                    />
                                    <h3 className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-4xl xl:text-5xl font-raleway text-center text-white bg-blue w-72 xl:w-96 rounded-full ">{room.title}</h3>
                                </div>
                            ))
                        }
                    </div>
                </article>
            </section>  
        </>
    );
}