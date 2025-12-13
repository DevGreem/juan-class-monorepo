"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import PHPApi from "@/src/types/PHPApi";
import { InventoryProduct } from "@/src/types/inventory";

export default function InventoryClient() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    stock: "",
    cost: "",
    price: "",
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await PHPApi.get("products");
        setProducts(data || []);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el inventario.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter((product) => {
      const categoryNames = (product.categories || []).map((c) => c.name.toLowerCase()).join(" ");
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized) ||
        categoryNames.includes(normalized)
      );
    });
  }, [products, search]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const startEditing = (product: InventoryProduct) => {
    setEditingId(product.id);
    setFormState({
      name: product.name,
      stock: product.stock?.toString() ?? "",
      cost: product.cost != null ? product.cost.toString() : "",
      price: product.salable?.price != null ? String(product.salable.price) : "",
      is_active: product.is_active,
    });
    setFormError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormError(null);
  };

  const handleFieldChange = (field: "name" | "stock" | "cost" | "price") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const toggleActive = () => {
    setFormState((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  const handleSave = async () => {
    if (editingId === null) {
      return;
    }

    const trimmedName = formState.name.trim();
    if (!trimmedName) {
      setFormError("El nombre es obligatorio.");
      return;
    }

    const payload: Record<string, unknown> = { name: trimmedName, is_active: formState.is_active };

    if (formState.stock !== "") {
      const stockValue = Number(formState.stock);
      if (!Number.isInteger(stockValue) || stockValue < 0) {
        setFormError("El stock debe ser un entero mayor o igual a 0.");
        return;
      }
      payload.stock = stockValue;
    }

    if (formState.cost !== "") {
      const costValue = Number(formState.cost);
      if (Number.isNaN(costValue) || costValue < 0) {
        setFormError("El costo debe ser un numero mayor o igual a 0.");
        return;
      }
      payload.cost = costValue;
    }

    if (formState.price !== "") {
      const priceValue = Number(formState.price);
      if (Number.isNaN(priceValue) || priceValue < 0) {
        setFormError("El precio debe ser un numero mayor o igual a 0.");
        return;
      }
      payload.price = priceValue;
    } else {
      payload.price = null;
    }

    try {
      setSaving(true);
      setFormError(null);
      const updatedProduct = await PHPApi.patch(`products/${editingId}`, {}, payload);
      setProducts((prev) =>
        prev.map((item) => (item.id === editingId ? updatedProduct : item))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setFormError("No se pudo guardar el producto. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {loading && <p className="text-stone-700">Cargando inventario...</p>}
      {error && <p className="text-red-700">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <label htmlFor="inventory-search" className="sr-only">
                Buscar en inventario
              </label>
              <input
                id="inventory-search"
                type="search"
                placeholder="Buscar por nombre, SKU o categoria"
                value={search}
                onChange={handleSearchChange}
                className="w-full rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm text-stone-700 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white/90 shadow-md ring-1 ring-amber-100">
            <table className="min-w-full divide-y divide-amber-100">
            <thead className="bg-amber-50/80 text-left text-sm font-semibold text-amber-900">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Costo</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Categorias</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50 text-sm text-stone-800">
              {filteredProducts.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} className={isEditing ? "bg-amber-50/40" : "hover:bg-amber-50/50"}>
                    <td className="px-4 py-3 font-mono text-xs text-stone-600">{item.sku}</td>
                    <td className="px-4 py-3 font-semibold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={formState.name}
                          onChange={handleFieldChange("name")}
                          className="w-full rounded-full border border-amber-200 px-3 py-1 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={formState.stock}
                          onChange={handleFieldChange("stock")}
                          className="w-20 rounded-full border border-amber-200 px-3 py-1 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      ) : (
                        item.stock
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={formState.cost}
                          onChange={handleFieldChange("cost")}
                          className="w-24 rounded-full border border-amber-200 px-3 py-1 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      ) : item.cost != null ? (
                        `$${Number(item.cost).toFixed(2)}`
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={formState.price}
                          onChange={handleFieldChange("price")}
                          className="w-24 rounded-full border border-amber-200 px-3 py-1 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      ) : item.salable?.price ? (
                        `$${Number(item.salable.price).toFixed(2)}`
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">
                      {item.categories && item.categories.length > 0
                        ? item.categories.map((c) => c.name).join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <button
                          onClick={toggleActive}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            formState.is_active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {formState.is_active ? "Activo" : "Inactivo"}
                        </button>
                      ) : item.is_active ? (
                        "Si"
                      ) : (
                        "No"
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEditing}
                            disabled={saving}
                            className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-stone-700 transition hover:bg-amber-50 disabled:opacity-60"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:opacity-70"
                          >
                            {saving ? "Guardando..." : "Guardar"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(item)}
                          disabled={editingId !== null}
                          className="rounded-full px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!filteredProducts.length && products.length > 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-stone-600">
                    No hay productos que coincidan con tu busqueda.
                  </td>
                </tr>
              )}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-stone-600">
                    No hay productos en inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>

          {formError && (
            <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {formError}
            </div>
          )}
        </div>
      )}
    </>
  );
}
