"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import PHPApi from "@/src/types/PHPApi";
import { InventoryProduct } from "@/src/types/inventory";
import { Category } from "@/src/types/products";

type EditFieldKey = "name" | "stock" | "cost" | "price" | "description";

type EditFormState = {
  name: string;
  description: string;
  stock: string;
  cost: string;
  price: string;
  is_active: boolean;
  categoryIds: number[];
};

type CreateFormState = EditFormState & {
  sku: string;
};

const makeEmptyEditForm = (): EditFormState => ({
  name: "",
  description: "",
  stock: "",
  cost: "",
  price: "",
  is_active: true,
  categoryIds: [],
});

const makeEmptyCreateForm = (): CreateFormState => ({
  ...makeEmptyEditForm(),
  sku: "",
});

const sortProductsByName = (list: InventoryProduct[]) =>
  [...list].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

export default function InventoryClient() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState<EditFormState>(() => makeEmptyEditForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(() => makeEmptyCreateForm());
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          PHPApi.get("products"),
          PHPApi.get("categories"),
        ]);
        const normalizedProducts = (() => {
          if (Array.isArray(productsData)) {
            return productsData as InventoryProduct[];
          }

          if (
            productsData &&
            typeof productsData === "object" &&
            Array.isArray((productsData as { data?: unknown }).data)
          ) {
            return (productsData as { data: InventoryProduct[] }).data;
          }

          return [] as InventoryProduct[];
        })();

        setProducts(sortProductsByName(normalizedProducts));
        const normalizedCategories = (() => {
          if (Array.isArray(categoriesData)) {
            return categoriesData as Category[];
          }

          if (
            categoriesData &&
            typeof categoriesData === "object" &&
            Array.isArray((categoriesData as { data?: unknown }).data)
          ) {
            return (categoriesData as { data: Category[] }).data;
          }

          return [] as Category[];
        })();
        setCategories(normalizedCategories);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el inventario o las categorias.");
      } finally {
        setLoading(false);
        setCategoriesLoaded(true);
      }
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter((product) => {
      const categoryNames = (product.categories || []).map((c) => c.name.toLowerCase()).join(" ");
      const description = product.description?.toLowerCase() ?? "";
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized) ||
        description.includes(normalized) ||
        categoryNames.includes(normalized)
      );
    });
  }, [products, search]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const startEditing = (product: InventoryProduct) => {
    setCreateMode(false);
    setCreateError(null);
    setCreateForm(makeEmptyCreateForm());
    setEditingId(product.id);
    setFormState({
      name: product.name,
      description: product.description ?? "",
      stock: product.stock?.toString() ?? "",
      cost: product.cost != null ? product.cost.toString() : "",
      price: product.salable?.price != null ? String(product.salable.price) : "",
      is_active: product.is_active,
      categoryIds: (product.categories || []).map((category) => category.id),
    });
    setFormError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormError(null);
    setFormState(makeEmptyEditForm());
  };

  const handleFieldChange = (field: EditFieldKey) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const handleCreateFieldChange = (field: EditFieldKey | "sku") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setCreateForm((prev) => ({ ...prev, [field]: value }));
    };

  const toggleActive = () => {
    setFormState((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  const toggleCreateActive = () => {
    setCreateForm((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFormState((prev) => {
      const exists = prev.categoryIds.includes(categoryId);
      const categoryIds = exists
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      return { ...prev, categoryIds };
    });
  };

  const handleCreateCategoryToggle = (categoryId: number) => {
    setCreateForm((prev) => {
      const exists = prev.categoryIds.includes(categoryId);
      const categoryIds = exists
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      return { ...prev, categoryIds };
    });
  };

  const openCreateForm = () => {
    cancelEditing();
    setCreateMode(true);
    setCreateError(null);
    setCreateForm(makeEmptyCreateForm());
  };

  const closeCreateForm = () => {
    setCreateMode(false);
    setCreateError(null);
    setCreateForm(makeEmptyCreateForm());
  };

  const toggleCreateForm = () => {
    if (createMode) {
      closeCreateForm();
    } else {
      openCreateForm();
    }
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

    const trimmedDescription = formState.description.trim();
    const payload: Record<string, unknown> = {
      name: trimmedName,
      is_active: formState.is_active,
      description: trimmedDescription ? trimmedDescription : null,
      categories: formState.categoryIds,
    };

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
        sortProductsByName(prev.map((item) => (item.id === editingId ? updatedProduct : item)))
      );
      setEditingId(null);
      setFormState(makeEmptyEditForm());
    } catch (err) {
      console.error(err);
      setFormError("No se pudo guardar el producto. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    const trimmedName = createForm.name.trim();
    const trimmedSku = createForm.sku.trim();

    if (!trimmedName) {
      setCreateError("El nombre es obligatorio.");
      return;
    }

    if (!trimmedSku) {
      setCreateError("El SKU es obligatorio.");
      return;
    }

    const trimmedDescription = createForm.description.trim();
    const payload: Record<string, unknown> = {
      name: trimmedName,
      sku: trimmedSku,
      is_active: createForm.is_active,
      description: trimmedDescription ? trimmedDescription : null,
      categories: createForm.categoryIds,
    };

    if (createForm.stock !== "") {
      const stockValue = Number(createForm.stock);
      if (!Number.isInteger(stockValue) || stockValue < 0) {
        setCreateError("El stock debe ser un entero mayor o igual a 0.");
        return;
      }
      payload.stock = stockValue;
    }

    if (createForm.cost !== "") {
      const costValue = Number(createForm.cost);
      if (Number.isNaN(costValue) || costValue < 0) {
        setCreateError("El costo debe ser un numero mayor o igual a 0.");
        return;
      }
      payload.cost = costValue;
    }

    if (createForm.price !== "") {
      const priceValue = Number(createForm.price);
      if (Number.isNaN(priceValue) || priceValue < 0) {
        setCreateError("El precio debe ser un numero mayor o igual a 0.");
        return;
      }
      payload.price = priceValue;
    }

    try {
      setCreating(true);
      setCreateError(null);
      const createdProduct = (await PHPApi.post("products", {}, payload)) as InventoryProduct;
      setProducts((prev) => sortProductsByName([...prev, createdProduct]));
      setSearch("");
      closeCreateForm();
    } catch (err) {
      console.error(err);
      setCreateError("No se pudo crear el producto. Revisa los datos e intenta nuevamente.");
    } finally {
      setCreating(false);
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
            <button
              type="button"
              onClick={toggleCreateForm}
              disabled={creating || saving}
              className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {createMode ? "Cerrar formulario" : "Agregar producto"}
            </button>
          </div>

          {createMode && (
            <div className="rounded-2xl bg-white/90 p-6 shadow-md ring-1 ring-amber-100">
              <h2 className="text-lg font-semibold text-stone-900">Nuevo producto</h2>
              <p className="mt-1 text-sm text-stone-600">
                Completa los campos para registrar un producto en el inventario.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="create-name" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Nombre
                  </label>
                  <input
                    id="create-name"
                    type="text"
                    value={createForm.name}
                    onChange={handleCreateFieldChange("name")}
                    className="rounded-full border border-amber-200 px-3 py-2 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="create-sku" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    SKU
                  </label>
                  <input
                    id="create-sku"
                    type="text"
                    value={createForm.sku}
                    onChange={handleCreateFieldChange("sku")}
                    className="rounded-full border border-amber-200 px-3 py-2 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label htmlFor="create-description" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Descripcion
                  </label>
                  <textarea
                    id="create-description"
                    rows={3}
                    value={createForm.description}
                    onChange={handleCreateFieldChange("description")}
                    className="rounded-2xl border border-amber-200 px-3 py-2 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="create-stock" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Stock
                  </label>
                  <input
                    id="create-stock"
                    type="number"
                    min={0}
                    value={createForm.stock}
                    onChange={handleCreateFieldChange("stock")}
                    className="rounded-full border border-amber-200 px-3 py-2 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="create-cost" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Costo
                  </label>
                  <input
                    id="create-cost"
                    type="number"
                    min={0}
                    step="0.01"
                    value={createForm.cost}
                    onChange={handleCreateFieldChange("cost")}
                    className="rounded-full border border-amber-200 px-3 py-2 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="create-price" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Precio
                  </label>
                  <input
                    id="create-price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={createForm.price}
                    onChange={handleCreateFieldChange("price")}
                    className="rounded-full border border-amber-200 px-3 py-2 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Estado</span>
                  <button
                    onClick={toggleCreateActive}
                    type="button"
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      createForm.is_active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {createForm.is_active ? "Activo" : "Inactivo"}
                  </button>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Categorias</span>
                  {!categoriesLoaded ? (
                    <span className="text-xs text-stone-400">Cargando categorias...</span>
                  ) : categories.length ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const checked = createForm.categoryIds.includes(category.id);
                        return (
                          <label
                            key={category.id}
                            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                              checked ? "border-amber-400 bg-amber-50 text-amber-900" : "border-amber-200 bg-white text-stone-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCreateCategoryToggle(category.id)}
                              className="h-3 w-3 rounded border-amber-200 text-amber-600 focus:ring-amber-400"
                            />
                            {category.name}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400">No hay categorias registradas.</span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCreateForm}
                  disabled={creating}
                  className="rounded-full border border-amber-200 px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating}
                  className="rounded-full bg-amber-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {creating ? "Guardando..." : "Guardar"}
                </button>
              </div>

              {createError && (
                <div className="mt-3 rounded-2xl bg-red-100 px-4 py-2 text-sm text-red-700 ring-1 ring-red-200">
                  {createError}
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl bg-white/90 shadow-md ring-1 ring-amber-100">
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-[1100px] divide-y divide-amber-100">
                <thead className="bg-amber-50/80 text-left text-sm font-semibold text-amber-900">
                  <tr>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Descripcion</th>
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
                        <td className="px-4 py-3 align-top text-sm text-stone-700">
                          {isEditing ? (
                            <textarea
                              value={formState.description}
                              onChange={handleFieldChange("description")}
                              rows={3}
                              className="w-full rounded-2xl border border-amber-200 px-3 py-2 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                            />
                          ) : item.description ? (
                            <span className="block max-w-xs truncate text-stone-600" title={item.description}>
                              {item.description}
                            </span>
                          ) : (
                            <span className="text-xs text-stone-400">Sin descripcion</span>
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
                          {isEditing ? (
                            !categoriesLoaded ? (
                              <span className="text-xs text-stone-400">Cargando categorias...</span>
                            ) : categories.length ? (
                              <div className="flex flex-wrap gap-2">
                                {categories.map((category) => {
                                  const checked = formState.categoryIds.includes(category.id);
                                  return (
                                    <label
                                      key={category.id}
                                      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                        checked ? "border-amber-400 bg-amber-50 text-amber-900" : "border-amber-200 bg-white text-stone-600"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleCategoryToggle(category.id)}
                                        className="h-3 w-3 rounded border-amber-200 text-amber-600 focus:ring-amber-400"
                                      />
                                      {category.name}
                                    </label>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-xs text-stone-400">No hay categorias registradas.</span>
                            )
                          ) : item.categories && item.categories.length > 0 ? (
                            item.categories.map((c) => c.name).join(", ")
                          ) : (
                            "-"
                          )}
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
                              disabled={editingId !== null || createMode}
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
                      <td colSpan={9} className="px-4 py-4 text-center text-stone-600">
                        No hay productos que coincidan con tu busqueda.
                      </td>
                    </tr>
                  )}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-4 text-center text-stone-600">
                        No hay productos en inventario.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
