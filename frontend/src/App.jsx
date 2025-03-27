import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/items/";

const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddOrUpdateItem = async (e) => {
    e.preventDefault();
    if (!name || !category) return;

    try {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `${API_URL}${editingItem.id}/` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category }),
      });
      const updatedItem = await response.json();

      const updatedItems = editingItem
        ? items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        : [...items, updatedItem];

      setItems(updatedItems);
      setName("");
      setCategory("");
      setEditingItem(null);
    } catch (error) {
      console.error("Error adding/updating item:", error);
    }
  };

  const handleEditItem = (item) => {
    setName(item.name);
    setCategory(item.category);
    setEditingItem(item);
  };

  const handleDeleteItem = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item Management</h1>

      <form onSubmit={handleAddOrUpdateItem} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingItem ? "Update" : "Add"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Filter by category or name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {Object.keys(groupedItems).map((category) => (
        <div key={category} className="mb-6">
          <h2 className="text-lg font-bold mb-2">{category}</h2>
          <ul className="border rounded p-4">
            {groupedItems[category].map((item) => (
              <li key={item.id} className="flex justify-between items-center py-1">
                <span>{item.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;