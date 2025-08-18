import { Input as InputComp } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Input({
    register,
    name,
    type = "text",
    label,
    placeholder,
    errors,
    rules = {}
}) {
    const errorMsg = errors?.[name]?.message;
    return (
        <div className="space-y-2">
            {label && <Label htmlFor="username">{label}</Label>}
            <InputComp
                // id="username"
                className={`${errorMsg ? "border border-red-500 focus:border-red-500" : ""}`}
                type={type}
                placeholder={placeholder}
                // value={credentials.username}
                // onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                // required
                {...register(name, rules)}
            />
            <span className="text-xs text-red-500">{errorMsg}</span>
        </div>
    )
}
