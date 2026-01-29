import 'dotenv/config'
import mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

// ✅ Importă schema/modelurile tale existente
import { ProductSchema } from './products/product.schema'
import { UserSchema } from './users/user.schema'
import { OrderSchema } from './orders/schemas/order.schema'

type AnyObj = Record<string, any>

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL
  if (!uri) {
    throw new Error('Missing Mongo connection string. Set MONGODB_URI in .env')
  }

  await mongoose.connect(uri)
  console.log('✅ Connected to MongoDB')

  // MODELS (registrăm modele direct cu mongoose)
  const ProductModel = mongoose.model('Product', ProductSchema)
  const UserModel = mongoose.model('User', UserSchema)
  const OrderModel = mongoose.model('Order', OrderSchema)

  // --- CLEANUP (poți comenta dacă nu vrei să șteargă) ---
  await OrderModel.deleteMany({})
  await ProductModel.deleteMany({})
  await UserModel.deleteMany({})
  console.log('🧹 Cleared orders, products, users')

  // --- USERS ---
  const adminEmail = 'admin@fitnessway.test'
  const userEmail = 'user@fitnessway.test'
  const passwordPlain = 'Password123!' // pentru demo

  const passwordHash = await bcrypt.hash(passwordPlain, 10)

  const admin = await UserModel.create({
    email: adminEmail,
    password: passwordHash,
    role: 'admin',
  })

  const user = await UserModel.create({
    email: userEmail,
    password: passwordHash,
    role: 'user',
  })

  console.log('👤 Created users:')
  console.log(`   Admin: ${adminEmail} / ${passwordPlain}`)
  console.log(`   User:  ${userEmail} / ${passwordPlain}`)

  // --- PRODUCTS ---
  const products: AnyObj[] = [
    {
      name: 'Set gantere ajustabile',
      description: 'Greutăți ajustabile pentru antrenamente acasă.',
      price: 179,
      imageUrl:
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Bandă elastică (rezistență medie)',
      description: 'Perfectă pentru glute/upper body și încălzire.',
      price: 39,
      imageUrl:
        'https://images.unsplash.com/photo-1599058917212-d750089bc07f?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Saltea fitness antiderapantă',
      description: 'Confort + aderență pentru yoga, core și stretching.',
      price: 89,
      imageUrl:
        'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Coardă de sărit',
      description: 'Cardio rapid: 10 minute = super energizant.',
      price: 29,
      imageUrl:
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Kettlebell 12kg',
      description: 'Ideal pentru full-body, glute și core.',
      price: 149,
      imageUrl:
        'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Minge medicinală 5kg',
      description: 'Explozie, core și forță funcțională.',
      price: 119,
      imageUrl:
        'https://images.unsplash.com/photo-1599447421416-3414500a93a3?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Rolă pentru masaj (foam roller)',
      description: 'Recuperare musculară și mobilitate.',
      price: 59,
      imageUrl:
        'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Mănuși fitness',
      description: 'Protecție și grip pentru sală.',
      price: 49,
      imageUrl:
        'https://images.unsplash.com/photo-1517630800677-932d836ab680?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Sticlă de apă (BPA free)',
      description: 'Hidratare constantă pe parcursul zilei.',
      price: 25,
      imageUrl:
        'https://images.unsplash.com/photo-1526401485004-2fda9f4b05d0?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Centură suport lombar',
      description: 'Stabilitate pentru exerciții cu greutăți.',
      price: 99,
      imageUrl:
        'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Set benzi mini (glute bands)',
      description: '3 niveluri de rezistență pentru glute & activare.',
      price: 45,
      imageUrl:
        'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Yoga block (cork)',
      description: 'Stabilitate la stretching și posturi yoga.',
      price: 35,
      imageUrl:
        'https://images.unsplash.com/photo-1599447421416-3414500a93a3?auto=format&fit=crop&w=900&q=80',
    },
  ]

  const createdProducts = await ProductModel.insertMany(products)
  console.log(`🛍️ Inserted products: ${createdProducts.length}`)

  // --- ORDERS (opțional, dar foarte util pentru demo admin) ---
  // dacă Order are câmpurile checkout (fullName/phone/address/paymentMethod) pe care le-ai adăugat,
  // scriptul le include. Dacă nu, comentează blocul acesta.
  const p1 = createdProducts[0]
  const p2 = createdProducts[1]

  await OrderModel.create({
    userId: String(user._id),
    email: user.email,
    fullName: 'Bianca User',
    phone: '07xx xxx xxx',
    address: 'Str. Exemplu 10, Cluj-Napoca',
    paymentMethod: 'cash',
    notes: 'Livrare după ora 17:00',
    items: [
      { productId: String(p1._id), name: p1.name, price: p1.price, qty: 1 },
      { productId: String(p2._id), name: p2.name, price: p2.price, qty: 2 },
    ],
    total: p1.price * 1 + p2.price * 2,
    status: 'pending',
  })

  await OrderModel.create({
    userId: String(user._id),
    email: user.email,
    fullName: 'Bianca User',
    phone: '07xx xxx xxx',
    address: 'Str. Exemplu 10, Cluj-Napoca',
    paymentMethod: 'card',
    items: [{ productId: String(p2._id), name: p2.name, price: p2.price, qty: 1 }],
    total: p2.price * 1,
    status: 'paid',
  })

  console.log('📦 Inserted demo orders (2)')

  await mongoose.disconnect()
  console.log('✅ Done. Disconnected.')
}

main().catch(async (err) => {
  console.error(err)
  try {
    await mongoose.disconnect()
  } catch {}
  process.exit(1)
})
