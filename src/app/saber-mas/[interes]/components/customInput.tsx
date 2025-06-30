import { Controller, Control, FieldErrors, ControllerRenderProps, ControllerFieldState, UseFormStateReturn } from "react-hook-form";
import { FormSchema } from "./formSchema";
import { JSX } from "react";
type ControllerRenderArg = {
    field: ControllerRenderProps<FormSchema, keyof FormSchema>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FormSchema>;
  };
export default function CustomInput({
    name,
    label,
    type,
    control,
    errors,
    ref,
    options
}:{
    name:keyof FormSchema,
    label:string,
    type:string,
    control:Control<FormSchema>,
    errors:FieldErrors<FormSchema>,
    ref:React.RefObject<HTMLInputElement | HTMLTextAreaElement | null  >,
    options?: string[]
}){
    let render: (e: ControllerRenderArg) => JSX.Element;
    switch(type){
        case "select":
            render = (e)=>(
                <div className="rounded-2xl bg-white p-4  py-1 md:p-0 xl:pr-8  mt-5">
                    <select
                        {...e.field}
                        id={name}
                        ref={ref as unknown as React.RefObject<HTMLSelectElement>}
                        className="outline-none text-blue text-xl p-0 uppercase text-left text-raleway w-full md:p-8 md:py-3 cursor-pointer"
                        >
                        {options?.map((option) => (
                            <option
                            key={option}
                            value={option}
                            className={e.field.value === option ? "text-sm md:text-lg" : "text-xs md:text-lg"}
                            >
                            {option}
                            </option>
                        ))}
                    </select>
                </div>
            );
            break;
        case "textarea":
            render = (e)=>(
                <textarea
                    {...e.field}
                    id={name}
                    ref={ref as React.RefObject<HTMLTextAreaElement>}
                    className="border-b-2 border-white/50 focus:border-b-2 outline-none focus:border-white w-[80%] h-24 md:h-auto md:text-xl resize-none cursor-pointer"
                />
            );
            break;
        default:
            render = (e)=>(
                <input
                    type={type}
                    {...e.field}
                    id={name}
                    ref={ref as React.RefObject<HTMLInputElement>}
                    className="border-b-2 border-white/50 focus:border-b-2 outline-none focus:border-white w-[80%] autofill:!bg-transparent cursor-pointer"
                />
            );
            break;
    }
    return(
        <Controller 
            name={name}
            control={control}
            render={(e)=>{
                return (
                    <div className="flex flex-col items-center justify-center gap-2 md:gap-4 text-white font-raleway w-full text-lg md:text-xl">
                        <label htmlFor={name} className="md:text-2xl">{label}</label>
                        {render(e)}
                        {errors[name] && <p className="text-red-400 text-sm mt-2 h-5 text-left w-[80%]">
                            {(errors[name].message)}
                        </p>}
                    </div>
                );
            }} 
        />
    );
}