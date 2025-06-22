import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorProps {
    message?: string
}

export default function FormError({ message }: FormErrorProps) {
    if (!message) return null;
    return (
        <div className="bg-destructive/20 rounded-md text-sm p-[10px] gap-x-2 text-destructive flex items-center justify-center">
            <FaExclamationTriangle className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}
