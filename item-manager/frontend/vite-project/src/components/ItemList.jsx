import { useState } from 'react';
import { deleteItem, updateItem } from '../api';
export default function ItemList({ items, onRefresh }) {
const [editingId, setEditingId] = useState(null);
const [editData, setEditData] = useState({});
const handleDelete = async (id) => {
await deleteItem(id);
onRefresh();
};
const startEdit = (item) => {
setEditingId(item._id);
setEditData({ name: item.name, description: item.description, price: item.price, serialNumber: item.serialNumber || '' });
};
const handleEditChange = (e) => {
setEditData({ ...editData, [e.target.name]: e.target.value });
};
const handleEditSubmit = async (id) => {
await updateItem(id, { ...editData, price: Number(editData.price) });
setEditingId(null);
onRefresh();
};
return (
<div>
<h2>Items</h2>
{items.map(item => (
<div key={item._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
{editingId === item._id ? (
<div>
<div><input name="name" value={editData.name} onChange={handleEditChange} placeholder="Item name" required /></div>
<div><input name="description" value={editData.description} onChange={handleEditChange} placeholder="Description" required /></div>
<div><input name="price" type="number" value={editData.price} onChange={handleEditChange} placeholder="Price" required /></div>
<div><input name="serialNumber" value={editData.serialNumber} onChange={handleEditChange} placeholder="Serial Number" /></div>
<button onClick={() => handleEditSubmit(item._id)}>Save</button>
<button onClick={() => setEditingId(null)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
</div>
) : (
<div>
<h3>{item.name}</h3>
<p>{item.description}</p>
<p><strong>Price: ${item.price}</strong></p>
<p><strong>Serial Number:</strong> {item.serialNumber || 'N/A'}</p>
<button onClick={() => startEdit(item)}>Edit</button>
<button onClick={() => handleDelete(item._id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
</div>
)}
</div>
))}
</div>
);
}