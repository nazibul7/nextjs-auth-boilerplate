import { FaCheckCircle } from "react-icons/fa";

interface FormErrorProps {
    message?: string
}

export default function FormSuccess({ message }: FormErrorProps) {
    if (!message) return null;
    return (
        <div className="bg-emerald-500/15 rounded-md text-sm p-[10px] gap-x-2 text-emerald-500 flex items-center justify-center">
            <FaCheckCircle className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}
