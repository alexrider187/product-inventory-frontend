import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { productAPI } from "../../api/products";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { Card, CardBody } from "../../components/ui/Card";

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    price: 0,
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return setError("Image is required!");
    for (const [key, value] of Object.entries(formData)) {
      if (value === "" || value === null || value === undefined) {
        return setError(`${key} is required!`);
      }
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value.toString())
    );
    data.append("image", image);

    try {
      setLoading(true);
      setError(null);
      await productAPI.create(data);
      navigate("/products");
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const formFields: { name: keyof ProductFormData; placeholder: string; type: string }[] = [
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
      <h1 className="text-3xl font-extrabold text-dashboard-text mb-6 text-center">
        ➕ Add New Product
      </h1>

      {error && (
        <p className="mb-4 text-dashboard-danger font-medium text-center">{error}</p>
      )}

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
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Input
                multiline
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="h-24 resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-dashboard-primary file:text-white hover:file:bg-blue-600"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                variant="success"
                size="lg"
                className="flex justify-center items-center w-full gap-2"
                disabled={loading}
              >
                {loading ? <Spinner size='md' colorClass="text-white" /> : "✅ Create Product"}
              </Button>
            </motion.div>
          </CardBody>
        </Card>
      </motion.form>
    </motion.div>
  );
}
