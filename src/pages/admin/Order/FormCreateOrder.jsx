import DropDownField from "../../../components/forms/DropDownField.jsx";
import InputField from "../../../components/forms/InputField.jsx";

const FormCreateOrder = ({
                              storeOptions, selectedStore, setSelectedStore,
                              productOptions, itemForm, setItemForm,
                              handleProductChange, handleAddItemToList,
                              hasItems, isEditingItem, onCancelEditItem,
                          }) => {
    return (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-md font-semibold text-gray-800">
                    {isEditingItem ? "Edit Item Pesanan" : "Tambah Item ke Pesanan"}
                </h2>
            </div>

            <div className="flex flex-col gap-4">
                <DropDownField
                    label="CABANG TOKO"
                    options={storeOptions}
                    value={selectedStore}
                    onChange={(val) => setSelectedStore(val)}
                    placeholder="Cari atau pilih cabang toko..."
                    disabled={hasItems}
                />

                <DropDownField
                    label="PRODUK"
                    options={productOptions}
                    value={itemForm.productId}
                    onChange={handleProductChange}
                    placeholder="Cari produk berdasarkan nama atau tipe..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="KUANTITAS PESANAN (KG/PCS)"
                        type="number"
                        placeholder="0"
                        value={itemForm.quantity}
                        onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                    />
                    <InputField
                        label="HARGA SATUAN (HARGA BELI)"
                        type="number"
                        placeholder="0"
                        value={itemForm.basePrice}
                        onChange={(e) => setItemForm({ ...itemForm, basePrice: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    {isEditingItem && (
                        <button
                            onClick={onCancelEditItem}
                            className="border-2 border-line text-txtNav font-semibold text-xs px-5 py-3 rounded-xl transition-colors hover:bg-gray-50"
                        >
                            Batal
                        </button>
                    )}
                    <button
                        onClick={handleAddItemToList}
                        className="bg-button font-inter text-black font-semibold text-xs px-5 py-3 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                    >
                        {isEditingItem ? (
                            "Simpan Perubahan Item"
                        ) : (
                            <>
                                <span className="text-sm">+</span> Tambahkan ke Daftar Pesanan
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormCreateOrder;