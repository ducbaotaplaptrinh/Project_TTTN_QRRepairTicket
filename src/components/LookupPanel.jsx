import { AlertCircle, ArrowRight, Phone, QrCode, Search, Wrench } from 'lucide-react';

const repairStages = [
  { title: 'Tiếp nhận máy', description: 'Ghi nhận yêu cầu và thông tin thiết bị.' },
  { title: 'Chẩn đoán lỗi', description: 'Kiểm tra nguyên nhân và hướng khắc phục.' },
  { title: 'Đang xử lý', description: 'Kỹ thuật viên tiến hành sửa chữa.' },
  { title: 'Đã hoàn tất', description: 'Kiểm tra lần cuối trước khi bàn giao.' },
];

export default function LookupPanel({
  lookupType,
  setLookupType,
  setCustomerTickets,
  setLookupSearched,
  lookupInput,
  setLookupInput,
  isLoadingTickets,
  ticketLoadError,
  customerTicketError,
  handleCustomerLookup,
  handleStartCustomerTicket,
  isStartingCustomerTicket,
  customerTickets,
  lookupSearched,
  getStatusBadge,
  setSelectedTicket,
  setActiveTab,
}) {
  return (
    <div className="app-lookup-view space-y-6">
      <div className="app-lookup-panel bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200/80 text-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tra Cứu Tình Trạng Thiết Bị</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Nhập số điện thoại để xem toàn bộ máy đang sửa, hoặc nhập chính xác mã phiếu
        </p>

        <div className="inline-flex bg-slate-100/90 p-1 rounded-xl mb-6 text-xs md:text-sm font-medium">
          <button
            onClick={() => { setLookupType('phone'); setCustomerTickets([]); setLookupSearched(false); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all ${
              lookupType === 'phone' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4" /> Tra cứu theo Số Điện Thoại
          </button>
          <button
            onClick={() => { setLookupType('ticketId'); setCustomerTickets([]); setLookupSearched(false); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all ${
              lookupType === 'ticketId' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" /> Tra cứu theo Mã Phiếu
          </button>
        </div>

        <form onSubmit={handleCustomerLookup} className="app-lookup-form flex gap-2.5 max-w-xl mx-auto">
          <input
            type="text"
            required
            placeholder={lookupType === 'phone' ? 'Ví dụ: 0901234567' : 'Nhập mã phiếu do hệ thống cấp'}
            className="flex-1 text-sm border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoadingTickets}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition shadow-sm shadow-blue-500/20"
          >
            <Search className="w-4 h-4" /> {isLoadingTickets ? 'Đang tải...' : 'Tra Cứu'}
          </button>
        </form>

        {(ticketLoadError || customerTicketError) && !/404/i.test(ticketLoadError || customerTicketError) && (
          <div className="max-w-xl mx-auto mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {(ticketLoadError || customerTicketError)}
          </div>
        )}

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-500 mb-3">Chưa có phiếu sửa chữa?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-2.5">
            <button
              type="button"
              onClick={handleStartCustomerTicket}
              disabled={isStartingCustomerTicket}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
            >
              <Wrench className="w-4 h-4" /> {isStartingCustomerTicket ? 'Đang tạo phiếu...' : 'Tạo phiếu sửa chữa'}
            </button>
          </div>
        </div>
      </div>

      {lookupSearched && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 px-1">
            Kết quả tra cứu ({customerTickets.length} thiết bị):
          </h3>

          {isLoadingTickets ? (
            <p className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">Đang tải dữ liệu từ hệ thống...</p>
          ) : customerTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerTickets.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  onClick={() => { setSelectedTicket(item); setActiveTab('detail'); }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {item.id}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <h4 className="font-bold text-slate-800 text-base">{item.deviceName}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">Lỗi: {item.issueDescription}</p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Ngày nhận: {item.createdAt}</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Xem tiến độ <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-2.5 text-slate-300" />
              <p className="text-sm font-medium">Không tìm thấy thiết bị nào khớp với thông tin bạn vừa nhập.</p>
            </div>
          )}
        </div>
      )}

      <section className="app-repair-flow" aria-labelledby="repair-flow-title">
        <div className="app-repair-flow-heading">
          <div>
            <p className="app-repair-flow-kicker">THEO DÕI SỬA CHỮA</p>
            <h3 id="repair-flow-title">Tiến trình xử lý thiết bị</h3>
          </div>
          <span className="app-repair-flow-count">04 giai đoạn</span>
        </div>
        <ol className="app-repair-flow-list">
          {repairStages.map((stage, index) => (
            <li className="app-repair-flow-item" key={stage.title}>
              <span className="app-repair-flow-number">0{index + 1}</span>
              <h4>{stage.title}</h4>
              <p>{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
