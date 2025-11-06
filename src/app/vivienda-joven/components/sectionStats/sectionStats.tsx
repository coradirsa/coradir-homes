"use client";

import ButtonContact from "@/app/components/buttonContact";
import Image from "next/image";
import Counter from "./components/counter";

const stats = [
    {
        count: 44,
        text: (
            <>
                Departamentos <b>disponibles</b>
            </>
        ),
    },
    {
        count: 20,
        text: (
            <>
                Departamentos <b>reservados</b>
            </>
        ),
    },
];

// Temporalmente comentado - datos de planes de pago
// const tableHeader = ["Esquema", "Precio ref.", "Reserva", "A 30 dias", "A 120-180 dias", "Entrega/posicion"];

// const tableRows = [
//     {
//         scheme: "Lista",
//         price: "USD 63.000",
//         reserve: "3%",
//         to30: "Completar hasta 10%",
//         to180: "-",
//         delivery: "90%",
//     },
//     {
//         scheme: "Preferencial",
//         price: "USD 55.000",
//         reserve: "3%",
//         to30: "40%",
//         to180: "40%",
//         delivery: "20%",
//     },
//     {
//         scheme: "Inversor",
//         price: "CONSULTAR",
//         reserve: "3%",
//         to30: "Boleto por 100% (saldo)",
//         to180: "-",
//         delivery: "-",
//     },
// ];

export default function SectionStats() {
    return (
        <section className="w-full bg-white">
            <section className="container py-10 px-5 gap-5 flex flex-col items-center justify-center bg-white">
                <article className="gap-10 flex items-center justify-evenly">
                    {stats.map((stat, index) => (
                        <div className="flex flex-col items-center justify-center gap-5" key={`stat-${index}`}>
                            <Counter end={Number(stat.count)} duration={1.0} />
                            <span className="text-xl text-center text-black flex flex-col items-center justify-center font-playfair">
                                {stat.text}
                            </span>
                        </div>
                    ))}
                </article>
                <ButtonContact
                    href="#formulario"
                    className="bg-blue text-white hover:opacity-100 opacity-95 my-10 text-[18px]"
                    label="Sumate a este gran proyecto"
                />
                <Image
                    loading="lazy"
                    src="/img/vivienda-joven/croquis.webp"
                    alt="Croquis viviendas"
                    width={2000}
                    height={2000}
                    className="md:w-[70%] h-full object-cover"
                />
                {/* Temporalmente comentado - planes de pago */}
                {/* <h2 className="text-3xl md:text-4xl xl:text-7xl 2xl:text-9xl text-blue w-full font-playfair text-center leading-tight font-bold pt-10">
                    Accede a planes de pago
                </h2>
                <div className="container">
                    <div className="w-full rounded-xl border-3 border-blue grid font-raleway text-[10px] sm:text-sm md:text-lg xl:text-2xl">
                        <div className="grid grid-cols-6 items-center font-bold p-4 px-2 xl:px-8 border-b-3 border-blue text-center">
                            {tableHeader.map((header, index) => (
                                <span key={`header-${index}`} className={index === 0 ? "text-left" : ""}>
                                    {header}
                                </span>
                            ))}
                        </div>
                        {tableRows.map((row, index) => (
                            <div
                                key={`row-${index}`}
                                className={`grid grid-cols-6 items-center w-full p-4 px-2 xl:px-8 text-center ${
                                    index < tableRows.length - 1 ? "border-b-2 border-blue/60" : ""
                                }`}
                            >
                                <span className="font-bold text-left uppercase">{row.scheme}</span>
                                <span>{row.price}</span>
                                <span>{row.reserve}</span>
                                <span>{row.to30}</span>
                                <span>{row.to180}</span>
                                <span>{row.delivery}</span>
                            </div>
                        ))}
                    </div>
                </div> */}
            </section>
        </section>
    );
}
