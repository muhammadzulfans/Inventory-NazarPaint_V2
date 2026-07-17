// import { useState } from "react";
// import { FiCheck, FiShoppingBag } from "react-icons/fi";
// import useAuthStore from "../../../store/authStore";
// import SuccessModal from "../../../components/modals/SuccessModal.jsx";
// // IMPORT DATA DARI FILE TERPISAH
// import { SwitchBranch } from "../../../dummy/dataAdmin/Data/SwitchBranch.js";
//
// const SwitchToko = () => {
//     const { activeStore, setActiveStore } = useAuthStore();
//     const [selectedId, setSelectedId] = useState(activeStore?.id || null);
//     const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//
//     const selectedStore = SwitchBranch.find((s) => s.id === selectedId);
//
//     const handleConnect = () => {
//         if (selectedStore) {
//             setActiveStore(selectedStore);
//             setIsSuccessOpen(true);
//         }
//     };
//
//     return (
//         <div className="px-8 pt-6 pb-10 bg-white min-h-screen flex items-start justify-center font-inter">
//
//             <SuccessModal
//                 isOpen={isSuccessOpen}
//                 onClose={() => setIsSuccessOpen(false)}
//                 message={`Berhasil menyambungkan ke ${activeStore?.nama}.`}
//             />
//
//             <div className="bg-card shadow-[0_4px_10px_rgba(0,0,0,0.1)] w-full max-w-xl mt-10 rounded-2xl overflow-hidden border border-line">
//                 {/* HEADER */}
//                 <div className="flex items-start gap-4 px-7 pt-7 pb-6">
//                     <div className="w-12 h-12 bg-auth rounded-2xl flex items-center justify-center text-2xl shrink-0">
//                         <FiShoppingBag className="text-black" />
//                     </div>
//                     <div>
//                         <h2 className="text-xl font-bold text-black text-left">Pilih Cabang Aktif</h2>
//                         <p className="text-sm text-txtNav mt-1 text-left">Data yang tampil akan disesuaikan dengan cabang terpilih.</p>
//                     </div>
//                 </div>
//
//                 {/* STORE LIST (MAPPING DARI IMPORT) */}
//                 <div className="flex flex-col gap-3 px-7 pb-6">
//                     {SwitchBranch.map((store) => {
//                         const isSelected = selectedId === store.id;
//                         return (
//                             <button
//                                 key={store.id}
//                                 type="button"
//                                 onClick={() => setSelectedId(store.id)}
//                                 className={`flex items-center gap-4 bg-white px-5 py-4 rounded-xl text-left border-2 transition-all ${
//                                     isSelected ? "border-auth bg-auth/5" : "border-transparent shadow-sm"
//                                 }`}
//                             >
//                                 <div className="w-14 h-14 bg-iconBG rounded-xl flex items-center justify-center text-2xl shrink-0">
//                                     {store.icon}
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-bold text-black">{store.nama}</p>
//                                     <p className="text-xs text-txtNav truncate">{store.alamat}</p>
//                                     <div className="flex items-center gap-3 mt-2">
//                                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${store.badgeColor}`}>
//                                             {store.tipe}
//                                         </span>
//                                         <span className="text-[11px] text-txtNav">📦 {store.stok}</span>
//                                     </div>
//                                 </div>
//                                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
//                                     isSelected ? "border-auth bg-auth" : "border-line"
//                                 }`}>
//                                     {isSelected && <FiCheck className="text-black size-4 stroke-[3]" />}
//                                 </div>
//                             </button>
//                         );
//                     })}
//                 </div>
//
//                 {/* ACTION BUTTON */}
//                 <div className="px-7 pb-7">
//                     <button
//                         type="button"
//                         onClick={handleConnect}
//                         disabled={!selectedId || selectedId === activeStore?.id}
//                         className={`w-full py-4 rounded-xl text-sm font-bold transition-all ${
//                             selectedId && selectedId !== activeStore?.id
//                                 ? "bg-button text-black shadow-md"
//                                 : "bg-gray-100 text-txtNav cursor-not-allowed"
//                         }`}
//                     >
//                         {selectedId === activeStore?.id
//                             ? `Sudah Terhubung`
//                             : "Hubungkan Cabang"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default SwitchToko;