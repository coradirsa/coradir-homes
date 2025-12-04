import ItemSpecification from "./components/itemSpecification";

export default function SectionEspecification({
    specifications,
    border,
    x=3
}:{
    specifications:{title: string;icon:string }[];
    border:boolean;
    x?:number;
}) {
    
    const subArr: {title: string;icon:string }[][] = [];
    for (let i=0; i<specifications.length; i+=x){
        subArr.push(specifications.slice(i,i+x));
    }
    return (
        <section className="w-full bg-white"> 
                <section className="container py-10 px-5 gap-5 flex flex-col items-center justify-center bg-white">
                    {
                        subArr.map((a,index)=>(
                            <div key={`${index}`} className="flex flex-col md:flex-row items-center justify-center w-full gap-5">
                                {
                                    a.map((item,index)=>(
                                        <ItemSpecification
                                            key={`specification-${index}`}
                                            icon={item.icon}
                                            title={item.title}
                                            border={border}
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