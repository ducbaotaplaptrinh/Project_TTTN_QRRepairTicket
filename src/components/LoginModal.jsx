import { AlertCircle, Lock, LogIn, ShieldCheck, X } from 'lucide-react';

export default function LoginModal({
  showLoginModal,
  setShowLoginModal,
  loginForm,
  setLoginForm,
  loginError,
  isLoggingIn,
  handleLogin,
}) {
  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative border border-slate-100">
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Đăng Nhập Kỹ Thuật Viên</h3>
          <p className="text-xs text-slate-500 mt-0.5">Dành riêng cho nhân viên tiếp nhận &amp; sửa chữa</p>
        </div>

        {loginError && (
          <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Tài khoản</label>
            <input
              type="text"
              required
              placeholder="Nhập tên tài khoản"
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              placeholder="Nhập mật khẩu"
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition mt-2 flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
          >
            <LogIn className="w-4 h-4" /> {isLoggingIn ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
