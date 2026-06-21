import { useState } from "react";
import type { FormEvent } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useNavigate } from "react-router";
import { userUser } from "../../context/UserContext";

const ROLES = [
  { value: "receiver", label: "Receiver" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
] as const;

const selectClasses =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 fill=%22none%22><path d=%22M5 7.5L10 12.5L15 7.5%22 stroke=%22%2398A2B3%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[right_1rem_center] px-4 py-2.5 pr-10 text-sm text-text shadow-theme-xs focus:border-primary focus:outline-hidden focus:ring-3 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-secondary";

export default function SignInForm() {
  const navigate = useNavigate();
  const { setCurrUser } = userUser();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [role, setRole] = useState("");

  const handleSignin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrUser(role);

    navigate("/");
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-text text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select your role and enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSignin}>
            <div className="space-y-6">
              <div>
                <Label>
                  Role <span className="text-danger">*</span>
                </Label>
                <select
                  className={selectClasses}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* 
              <div>
                <Label>
                  Username <span className="text-danger">*</span>
                </Label>
                <Input placeholder="Enter your username" />
              </div>

              <div>
                <Label>
                  Password <span className="text-danger">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div> */}
              {/* 
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <span className="text-sm text-secondary cursor-default">
                  Forgot password?
                </span>
              </div> */}

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-secondary"
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-500 dark:text-gray-400">
              Need access? Contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
