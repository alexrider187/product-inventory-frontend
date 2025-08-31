import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { productAPI } from "../../api/products";
import type { Product } from "../../types/product";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { Card, CardBody } from "../../components/ui/Card";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const data = await productAPI.getById(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!product) return;
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    } as Product);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !id) return;

    // Validation
    for (const [key, value] of Object.entries(product)) {
      if (key !== "_id" && key !== "user" && (value === "" || value === null || value === undefined)) {
        return setError(`${key} is required!`);
      }
    }

    const data = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (key !== "_id" && key !== "user") data.append(key, value.toString());
    });
    if (image) data.append("image", image);

    try {
      setLoading(true);
      setError(null);
      await productAPI.update(id, data);
      navigate("/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return (
    <p className="text-dashboard-text p-6 text-center">Loading product...</p>
  );

  const formFields: { name: keyof Product; placeholder: string; type: string }[] = [
    { name: "name", placeholder: "Product Name", type: "text" },
    { name: "sku", placeholder: "SKU", type: "text" },
    { name: "category", placeholder: "Category", type: "text" },
    { name: "quantity", placeholder: "Quantity", type: "number" },
    { name: "price", placeholder: "Price", type: "number" },
  ];

  return (
    <motion.div
      className="p-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-extrabold text-dashboard-primary mb-6 text-center">
        ✏️ Edit Product
      </h1>

      {error && <p className="mb-4 text-dashboard-danger text-center">{error}</p>}

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="p-6 space-y-4 shadow-lg border border-dashboard-border">
          <CardBody className="space-y-4">
            {formFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={product[field.name] as string | number}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Input
                multiline
                name="description"
                placeholder="Description"
                value={product.description}
                onChange={handleChange}
                required
                className="h-24 resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-dashboard-primary file:text-white hover:file:bg-blue-600"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex justify-center items-center w-full gap-2"
                disabled={loading}
              >
                {loading ? <Spinner size='md' colorClass="text-white" /> : "💾 Update Product"}
              </Button>
            </motion.div>
          </CardBody>
        </Card>
      </motion.form>
    </motion.div>
  );
}
