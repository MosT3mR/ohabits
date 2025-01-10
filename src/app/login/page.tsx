import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto">
        <div className="p-4 bg-white rounded-lg space-y-6">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-center font-bold text-[23px] leading-[122%] tracking-[-0.02em] text-[#1e0c02]">Login</h1>
            <Image src="/svg/login.svg" alt="Logo" width={24} height={24} />
          </div>

          {/* Email & Password Form */}
          <div className="space-y-4">
            <div>
              <div className="relative">
                <Image 
                  src="/svg/email.svg" 
                  alt="Email" 
                  width={16} 
                  height={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
                <input 
                  type="email"
                  className="w-full pl-12 pr-4 py-2 rounded bg-[#FEF7F3] border border-[#EAEBEB] placeholder:text-[#5F6666] text-[#1e0c02]"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Image 
                  src="/svg/password.svg" 
                  alt="Password" 
                  width={16} 
                  height={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
                <input 
                  type="password"
                  className="w-full pl-12 pr-4 py-2 rounded bg-[#FEF7F3] border border-[#EAEBEB] placeholder:text-[#5F6666] text-[#1e0c02]"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <button className="w-full bg-[#F2600C] text-[#fcfcfc] py-3 rounded font-semibold text-[18px] leading-[120%]">
              Sign In
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e0c02]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#1e0c02]">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-1">
            <button className="w-full flex items-center justify-center gap-2 py-3 border border-[#EAEBEB] rounded">
              <Image src="/svg/google.svg" alt="Google" width={20} height={20} className="text-[#181919]" />
              <span className="font-semibold text-[18px] leading-[120%] text-center text-[#181919]">Sign In with Google</span>
            </button>
          </div>

          {/* Create Account & Reset Password */}
          <div className="text-center space-y-4">
            <button className="w-full py-3 border border-[#EAEBEB] rounded">
              <span className="font-semibold text-[18px] leading-[120%] text-[#181919]">Create Account</span>
            </button>
            <Link href="/reset-password" className="block text-[12px] font-semibold leading-[117%] tracking-[0.08em] uppercase underline decoration-skip-ink-none text-black">
              RESET YOUR PASSWORD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}