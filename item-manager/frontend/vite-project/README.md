# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



```markdown
# MERN Item Manager - Practice Lab Test

## Task Overview

You are given a starter MERN Item Manager with `name` and `description` fields. Your job is to add a **`price`** field, test locally, push to GitHub, and deploy frontend + backend separately.

## 📁 Project Structure

```
mern-item-manager/
├── backend/
│   ├── models/
│   │   └── Item.js
│   ├── routes/
│   │   └── items.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ItemForm.jsx
    │   │   └── ItemList.jsx
    │   ├── App.jsx
    │   └── api.js
    ├── .env
    └── package.json
```

---

## 🔧 Backend Setup

### `backend/package.json`

```json
{
  "name": "item-manager-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "mongoose": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

### `backend/.env`

```env
MONGO_URI=your_mongodb_atlas_connection_string_here
PORT=5000
```

### `backend/server.js`

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### `backend/models/Item.js` ⚠️ **YOU MUST ADD PRICE FIELD**

```javascript
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },   // ← NEW FIELD YOU ADD
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
```

### `backend/routes/items.js`

```javascript
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create item
router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,   // will work once you add price to the model
  });
  
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update item
router.put('/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
```

---

## 🎨 Frontend Setup

### `frontend/package.json`

```json
{
  "name": "item-manager-frontend",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9"
  }
}
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ When you deploy, update this to your deployed backend URL (e.g., Render URL)

### `frontend/src/api.js`

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getItems = () => API.get('/items');
export const createItem = (data) => API.post('/items', data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
```

### `frontend/src/components/ItemForm.jsx` ⚠️ **YOU MUST ADD PRICE INPUT**

```javascript
import { useState } from 'react';
import { createItem } from '../api';

export default function ItemForm({ onItemAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');   // ← NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createItem({ name, description, price: Number(price) });  // ← UPDATED
    setName('');
    setDescription('');
    setPrice('');  // ← NEW
    onItemAdded();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Add New Item</h2>
      <div>
        <input
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          placeholder="Price (e.g. 29.99)"
          type="number"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
      </div>   {/* ← NEW */}
      <button type="submit">Add Item</button>
    </form>
  );
}
```

### `frontend/src/components/ItemList.jsx` ⚠️ **YOU MUST DISPLAY PRICE**

```javascript
import { deleteItem } from '../api';

export default function ItemList({ items, onRefresh }) {
  const handleDelete = async (id) => {
    await deleteItem(id);
    onRefresh();
  };

  return (
    <div>
      <h2>Items</h2>
      {items.map(item => (
        <div key={item._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p><strong>Price: ${item.price}</strong></p>   {/* ← NEW */}
          <button onClick={() => handleDelete(item._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### `frontend/src/App.jsx`

```javascript
import { useEffect, useState } from 'react';
import { getItems } from './api';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';

function App() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await getItems();
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Item Manager</h1>
      <ItemForm onItemAdded={fetchItems} />
      <ItemList items={items} onRefresh={fetchItems} />
    </div>
  );
}

export default App;
```

---

## 🚀 Steps to Run Locally

### Backend Setup

```bash
cd backend
npm install
# Add your MongoDB URI to .env file
npm run dev
```

### Frontend Setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

### Access the Application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🌐 Deployment Checklist

| Step | Tool | What to do |
|------|------|-------------|
| **Push code** | GitHub | Create public repo, push both frontend & backend folders |
| **Deploy backend** | Render.com | New Web Service → connect repo → root dir: `backend` → start cmd: `node server.js` → add `MONGO_URI` env var |
| **Deploy frontend** | Vercel/Netlify | New site → connect repo → base dir: `frontend` → build cmd: `npm run build` → publish dir: `dist` → add `VITE_API_URL` env var with your Render URL |
| **Update API URL** | Frontend .env | Change `VITE_API_URL` to your live Render backend URL before deploying |

### Render Deployment Details

```bash
# Root Directory: backend
# Build Command: npm install
# Start Command: node server.js
# Environment Variables:
#   MONOGO_URI=your_mongodb_atlas_connection_string
```

### Vercel/Netlify Deployment Details

```bash
# Root Directory: frontend
# Build Command: npm run build
# Publish Directory: dist
# Environment Variables:
#   VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📝 Git Commands

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Add price field to MERN Item Manager"

# Add remote repository
git remote add origin https://github.com/yourusername/mern-item-manager.git

# Push to GitHub
git push -u origin main
```

---

## ✅ Testing Checklist

- [ ] Can add item with name, description, AND price
- [ ] Price displays correctly in the item list
- [ ] Delete functionality still works
- [ ] Backend API returns price field
- [ ] Frontend runs without errors
- [ ] Backend connects to MongoDB Atlas
- [ ] Backend deployed on Render and accessible
- [ ] Frontend deployed on Vercel/Netlify
- [ ] Frontend connects to deployed backend URL

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check MONGO_URI in .env, ensure network access is enabled |
| Price not saving | Ensure price is converted to Number before sending to backend |
| CORS error | Add your frontend URL to backend CORS configuration |
| Price not displaying | Check if item.price exists in the response data |
| Deployment build fails | Verify VITE_API_URL is set correctly in hosting platform |

---

## 📚 Resources

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

## 📄 License

This is a practice lab test project for educational purposes.
```