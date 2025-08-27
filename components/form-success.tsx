import { FaCheckCircle } from "react-icons/fa";

interface FormErrorProps {
    message?: string
}

export default function FormSuccess({ message }: FormErrorProps) {
    if (!message) return null;
    return (
        <div className="bg-emerald-500/15 rounded-md text-sm p-[10px] gap-2 text-emerald-500 flex justify-center text-center">
            <FaCheckCircle className="h-4 w-4 flex flex-shrink-0 mt-[3px] " />
            <p className="text-start">{message}</p>
        </div>
    )
}
