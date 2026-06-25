interface InputProps {
    id: string
    name: string
    type?: string
    value: string
    onChange: (val: string) => void;
    themeContext?: any,
    placeholder?: string,
    error?: string;
}

export function FormInputField({
    id,
    name,
    type,
    value,
    onChange,
    placeholder,
    error
    
}: InputProps){
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
                {name}
            </label>              
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder ?? ""}
                className={`w-full px-4 py-3
                  border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 ring-[#2563eb]
                    ${error ? "border border-red-500 ring-red-500" : "border-gray-200 ring-[#2563eb]"}
                    bg-gray
                `}
                />
                {error && <span className="text-red-500 text-xs font-medium">{error}</span>}
        </div>
    );
}