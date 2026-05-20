import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Lead } from '../models/Lead';
import { LeadStatus, LeadSource } from '../types';

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const names = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh',
  'Anjali Mehta', 'Rohan Verma', 'Kavya Nair', 'Arjun Reddy', 'Pooja Joshi',
  'Ravi Tiwari', 'Neha Agarwal', 'Suresh Yadav', 'Divya Sinha', 'Manish Mishra',
  'Aarti Shah', 'Deepak Chauhan', 'Swati Pandey', 'Karan Malhotra', 'Ritu Saxena',
  'Nikhil Bose', 'Shruti Kapoor', 'Gaurav Dubey', 'Meera Iyer', 'Aakash Trivedi',
];

const seed = async () => {
  await connectDB();
  console.log('Connected. Seeding...');

  // Create or find admin user
  let admin = await User.findOne({ email: 'admin@demo.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: 'demo1234',
      role: 'admin',
    });
    console.log('Created admin: admin@demo.com / demo1234');
  }

  // Create or find sales user
  let sales = await User.findOne({ email: 'sales@demo.com' });
  if (!sales) {
    sales = await User.create({
      name: 'Sales Demo',
      email: 'sales@demo.com',
      password: 'demo1234',
      role: 'sales',
    });
    console.log('Created sales: sales@demo.com / demo1234');
  }

  // Remove existing seeded leads
  await Lead.deleteMany({ createdBy: { $in: [admin._id, sales._id] } });

  const leads = names.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    createdBy: i % 3 === 0 ? sales._id : admin._id,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // staggered by day
  }));

  await Lead.insertMany(leads);
  console.log(`Seeded ${leads.length} leads across 3 pages.`);
  await mongoose.disconnect();
};

seed().catch((e) => { console.error(e); process.exit(1); });
