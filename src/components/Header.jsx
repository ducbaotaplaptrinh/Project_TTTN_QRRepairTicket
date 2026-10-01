import {
  Monitor,
  Search,
  Camera,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Lock,
} from 'lucide-react';

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  canShowKtvLogin,
  handleLogout,
  setLoginError,
  setShowLoginModal,
  setScannerError,
}) {
  return (
    <header className="app-header bg-white p-4 md:px-6 md:py-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="app-brand flex items-center gap-3.5">
        <div className="app-brand-icon p-2.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-500/20">
          <Monitor className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">Cổng Tiếp Nhận &amp; Tra Cứu Bảo Hành Thiết Bị</h1>
          <p className="text-xs text-slate-500 mt-0.5">Tra cứu tiến độ qua mã QR / SĐT &amp; Quản lý điều phối sửa chữa</p>
        </div>
      </div>

      <div className="app-header-controls flex items-center gap-2">
        <div className="app-navigation flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs md:text-sm font-medium">
          {!currentUser && (
            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'lookup' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" /> <span className="app-nav-label">Khách tra cứu</span>
            </button>
          )}

          <button
            onClick={() => { setScannerError(''); setActiveTab('scan'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'scan' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" /> <span className="app-nav-label">Quét QR</span>
          </button>

          {currentUser && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> <span className="app-nav-label">Quản Lý</span>
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'create' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> <span className="app-nav-label">Tạo phiếu</span>
              </button>
            </>
          )}
        </div>

        {canShowKtvLogin && (currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg hidden md:inline-block">
              KTV: {currentUser.name}
            </span>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setLoginError(''); setShowLoginModal(true); }}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" /> Đăng Nhập KTV
          </button>
        ))}
      </div>
    </header>
  );
}
